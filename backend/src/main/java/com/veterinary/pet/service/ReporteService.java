package com.veterinary.pet.service;

import org.springframework.stereotype.Service;

import com.veterinary.pet.dto.ReporteResumenDTO;
import com.veterinary.pet.entity.EstadoVenta;
import com.veterinary.pet.repository.CitaRepository;
import com.veterinary.pet.repository.MascotaRepository;
import com.veterinary.pet.repository.PropietarioRepository;
import com.veterinary.pet.repository.ServicioRepository;
import com.veterinary.pet.repository.UsuarioRepository;
import com.veterinary.pet.repository.VentaRepository;

@Service
public class ReporteService {

    private final UsuarioRepository usuarioRepository;
    private final ServicioRepository servicioRepository;
    private final PropietarioRepository propietarioRepository;
    private final MascotaRepository mascotaRepository;
    private final CitaRepository citaRepository;
    private final VentaRepository ventaRepository;

    public ReporteService(UsuarioRepository usuarioRepository, ServicioRepository servicioRepository,
            PropietarioRepository propietarioRepository, MascotaRepository mascotaRepository,
            CitaRepository citaRepository, VentaRepository ventaRepository) {
        this.usuarioRepository = usuarioRepository;
        this.servicioRepository = servicioRepository;
        this.propietarioRepository = propietarioRepository;
        this.mascotaRepository = mascotaRepository;
        this.citaRepository = citaRepository;
        this.ventaRepository = ventaRepository;
    }

    public ReporteResumenDTO obtenerResumen() {
        return new ReporteResumenDTO(
                usuarioRepository.count(),
                servicioRepository.count(),
                propietarioRepository.count(),
                mascotaRepository.count(),
                citaRepository.count(),
                ventaRepository.count(),
                ventaRepository.sumarPorEstado(EstadoVenta.REGISTRADA));
    }
}
