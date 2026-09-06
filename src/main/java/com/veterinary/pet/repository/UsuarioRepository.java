package com.veterinary.pet.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.veterinary.pet.entity.Usuario;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Usuario findByCorreo(String correo);

    boolean existsByCorreo(String correo);

}
