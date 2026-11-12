package com.veterinary.pet.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.veterinary.pet.dto.CatalogoDTO;
import com.veterinary.pet.dto.CitaCatalogosDTO;
import com.veterinary.pet.dto.CitaRequestDTO;
import com.veterinary.pet.dto.CitaResponseDTO;
import com.veterinary.pet.entity.Cita;
import com.veterinary.pet.entity.EstadoCita;
import com.veterinary.pet.entity.Mascota;
import com.veterinary.pet.entity.Servicio;
import com.veterinary.pet.entity.Usuario;
import com.veterinary.pet.repository.CitaRepository;
import com.veterinary.pet.repository.MascotaRepository;
import com.veterinary.pet.repository.ServicioRepository;
import com.veterinary.pet.repository.UsuarioRepository;

@Service
public class CitaService {

    private final CitaRepository citaRepository;
    private final MascotaRepository mascotaRepository;
    private final ServicioRepository servicioRepository;
    private final UsuarioRepository usuarioRepository;

    public CitaService(CitaRepository citaRepository, MascotaRepository mascotaRepository,
            ServicioRepository servicioRepository, UsuarioRepository usuarioRepository) {
        this.citaRepository = citaRepository;
        this.mascotaRepository = mascotaRepository;
        this.servicioRepository = servicioRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public List<CitaResponseDTO> listarCitas() {
        return citaRepository.findAllByOrderByFechaHoraAsc().stream()
                .map(this::convertirARespuesta)
                .toList();
    }

    public CitaResponseDTO registrarCita(CitaRequestDTO request, String correoUsuario) {
        validarRequest(request);

        Cita cita = new Cita();
        asignarDatos(cita, request);
        cita.setUsuarioRegistro(buscarUsuarioPorCorreo(correoUsuario));

        return convertirARespuesta(citaRepository.save(cita));
    }

    public CitaResponseDTO actualizarCita(Long id, CitaRequestDTO request) {
        validarRequest(request);

        Cita cita = citaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cita no encontrada"));

        asignarDatos(cita, request);
        return convertirARespuesta(citaRepository.save(cita));
    }

    public void eliminarCita(Long id) {
        Cita cita = citaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cita no encontrada"));
        citaRepository.delete(cita);
    }

    public CitaCatalogosDTO obtenerCatalogos() {
        List<CatalogoDTO> mascotas = mascotaRepository.findAll().stream()
                .map(m -> new CatalogoDTO(
                        m.getIdMascota(),
                        m.getNombre() + " - " + m.getPropietario().getNombre()
                                + " " + m.getPropietario().getApellido()))
                .toList();

        List<CatalogoDTO> servicios = servicioRepository.findAll().stream()
                .map(s -> new CatalogoDTO(s.getIdServicio(), s.getNombre()))
                .toList();

        List<CatalogoDTO> veterinarios = usuarioRepository.findAll().stream()
                .filter(u -> u.getRol() != null && "ADMIN".equals(u.getRol().getNombre()))
                .map(u -> new CatalogoDTO(
                        u.getIdUsuario(),
                        u.getNombre() + " " + u.getApellido()))
                .toList();

        return new CitaCatalogosDTO(mascotas, servicios, veterinarios);
    }

    private void asignarDatos(Cita cita, CitaRequestDTO request) {
        Mascota mascota = mascotaRepository.findById(request.getIdMascota())
                .orElseThrow(() -> new IllegalArgumentException("La mascota no existe"));

        Servicio servicio = servicioRepository.findById(request.getIdServicio())
                .orElseThrow(() -> new IllegalArgumentException("El servicio no existe"));

        Usuario veterinario = usuarioRepository.findById(request.getIdVeterinario())
                .orElseThrow(() -> new IllegalArgumentException("El veterinario no existe"));

        if (veterinario.getRol() == null || !"ADMIN".equals(veterinario.getRol().getNombre())) {
            throw new IllegalArgumentException("El usuario seleccionado no es veterinario");
        }

        cita.setMascota(mascota);
        cita.setServicio(servicio);
        cita.setVeterinario(veterinario);
        cita.setFechaHora(request.getFechaHora());
        cita.setMotivo(request.getMotivo().trim());
        cita.setEstado(request.getEstado() != null ? request.getEstado() : EstadoCita.PENDIENTE);
        cita.setObservaciones(request.getObservaciones());
    }

    private void validarRequest(CitaRequestDTO request) {
        if (request.getIdMascota() == null || request.getIdServicio() == null
                || request.getIdVeterinario() == null || request.getFechaHora() == null) {
            throw new IllegalArgumentException("Mascota, servicio, veterinario y fecha son obligatorios");
        }
        if (request.getMotivo() == null || request.getMotivo().isBlank()) {
            throw new IllegalArgumentException("El motivo es obligatorio");
        }
    }

    private Usuario buscarUsuarioPorCorreo(String correo) {
        return usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new IllegalArgumentException("Usuario autenticado no encontrado"));
    }

    private CitaResponseDTO convertirARespuesta(Cita cita) {
        String mascota = cita.getMascota().getNombre() + " - "
                + cita.getMascota().getPropietario().getNombre() + " "
                + cita.getMascota().getPropietario().getApellido();

        String veterinario = cita.getVeterinario().getNombre() + " "
                + cita.getVeterinario().getApellido();

        return new CitaResponseDTO(
                cita.getIdCita(),
                cita.getMascota().getIdMascota(),
                mascota,
                cita.getServicio().getIdServicio(),
                cita.getServicio().getNombre(),
                cita.getVeterinario().getIdUsuario(),
                veterinario,
                cita.getUsuarioRegistro().getCorreo(),
                cita.getFechaHora(),
                cita.getMotivo(),
                cita.getEstado(),
                cita.getObservaciones());
    }
}
