package com.springboot.MyTodoList.controller;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.ReplyKeyboardMarkup;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.KeyboardRow;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

import com.springboot.MyTodoList.model.Proyecto;
import com.springboot.MyTodoList.model.Tarea;
import com.springboot.MyTodoList.model.ToDoItem;
import com.springboot.MyTodoList.service.ProyectoService;
import com.springboot.MyTodoList.service.TareaService;
import com.springboot.MyTodoList.service.ToDoItemService;
import com.springboot.MyTodoList.util.BotCommands;
import com.springboot.MyTodoList.util.BotHelper;
import com.springboot.MyTodoList.util.BotLabels;
import com.springboot.MyTodoList.util.BotMessages;

public class ToDoItemBotController extends TelegramLongPollingBot {

    private static final Logger logger = LoggerFactory.getLogger(ToDoItemBotController.class);
    private ToDoItemService toDoItemService;
    private ProyectoService proyectoService;
    private TareaService tareaService;
    private String botName;

    public ToDoItemBotController(String botToken, String botName, ToDoItemService toDoItemService, ProyectoService proyectoService, TareaService tareaService) {
        super(botToken);
        this.toDoItemService = toDoItemService;
        this.proyectoService = proyectoService;
        this.tareaService = tareaService;
        this.botName = botName;
    }

    @Override
    public void onUpdateReceived(Update update) {
        if (update.hasMessage() && update.getMessage().hasText()) {
            String messageTextFromTelegram = update.getMessage().getText();
            long chatId = update.getMessage().getChatId();

            if (messageTextFromTelegram.equals(BotCommands.START_COMMAND.getCommand())
                    || messageTextFromTelegram.equals(BotLabels.SHOW_MAIN_SCREEN.getLabel())) {

                SendMessage messageToTelegram = new SendMessage();
                messageToTelegram.setChatId(chatId);
                messageToTelegram.setText(BotMessages.HELLO_MYTODO_BOT.getMessage());

                ReplyKeyboardMarkup keyboardMarkup = new ReplyKeyboardMarkup();
                keyboardMarkup.setResizeKeyboard(true);
                keyboardMarkup.setOneTimeKeyboard(false);

                List<KeyboardRow> keyboard = new ArrayList<>();

                // Row for main screen control
                KeyboardRow mainScreenRow = new KeyboardRow();
                mainScreenRow.add(BotLabels.SHOW_MAIN_SCREEN.getLabel());
                mainScreenRow.add(BotLabels.HIDE_MAIN_SCREEN.getLabel());
                keyboard.add(mainScreenRow);

                // Existing buttons
                KeyboardRow firstRow = new KeyboardRow();
                firstRow.add(BotLabels.LIST_ALL_ITEMS.getLabel());
                firstRow.add(BotLabels.ADD_NEW_ITEM.getLabel());
                keyboard.add(firstRow);

                // New row for project and task management
                KeyboardRow projectTaskRow = new KeyboardRow();
                projectTaskRow.add(BotLabels.LIST_PROJECTS.getLabel());
                projectTaskRow.add(BotLabels.LIST_TASKS.getLabel());
                keyboard.add(projectTaskRow);

                KeyboardRow addProjectTaskRow = new KeyboardRow();
                addProjectTaskRow.add(BotLabels.ADD_PROJECT.getLabel());
                addProjectTaskRow.add(BotLabels.ADD_TASK.getLabel());
                keyboard.add(addProjectTaskRow);

                KeyboardRow updateProjectTaskRow = new KeyboardRow();
                updateProjectTaskRow.add(BotLabels.UPDATE_PROJECT.getLabel());
                updateProjectTaskRow.add(BotLabels.UPDATE_TASK.getLabel());
                keyboard.add(updateProjectTaskRow);

                KeyboardRow deleteProjectTaskRow = new KeyboardRow();
                deleteProjectTaskRow.add(BotLabels.DELETE_PROJECT.getLabel());
                deleteProjectTaskRow.add(BotLabels.DELETE_TASK.getLabel());
                keyboard.add(deleteProjectTaskRow);

                keyboardMarkup.setKeyboard(keyboard);
                messageToTelegram.setReplyMarkup(keyboardMarkup);

                try {
                    execute(messageToTelegram);
                } catch (TelegramApiException e) {
                    logger.error(e.getLocalizedMessage(), e);
                }

            } else if (messageTextFromTelegram.equals(BotLabels.HIDE_MAIN_SCREEN.getLabel())) {
                // Cuando se selecciona "Hide Main Screen", envía un mensaje y elimina el teclado
                BotHelper.sendMessageToTelegram(chatId, BotMessages.BYE.getMessage(), this, true);

            } else if (messageTextFromTelegram.equals(BotLabels.LIST_PROJECTS.getLabel())) {
                List<Proyecto> projects = proyectoService.findAll();
                StringBuilder responseText = new StringBuilder("Projects:\n");
                projects.forEach(proyecto -> responseText.append("- ").append(proyecto.getNombre()).append("\n"));
                BotHelper.sendMessageToTelegram(chatId, responseText.toString(), this, false);

            } else if (messageTextFromTelegram.equals(BotLabels.ADD_PROJECT.getLabel())) {
                BotHelper.sendMessageToTelegram(chatId, "Please send the project name.", this, false);

            } else if (messageTextFromTelegram.equals(BotLabels.UPDATE_PROJECT.getLabel())) {
                BotHelper.sendMessageToTelegram(chatId, "Please send the project ID and new details.", this, false);

            } else if (messageTextFromTelegram.equals(BotLabels.DELETE_PROJECT.getLabel())) {
                BotHelper.sendMessageToTelegram(chatId, "Please send the project ID to delete.", this, false);

            } else if (messageTextFromTelegram.equals(BotLabels.LIST_TASKS.getLabel())) {
                List<Tarea> tasks = tareaService.findAll();
                StringBuilder responseText = new StringBuilder("Tasks:\n");
                tasks.forEach(tarea -> responseText.append("- ").append(tarea.getDescripcion()).append("\n"));
                BotHelper.sendMessageToTelegram(chatId, responseText.toString(), this, false);

            } else if (messageTextFromTelegram.equals(BotLabels.ADD_TASK.getLabel())) {
                BotHelper.sendMessageToTelegram(chatId, "Please send the task details.", this, false);

            } else if (messageTextFromTelegram.equals(BotLabels.UPDATE_TASK.getLabel())) {
                BotHelper.sendMessageToTelegram(chatId, "Please send the task ID and new details.", this, false);

            } else if (messageTextFromTelegram.equals(BotLabels.DELETE_TASK.getLabel())) {
                BotHelper.sendMessageToTelegram(chatId, "Please send the task ID to delete.", this, false);

            } else {
                BotHelper.sendMessageToTelegram(chatId, "Unrecognized command. Please choose an option from the menu.", this, false);
            }
        }
    }

    @Override
    public String getBotUsername() {		
        return botName;
    }

    // Additional CRUD methods for ToDoItems, Projects, and Tasks
    public List<ToDoItem> getAllToDoItems() { 
        return toDoItemService.findAll();
    }

    public ResponseEntity<ToDoItem> getToDoItemById(@PathVariable int id) {
        try {
            ResponseEntity<ToDoItem> responseEntity = toDoItemService.getItemById(id);
            return new ResponseEntity<>(responseEntity.getBody(), HttpStatus.OK);
        } catch (Exception e) {
            logger.error(e.getLocalizedMessage(), e);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity addToDoItem(@RequestBody ToDoItem todoItem) throws Exception {
        ToDoItem td = toDoItemService.addToDoItem(todoItem);
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("location", "" + td.getID());
        responseHeaders.set("Access-Control-Expose-Headers", "location");

        return ResponseEntity.ok().headers(responseHeaders).build();
    }

    public ResponseEntity updateToDoItem(@RequestBody ToDoItem toDoItem, @PathVariable int id) {
        try {
            ToDoItem toDoItem1 = toDoItemService.updateToDoItem(id, toDoItem);
            return new ResponseEntity<>(toDoItem1, HttpStatus.OK);
        } catch (Exception e) {
            logger.error(e.getLocalizedMessage(), e);
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<Boolean> deleteToDoItem(@PathVariable("id") int id) {
        Boolean flag = false;
        try {
            flag = toDoItemService.deleteToDoItem(id);
            return new ResponseEntity<>(flag, HttpStatus.OK);
        } catch (Exception e) {
            logger.error(e.getLocalizedMessage(), e);
            return new ResponseEntity<>(flag, HttpStatus.NOT_FOUND);
        }
    }
}
