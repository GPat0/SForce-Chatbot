package com.springboot.MyTodoList.model;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "TASK") // Ensure this is the correct schema and table name
public class Tarea {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "ID")
    private Long id;

    @Column(name = "DESCRIPTION")
    private String descripcion;

    @Column(name = "STATUS")
    private String estatus;

    @Column(name = "ESTIMATEDTIME")
    private Float tiempoEstimado;

    @Column(name = "ACTUALTIME")
    private Float tiempoReal;

    @Column(name = "COMPLETIONDATE")
    private Date fechaFinalizacion;

    @Column(name = "QUALITYSCORE")
    private Integer puntuacionCalidad;

    @Column(name = "TASKEFFICIENCY")
    private Float eficienciaTarea;

    @Column(name = "TASKPRODUCTIVITY")
    private Float productividadTarea;

    @ManyToOne
    @JoinColumn(name = "PROJECTID", nullable = false)
    private Proyecto proyecto;

    // Getters
    public Long getId() {
        return id;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public String getEstatus() {
        return estatus;
    }

    public Float getTiempoEstimado() {
        return tiempoEstimado;
    }

    public Float getTiempoReal() {
        return tiempoReal;
    }

    public Date getFechaFinalizacion() {
        return fechaFinalizacion;
    }

    public Integer getPuntuacionCalidad() {
        return puntuacionCalidad;
    }

    public Float getEficienciaTarea() {
        return eficienciaTarea;
    }

    public Float getProductividadTarea() {
        return productividadTarea;
    }

    public Proyecto getProyecto() {
        return proyecto;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public void setEstatus(String estatus) {
        this.estatus = estatus;
    }

    public void setTiempoEstimado(Float tiempoEstimado) {
        this.tiempoEstimado = tiempoEstimado;
    }

    public void setTiempoReal(Float tiempoReal) {
        this.tiempoReal = tiempoReal;
    }

    public void setFechaFinalizacion(Date fechaFinalizacion) {
        this.fechaFinalizacion = fechaFinalizacion;
    }

    public void setPuntuacionCalidad(Integer puntuacionCalidad) {
        this.puntuacionCalidad = puntuacionCalidad;
    }

    public void setEficienciaTarea(Float eficienciaTarea) {
        this.eficienciaTarea = eficienciaTarea;
    }

    public void setProductividadTarea(Float productividadTarea) {
        this.productividadTarea = productividadTarea;
    }

    public void setProyecto(Proyecto proyecto) {
        this.proyecto = proyecto;
    }
}
