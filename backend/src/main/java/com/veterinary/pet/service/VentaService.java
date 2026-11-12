package com.veterinary.pet.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.veterinary.pet.dto.CatalogoDTO;
import com.veterinary.pet.dto.VentaCatalogosDTO;
import com.veterinary.pet.dto.VentaRequestDTO;
import com.veterinary.pet.dto.VentaResponseDTO;
import com.veterinary.pet.entity.EstadoVenta;
import com.veterinary.pet.entity.Propietario;
import com.veterinary.pet.entity.Usuario;
import com.veterinary.pet.entity.Venta;
import com.veterinary.pet.repository.PropietarioRepository;
import com.veterinary.pet.repository.UsuarioRepository;
import com.veterinary.pet.repository.VentaRepository;

@Service
public class VentaService {

    private final VentaRepository ventaRepository;
    private final UsuarioRepository usuarioRepository;
    private final PropietarioRepository propietarioRepository;

    public VentaService(VentaRepository ventaRepository, UsuarioRepository usuarioRepository,
            PropietarioRepository propietarioRepository) {
        this.ventaRepository = ventaRepository;
        this.usuarioRepository = usuarioRepository;
        this.propietarioRepository = propietarioRepository;
    }

    public List<VentaResponseDTO> listarVentas() {
        return ventaRepository.findAllByOrderByFechaVentaDesc().stream()
                .map(this::convertirARespuesta)
                .toList();
    }

    public VentaResponseDTO registrarVenta(VentaRequestDTO request, String correoUsuario) {
        validarRequest(request);

        Venta venta = new Venta();
        venta.setUsuario(buscarUsuarioPorCorreo(correoUsuario));
        venta.setFechaVenta(LocalDateTime.now());
        asignarDatos(venta, request);

        return convertirARespuesta(ventaRepository.save(venta));
    }

    public VentaResponseDTO actualizarVenta(Long id, VentaRequestDTO request) {
        validarRequest(request);

        Venta venta = ventaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Venta no encontrada"));

        asignarDatos(venta, request);
        return convertirARespuesta(ventaRepository.save(venta));
    }

    public void eliminarVenta(Long id) {
        Venta venta = ventaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Venta no encontrada"));
        ventaRepository.delete(venta);
    }

    public VentaCatalogosDTO obtenerCatalogos() {
        List<CatalogoDTO> propietarios = propietarioRepository.findAll().stream()
                .map(p -> new CatalogoDTO(
                        p.getIdPropietario(),
                        p.getNombre() + " " + p.getApellido()))
                .toList();

        return new VentaCatalogosDTO(propietarios);
    }

    private void asignarDatos(Venta venta, VentaRequestDTO request) {
        Propietario propietario = null;
        if (request.getIdPropietario() != null) {
            propietario = propietarioRepository.findById(request.getIdPropietario())
                    .orElseThrow(() -> new IllegalArgumentException("El propietario no existe"));
        }

        venta.setPropietario(propietario);
        venta.setTotal(request.getTotal());
        venta.setEstado(request.getEstado() != null ? request.getEstado() : EstadoVenta.REGISTRADA);
    }

    private void validarRequest(VentaRequestDTO request) {
        if (request.getTotal() == null) {
            throw new IllegalArgumentException("El total es obligatorio");
        }
        if (request.getTotal().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("El total no puede ser negativo");
        }
    }

    private Usuario buscarUsuarioPorCorreo(String correo) {
        return usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new IllegalArgumentException("Usuario autenticado no encontrado"));
    }

    private VentaResponseDTO convertirARespuesta(Venta venta) {
        Long idPropietario = venta.getPropietario() != null
                ? venta.getPropietario().getIdPropietario()
                : null;

        String propietario = venta.getPropietario() != null
                ? venta.getPropietario().getNombre() + " " + venta.getPropietario().getApellido()
                : "Público general";

        return new VentaResponseDTO(
                venta.getIdVenta(),
                venta.getUsuario().getCorreo(),
                idPropietario,
                propietario,
                venta.getFechaVenta(),
                venta.getTotal(),
                venta.getEstado());
    }
}
