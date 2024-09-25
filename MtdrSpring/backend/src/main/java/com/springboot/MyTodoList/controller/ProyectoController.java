package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.model.Proyecto;
import com.springboot.MyTodoList.service.ProyectoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/proyectos")
public class ProyectoController {

    @Autowired
    private ProyectoService proyectoService;

    // Crear un nuevo proyecto
    @PostMapping("/crear")
    public ResponseEntity<Proyecto> crearProyecto(@RequestBody Proyecto proyecto) {
        try {
            Proyecto nuevoProyecto = proyectoService.crearProyecto(proyecto);
            return ResponseEntity.ok(nuevoProyecto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Listar todos los proyectos
    @GetMapping("/listar")
    public ResponseEntity<Iterable<Proyecto>> listarProyectos() {
        return ResponseEntity.ok(proyectoService.listarTodosLosProyectos());
    }

    // Actualizar un proyecto existente
    @PutMapping("/actualizar/{id}")
    public ResponseEntity<Proyecto> actualizarProyecto(@PathVariable Long id, @RequestBody Proyecto proyecto) {
        try {
            Proyecto proyectoActualizado = proyectoService.actualizarProyecto(id, proyecto);
            return ResponseEntity.ok(proyectoActualizado);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Eliminar un proyecto
    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminarProyecto(@PathVariable Long id) {
        try {
            proyectoService.eliminarProyecto(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Obtener un proyecto por ID
    @GetMapping("/obtener/{id}")
    public ResponseEntity<Proyecto> obtenerProyectoPorId(@PathVariable Long id) {
        Proyecto proyecto = proyectoService.obtenerProyectoPorId(id);
        if (proyecto != null) {
            return ResponseEntity.ok(proyecto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
