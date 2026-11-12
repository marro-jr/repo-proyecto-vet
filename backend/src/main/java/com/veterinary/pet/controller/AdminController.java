package com.veterinary.pet.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.veterinary.pet.dto.ReporteResumenDTO;
import com.veterinary.pet.service.ReporteService;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final ReporteService reporteService;

    public AdminController(ReporteService reporteService) {
        this.reporteService = reporteService;
    }

    @GetMapping("/resumen")
    public ResponseEntity<ReporteResumenDTO> resumen() {
        return ResponseEntity.ok(reporteService.obtenerResumen());
    }
}
