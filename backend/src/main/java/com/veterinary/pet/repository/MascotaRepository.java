package com.veterinary.pet.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.veterinary.pet.entity.Mascota;

public interface MascotaRepository extends JpaRepository<Mascota, Long> {
}
