package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.Proyecto;
import com.springboot.MyTodoList.repository.ProyectoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.List;

@Service
public class ProyectoService {

    @Autowired
    private ProyectoRepository proyectoRepository;

    // Crear un nuevo proyecto
    public Proyecto crearProyecto(Proyecto proyecto) {
        // Aquí podrías incluir lógica adicional antes de guardar el proyecto
        return proyectoRepository.save(proyecto);
    }

    // Listar todos los proyectos
    public List<Proyecto> findAll() {
    return proyectoRepository.findAll(); // This should return a List directly if using Spring Data JPA
    }

    

    // Actualizar un proyecto existente
    public Proyecto actualizarProyecto(Long id, Proyecto proyecto) {
        return proyectoRepository.findById(id)
                .map(proyectoExistente -> {
                    proyectoExistente.setNombre(proyecto.getNombre());
                    proyectoExistente.setEstatus(proyecto.getEstatus());
                    proyectoExistente.setFechaInicio(proyecto.getFechaInicio());
                    proyectoExistente.setFechaFin(proyecto.getFechaFin());
                    proyectoExistente.setTareas(proyecto.getTareas());
                    return proyectoRepository.save(proyectoExistente);
                }).orElseThrow(() -> new RuntimeException("Proyecto no encontrado"));
    }

    // Eliminar un proyecto
    public void eliminarProyecto(Long id) {
        proyectoRepository.deleteById(id);
    }

    // Obtener un proyecto por ID
    public Proyecto obtenerProyectoPorId(Long id) {
        Optional<Proyecto> proyecto = proyectoRepository.findById(id);
        return proyecto.orElse(null);
    }
}
