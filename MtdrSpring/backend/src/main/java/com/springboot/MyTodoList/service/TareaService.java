package com.springboot.MyTodoList.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.springboot.MyTodoList.model.Tarea;
import com.springboot.MyTodoList.repository.TareaRepository;
import com.springboot.MyTodoList.repository.ProyectoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class TareaService {

    @Autowired
    private TareaRepository tareaRepository;

    @Autowired
    private ProyectoRepository pr;

    private static final Logger logger = LoggerFactory.getLogger(TareaService.class);

    public Tarea crearTarea(Long proyectId, Tarea tarea) {
        pr.findById(proyectId).map(proyecto -> {
            tarea.setProyecto(proyecto);
            return tareaRepository.save(tarea);
        });
        return tarea;
    }

    public List<Tarea> findAll() {
        return tareaRepository.findAll();
    }

    public Optional<Tarea> actualizarTarea(Long id, Tarea tarea) {
        return tareaRepository.findById(id)
            .map(tareaExistente -> {
                tareaExistente.setDescripcion(tarea.getDescripcion());
                tareaExistente.setEstatus(tarea.getEstatus());
                tareaExistente.setTiempoEstimado(tarea.getTiempoEstimado());
                tareaExistente.setTiempoReal(tarea.getTiempoReal());
                tareaExistente.setFechaFinalizacion(tarea.getFechaFinalizacion());
                return tareaRepository.save(tareaExistente);
            });
    }

    public boolean eliminarTarea(Long id) {
        if (tareaRepository.existsById(id)) {
            tareaRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Optional<Tarea> obtenerTareaPorId(Long id) {
        return tareaRepository.findById(id);
    }
}
