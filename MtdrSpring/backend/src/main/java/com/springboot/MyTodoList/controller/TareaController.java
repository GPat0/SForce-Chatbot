package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.model.Tarea;
import com.springboot.MyTodoList.service.TareaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import javax.validation.Valid;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tareas")
public class TareaController {

    @Autowired
    private TareaService tareaService;

    private static final Logger logger = LoggerFactory.getLogger(TareaController.class);

    // Get all tasks
    @GetMapping
    public List<Tarea> getAllTasks() {
        List<Tarea> tasks = tareaService.findAll();
        logger.info("Fetched all tasks, total: {}", tasks.size());
        return tasks;
    }

    // Create a new task
    @PostMapping
    public ResponseEntity<?> crearTask(@Valid @RequestBody Tarea tarea, BindingResult bindingResult) {
        logger.debug("Received task creation request: {}", tarea);

        if (bindingResult.hasErrors()) {
            List<String> errors = bindingResult.getFieldErrors().stream()
                    .map(FieldError::getDefaultMessage)
                    .collect(Collectors.toList());
            logger.error("Validation errors: {}", errors);
            return ResponseEntity.badRequest().body(errors);
        }

        try {
            Tarea newTask = tareaService.crearTarea(tarea);
            logger.info("Task created with ID: {}", newTask.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(newTask);
        } catch (IllegalArgumentException e) {
            logger.error("Error creating task: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            logger.error("Unexpected error creating task: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred");
        }
    }


    // Get a single task by ID
    @GetMapping("/{id}")
    public ResponseEntity<Tarea> getTaskById(@PathVariable Long id) {
        try {
            Optional<Tarea> tarea = tareaService.obtenerTareaPorId(id);
            if (tarea.isPresent()) {
                logger.info("Fetched task with ID: {}", id);
                return ResponseEntity.ok(tarea.get());
            } else {
                logger.warn("Task with ID {} not found", id);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error fetching task by ID {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Update an existing task
    @PutMapping("/{id}")
    public ResponseEntity<Tarea> updateTask(@PathVariable Long id, @Valid @RequestBody Tarea tarea) {
        try {
            Optional<Tarea> updatedTarea = tareaService.actualizarTarea(id, tarea);
            if (updatedTarea.isPresent()) {
                logger.info("Updated task with ID: {}", id);
                return ResponseEntity.ok(updatedTarea.get());
            } else {
                logger.warn("Failed to update, task with ID {} not found", id);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error updating task with ID {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Delete a task
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        try {
            boolean isDeleted = tareaService.eliminarTarea(id);
            if (isDeleted) {
                logger.info("Deleted task with ID: {}", id);
                return ResponseEntity.ok().build();
            } else {
                logger.warn("Failed to delete, task with ID {} not found", id);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error deleting task with ID {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}