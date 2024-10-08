package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.Tarea;
import com.springboot.MyTodoList.repository.TareaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class TareaService {

    @Autowired
    private TareaRepository tareaRepository;

    // Create a new task
    public Tarea crearTarea(Tarea tarea) {
        if (tarea.getDescripcion() == null || tarea.getEstatus() == null ||
            tarea.getTiempoEstimado() == null || tarea.getFechaFinalizacion() == null) {
            throw new IllegalArgumentException("Task information is invalid");
        }
        return tareaRepository.save(tarea);
    }

    // List all tasks
    public List<Tarea> findAll() {
        return tareaRepository.findAll();
    }

    // Update an existing task
    public Optional<Tarea> actualizarTarea(Long id, Tarea tarea) {
        return tareaRepository.findById(id)
            .map(tareaExistente -> {
                tareaExistente.setDescripcion(tarea.getDescripcion());
                tareaExistente.setEstatus(tarea.getEstatus());
                tareaExistente.setTiempoEstimado(tarea.getTiempoEstimado());
                tareaExistente.setTiempoReal(tarea.getTiempoReal());
                tareaExistente.setFechaFinalizacion(tarea.getFechaFinalizacion());
                tareaExistente.setPuntuacionCalidad(tarea.getPuntuacionCalidad());
                tareaExistente.setEficienciaTarea(tarea.getEficienciaTarea());
                tareaExistente.setProductividadTarea(tarea.getProductividadTarea());
                return tareaRepository.save(tareaExistente);
            });
    }

    // Delete a task
    public boolean eliminarTarea(Long id) {
        if (tareaRepository.existsById(id)) {
            tareaRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Get a task by ID
    public Optional<Tarea> obtenerTareaPorId(Long id) {
        return tareaRepository.findById(id);
    }
}
