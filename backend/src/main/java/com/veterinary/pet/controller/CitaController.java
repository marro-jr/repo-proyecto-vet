package com.veterinary.pet.controller;

import java.util.List;
import java.util.Map;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.veterinary.pet.dto.CitaCatalogosDTO;
import com.veterinary.pet.dto.CitaRequestDTO;
import com.veterinary.pet.dto.CitaResponseDTO;
import com.veterinary.pet.service.CitaService;

@RestController
@RequestMapping("/citas")
public class CitaController {

    private final CitaService citaService;

    public CitaController(CitaService citaService) {
        this.citaService = citaService;
    }

    @GetMapping
    public ResponseEntity<List<CitaResponseDTO>> listar() {
        return ResponseEntity.ok(citaService.listarCitas());
    }

    @GetMapping("/catalogos")
    public ResponseEntity<CitaCatalogosDTO> catalogos() {
        return ResponseEntity.ok(citaService.obtenerCatalogos());
    }

    @PostMapping
    public ResponseEntity<?> registrar(@RequestBody CitaRequestDTO request,
            Authentication authentication) {
        try {
            CitaResponseDTO cita = citaService.registrarCita(request, authentication.getName());
            return ResponseEntity.status(HttpStatus.CREATED).body(cita);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id,
            @RequestBody CitaRequestDTO request) {
        try {
            return ResponseEntity.ok(citaService.actualizarCita(id, request));
        } catch (IllegalArgumentException ex) {
            HttpStatus status = ex.getMessage().contains("no encontrada")
                    ? HttpStatus.NOT_FOUND
                    : HttpStatus.BAD_REQUEST;
            return ResponseEntity.status(status).body(Map.of("error", ex.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            citaService.eliminarCita(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", ex.getMessage()));
        } catch (DataIntegrityViolationException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "No se puede eliminar la cita porque tiene registros asociados"));
        }
    }
}
