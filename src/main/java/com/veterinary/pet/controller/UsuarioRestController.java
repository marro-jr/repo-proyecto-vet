package com.veterinary.pet.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.veterinary.pet.dto.UsuarioDto;
import com.veterinary.pet.service.UsuarioService;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioRestController {

    private final UsuarioService usuarioService;

    public UsuarioRestController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(
            @RequestParam String correo,
            @RequestParam String password) {

        boolean credencialesCorrectas = this.usuarioService.validarCredenciales(correo, password);

        if (!credencialesCorrectas) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Autenticación fallida. Correo o contraseña incorrectos, o usuario inactivo.");
        }

        UsuarioDto usuarioDto = this.usuarioService.buscarUsuarioPorCorreo(correo);

        return ResponseEntity
                .ok("Autenticación correcta. Bienvenido " + usuarioDto.getNombre() + ". Rol: " + usuarioDto.getNombreRol());
    }

    @GetMapping("/autorizacion")
    public ResponseEntity<String> verificarAutorizacion(
            @RequestParam String correo,
            @RequestParam String rol) {

        UsuarioDto usuarioDto = this.usuarioService.buscarUsuarioPorCorreo(correo);

        if (usuarioDto == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Usuario no encontrado con el correo: " + correo);
        }

        boolean autorizado = this.usuarioService.tieneRol(correo, rol);

        if (!autorizado) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body("Usuario no autorizado para el rol " + rol);
        }

        return ResponseEntity
                .ok("Usuario autorizado. Nombre: " + usuarioDto.getNombre() + ". Rol: " + usuarioDto.getNombreRol());
    }
}