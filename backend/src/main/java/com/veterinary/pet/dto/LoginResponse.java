package com.veterinary.pet.dto;

public record LoginResponse(
        String token,
        String tokenType,
        String rol,
        String correo
) {
}