package com.veterinary.pet.controller;

import java.util.List;
import java.util.Map;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.veterinary.pet.dto.VentaCatalogosDTO;
import com.veterinary.pet.dto.VentaRequestDTO;
import com.veterinary.pet.dto.VentaResponseDTO;
import com.veterinary.pet.service.VentaService;

@RestController
@RequestMapping("/ventas")
public class VentaController {

    private final VentaService ventaService;

    public VentaController(VentaService ventaService) {
        this.ventaService = ventaService;
    }

    @GetMapping
    public ResponseEntity<List<VentaResponseDTO>> listar() {
        return ResponseEntity.ok(ventaService.listarVentas());
    }

    @GetMapping("/catalogos")
    public ResponseEntity<VentaCatalogosDTO> catalogos() {
        return ResponseEntity.ok(ventaService.obtenerCatalogos());
    }

    @PostMapping
    public ResponseEntity<?> registrar(@RequestBody VentaRequestDTO request,
            Authentication authentication) {
        try {
            VentaResponseDTO venta = ventaService.registrarVenta(request, authentication.getName());
            return ResponseEntity.status(HttpStatus.CREATED).body(venta);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id,
            @RequestBody VentaRequestDTO request) {
        try {
            return ResponseEntity.ok(ventaService.actualizarVenta(id, request));
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
            ventaService.eliminarVenta(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", ex.getMessage()));
        } catch (DataIntegrityViolationException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "No se puede eliminar la venta porque tiene detalles asociados"));
        }
    }
}
