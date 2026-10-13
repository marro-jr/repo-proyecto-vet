package com.veterinary.pet.dto;

import java.time.LocalDate;

import com.veterinary.pet.entity.EstadoUsuario;

public record UsuarioResponse(
        Long idUsuario,
        String nombre,
        String apellido,
        String correo,
        EstadoUsuario estado,
        LocalDate fechaCreacion,
        Long idRol,
        String nombreRol) {
}
