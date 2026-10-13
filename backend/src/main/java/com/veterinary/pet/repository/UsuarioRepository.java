package com.veterinary.pet.repository;

import java.util.Optional;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.veterinary.pet.entity.Usuario;


@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByCorreo(String correo);

    @Query("SELECT u FROM Usuario u JOIN FETCH u.rol ORDER BY u.idUsuario")
    List<Usuario> listarConRol();
}
