package com.veterinary.pet.dto;

import com.veterinary.pet.entity.EstadoUsuario;

public record UsuarioRequest(
        String nombre,
        String apellido,
        String correo,
        String password,
        EstadoUsuario estado,
        Long idRol) {
}
