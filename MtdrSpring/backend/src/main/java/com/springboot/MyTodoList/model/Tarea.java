package com.springboot.MyTodoList.model;

import javax.persistence.*;
import java.util.Date;

@Entity
public class Tarea {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String descripcion;
    private String estatus;  // Corresponde a "Status" en el diagrama
    private Float tiempoEstimado;  // Corresponde a "EstimatedTime" en el diagrama
    private Float tiempoReal;  // Corresponde a "ActualTime" en el diagrama
    private Date fechaFinalizacion;  // Corresponde a "CompletionDate" en el diagrama
    private Integer puntuacionCalidad;  // Corresponde a "QualityScore" en el diagrama
    private Float eficienciaTarea;  // Corresponde a "TaskEfficiency" en el diagrama
    private Float productividadTarea;  // Corresponde a "TaskProductivity" en el diagrama

    @ManyToOne
    @JoinColumn(name = "proyecto_id", nullable = false)
    private Proyecto proyecto;

    // Getters y setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getEstatus() {
        return estatus;
    }

    public void setEstatus(String estatus) {
        this.estatus = estatus;
    }

    public Float getTiempoEstimado() {
        return tiempoEstimado;
    }

    public void setTiempoEstimado(Float tiempoEstimado) {
        this.tiempoEstimado = tiempoEstimado;
    }

    public Float getTiempoReal() {
        return tiempoReal;
    }

    public void setTiempoReal(Float tiempoReal) {
        this.tiempoReal = tiempoReal;
    }

    public Date getFechaFinalizacion() {
        return fechaFinalizacion;
    }

    public void setFechaFinalizacion(Date fechaFinalizacion) {
        this.fechaFinalizacion = fechaFinalizacion;
    }

    public Integer getPuntuacionCalidad() {
        return puntuacionCalidad;
    }

    public void setPuntuacionCalidad(Integer puntuacionCalidad) {
        this.puntuacionCalidad = puntuacionCalidad;
    }

    public Float getEficienciaTarea() {
        return eficienciaTarea;
    }

    public void setEficienciaTarea(Float eficienciaTarea) {
        this.eficienciaTarea = eficienciaTarea;
    }

    public Float getProductividadTarea() {
        return productividadTarea;
    }

    public void setProductividadTarea(Float productividadTarea) {
        this.productividadTarea = productividadTarea;
    }

    public Proyecto getProyecto() {
        return proyecto;
    }

    public void setProyecto(Proyecto proyecto) {
        this.proyecto = proyecto;
    }
}
