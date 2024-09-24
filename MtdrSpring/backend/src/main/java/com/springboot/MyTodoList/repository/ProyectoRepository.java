package com.springboot.MyTodoList.repository;

import com.springboot.MyTodoList.model.Proyecto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProyectoRepository extends JpaRepository<Proyecto, Long> {
    //métodos personalizados
}