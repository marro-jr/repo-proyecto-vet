package com.veterinary.pet.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.veterinary.pet.service.UsuarioService;

@RestController
@RequestMapping("/usuarios")
public class UsuarioRestController {

    private final UsuarioService usuarioService;

    public UsuarioRestController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public ResponseEntity<?> listarParaPrueba() {
        return ResponseEntity.ok(Map.of(
            "mensaje", "Acceso concedido a /usuarios (Rol ADMIN verificado)",
            "usuarios", List.of(
                Map.of("id", 1, "nombre", "Administrador Principal", "correo", "admin@vet.test", "rol", "ADMIN", "estado", "ACTIVO"),
                Map.of("id", 2, "nombre", "Empleado Veterinario", "correo", "empleado@vet.test", "rol", "USER", "estado", "ACTIVO")
            )
        ));
    }

}