package com.veterinary.pet.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/citas")
public class CitaRestController {

    @GetMapping
    public ResponseEntity<?> listarParaPrueba() {
        return ResponseEntity.ok(Map.of(
            "mensaje", "Acceso concedido a /citas (Permitido para ADMIN y USER)",
            "citas", List.of(
                Map.of("id", 101, "mascota", "Firulais (Perro)", "propietario", "Juan Pérez", "motivo", "Vacunación antirrábica", "fecha", "2026-10-15", "estado", "CONFIRMADA"),
                Map.of("id", 102, "mascota", "Michi (Gato)", "propietario", "María Gómez", "motivo", "Chequeo preventivo", "fecha", "2026-10-16", "estado", "PENDIENTE")
            )
        ));
    }

}
