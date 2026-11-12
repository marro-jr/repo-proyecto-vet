package com.veterinary.pet.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.veterinary.pet.entity.Cita;

public interface CitaRepository extends JpaRepository<Cita, Long> {
    List<Cita> findAllByOrderByFechaHoraAsc();
}
