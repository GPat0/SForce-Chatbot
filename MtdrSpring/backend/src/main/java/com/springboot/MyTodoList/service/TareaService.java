package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.Tarea;
import com.springboot.MyTodoList.repository.TareaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Date;

@Service
public class TareaService {

    @Autowired
    private TareaRepository tareaRepository;

    public Tarea crearTarea(Tarea tarea) {
        // Validaciones básicas
        if (tarea.getNombre() == null || tarea.getDescripcion() == null ||
            tarea.getFechaInicio() == null || tarea.getFechaFin() == null ||
            tarea.getFechaInicio().after(tarea.getFechaFin()) ||
            tarea.getPrioridad() == null) {
            throw new IllegalArgumentException("Información de la tarea no válida");
        }
        // Guardar la tarea en la base de datos
        return tareaRepository.save(tarea);
    }
}
