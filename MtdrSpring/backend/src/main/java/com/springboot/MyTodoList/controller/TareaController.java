package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.model.Tarea;
import com.springboot.MyTodoList.service.TareaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tareas")
public class TareaController {

    @Autowired
    private TareaService tareaService;

    // Crear una nueva tarea
    @PostMapping("/crear")
    public ResponseEntity<Tarea> crearTarea(@RequestBody Tarea tarea) {
        try {
            Tarea nuevaTarea = tareaService.crearTarea(tarea);
            return ResponseEntity.ok(nuevaTarea);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Listar todas las tareas
    @GetMapping("/listar")
    public ResponseEntity<Iterable<Tarea>> listarTareas() {
        return ResponseEntity.ok(tareaService.listarTodasLasTareas());
    }

    // Actualizar una tarea existente
    @PutMapping("/actualizar/{id}")
    public ResponseEntity<Tarea> actualizarTarea(@PathVariable Long id, @RequestBody Tarea tarea) {
        try {
            Tarea tareaActualizada = tareaService.actualizarTarea(id, tarea);
            return ResponseEntity.ok(tareaActualizada);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Eliminar una tarea
    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminarTarea(@PathVariable Long id) {
        try {
            tareaService.eliminarTarea(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Obtener una tarea por ID
    @GetMapping("/obtener/{id}")
    public ResponseEntity<Tarea> obtenerTareaPorId(@PathVariable Long id) {
        Tarea tarea = tareaService.obtenerTareaPorId(id);
        if (tarea != null) {
            return ResponseEntity.ok(tarea);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
