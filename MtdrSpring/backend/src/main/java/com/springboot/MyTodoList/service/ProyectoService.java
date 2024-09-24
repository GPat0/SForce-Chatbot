package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.Proyecto;
import com.springboot.MyTodoList.repository.ProyectoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Date;

@Service
public class ProyectoService {

    @Autowired
    private ProyectoRepository proyectoRepository;

    public Proyecto crearProyecto(Proyecto proyecto) {
        // Validaciones básicas
        if (proyecto.getNombre() == null || proyecto.getDescripcion() == null ||
            proyecto.getFechaInicio() == null || proyecto.getFechaFin() == null ||
            proyecto.getFechaInicio().after(proyecto.getFechaFin())) {
            throw new IllegalArgumentException("Información del proyecto no válida");
        }
        // Guardar el proyecto en la base de datos
        return proyectoRepository.save(proyecto);
    }
}
