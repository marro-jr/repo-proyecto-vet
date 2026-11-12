package com.veterinary.pet.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.veterinary.pet.entity.Propietario;

public interface PropietarioRepository extends JpaRepository<Propietario, Long> {
}
