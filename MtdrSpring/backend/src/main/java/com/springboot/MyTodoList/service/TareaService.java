package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.Tarea;
import com.springboot.MyTodoList.repository.TareaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.List;

@Service
public class TareaService {

    @Autowired
    private TareaRepository tareaRepository;

    // Crear una nueva tarea
    public Tarea crearTarea(Tarea tarea) {
        // Validaciones más complejas según el nuevo modelo
        if (tarea.getDescripcion() == null || tarea.getEstatus() == null ||
            tarea.getTiempoEstimado() == null || tarea.getFechaFinalizacion() == null) {
            throw new IllegalArgumentException("Información de la tarea no válida");
        }
        return tareaRepository.save(tarea);
    }

    public Iterable<Tarea> listarTodasLasTareas() {
    return tareaRepository.findAll();
    }

    public List<Tarea> findAll() {
    return tareaRepository.findAll();
    }

    // Actualizar una tarea existente
    public Tarea actualizarTarea(Long id, Tarea tarea) {
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
                }).orElseThrow(() -> new RuntimeException("Tarea no encontrada"));
    }

    // Eliminar una tarea
    public void eliminarTarea(Long id) {
        tareaRepository.deleteById(id);
    }

    // Obtener una tarea por ID
    public Tarea obtenerTareaPorId(Long id) {
        Optional<Tarea> tarea = tareaRepository.findById(id);
        return tarea.orElse(null);
    }
}
