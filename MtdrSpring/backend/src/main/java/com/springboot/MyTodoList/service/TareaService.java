package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.Tarea;
import com.springboot.MyTodoList.model.Proyecto;
import com.springboot.MyTodoList.repository.TareaRepository;
import com.springboot.MyTodoList.repository.ProyectoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;
import java.util.Optional;

@Service
public class TareaService {

    private static final Logger logger = LoggerFactory.getLogger(TareaService.class);

    @Autowired
    private TareaRepository tareaRepository;

    @Autowired
    private ProyectoRepository proyectoRepository;

    // Create a new task
    @Transactional
    public Tarea crearTarea(Tarea tarea) {
        logger.debug("Attempting to create a new task: {}", tarea);

        if (tarea.getDescripcion() == null || tarea.getEstatus() == null ||
                tarea.getTiempoEstimado() == null || tarea.getFechaFinalizacion() == null) {
            logger.error("Task information is invalid: {}", tarea);
            throw new IllegalArgumentException("Task information is incomplete or invalid");
        }

        if (tarea.getProyecto() == null) {
            logger.error("Proyecto is null for task: {}", tarea);
            throw new IllegalArgumentException("Proyecto is required for creating a task");
        }

        if (tarea.getProyecto().getId() == null) {
            logger.error("Proyecto ID is null for task: {}", tarea);
            throw new IllegalArgumentException("Proyecto ID is required for creating a task");
        }

        // Fetch the Proyecto entity
        Proyecto proyecto = proyectoRepository.findById(tarea.getProyecto().getId())
                .orElseThrow(() -> {
                    logger.error("Proyecto not found with ID: {}", tarea.getProyecto().getId());
                    return new IllegalArgumentException("Proyecto not found with ID: " + tarea.getProyecto().getId());
                });

        // Set the fetched Proyecto to ensure it's not transient
        tarea.setProyecto(proyecto);

        logger.debug("Saving task with proyecto: {}", proyecto);
        Tarea savedTarea = tareaRepository.save(tarea);
        logger.info("Task created successfully with ID: {}", savedTarea.getId());

        return savedTarea;
    }

    // List all tasks
    public List<Tarea> findAll() {
        logger.debug("Fetching all tasks");
        List<Tarea> tasks = tareaRepository.findAll();
        logger.debug("Found {} tasks", tasks.size());
        return tasks;
    }

    // Update an existing task
    public Optional<Tarea> actualizarTarea(Long id, Tarea tarea) {
        logger.debug("Attempting to update task with ID: {}", id);
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
                    Tarea updatedTarea = tareaRepository.save(tareaExistente);
                    logger.info("Task updated successfully with ID: {}", updatedTarea.getId());
                    return updatedTarea;
                });
    }

    // Delete a task
    public boolean eliminarTarea(Long id) {
        logger.debug("Attempting to delete task with ID: {}", id);
        if (tareaRepository.existsById(id)) {
            tareaRepository.deleteById(id);
            logger.info("Task deleted successfully with ID: {}", id);
            return true;
        }
        logger.warn("Task not found for deletion with ID: {}", id);
        return false;
    }

    // Get a task by ID
    public Optional<Tarea> obtenerTareaPorId(Long id) {
        logger.debug("Fetching task with ID: {}", id);
        return tareaRepository.findById(id);
    }
}