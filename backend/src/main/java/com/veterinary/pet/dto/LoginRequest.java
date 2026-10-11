package com.veterinary.pet.dto;

public record LoginRequest(
        String correo,
        String password
) {
}