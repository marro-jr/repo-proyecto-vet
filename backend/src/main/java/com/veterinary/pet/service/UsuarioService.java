package com.veterinary.pet.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.veterinary.pet.dto.RolResponseDTO;
import com.veterinary.pet.dto.UsuarioRequestDTO;
import com.veterinary.pet.dto.UsuarioResponseDTO;
import com.veterinary.pet.entity.EstadoUsuario;
import com.veterinary.pet.entity.Rol;
import com.veterinary.pet.entity.Usuario;
import com.veterinary.pet.repository.RolRepository;
import com.veterinary.pet.repository.UsuarioRepository;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository,
                          RolRepository rolRepository,
                          PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UsuarioResponseDTO> listarUsuarios() {
        return usuarioRepository.listarConRol().stream()
                .map(this::mapearADTO)
                .toList();
    }

    public UsuarioResponseDTO obtenerPorId(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con ID: " + id));
        return mapearADTO(usuario);
    }

    public UsuarioResponseDTO registrarUsuario(UsuarioRequestDTO request) {
        validarCamposObligatorios(request, true);

        String correoLimpio = request.getCorreo().trim();
        if (usuarioRepository.findByCorreo(correoLimpio).isPresent()) {
            throw new IllegalArgumentException("El correo ya se encuentra registrado");
        }

        Rol rol = rolRepository.findById(request.getIdRol())
                .orElseThrow(() -> new IllegalArgumentException("El rol seleccionado no existe"));

        EstadoUsuario estado = request.getEstado() != null ? request.getEstado() : EstadoUsuario.ACTIVO;

        String passwordEncriptada = passwordEncoder.encode(request.getPassword().trim());

        Usuario nuevoUsuario = new Usuario(
                request.getNombre().trim(),
                request.getApellido().trim(),
                correoLimpio,
                passwordEncriptada,
                estado,
                LocalDate.now(),
                rol
        );

        Usuario usuarioGuardado = usuarioRepository.save(nuevoUsuario);
        return mapearADTO(usuarioGuardado);
    }

    public UsuarioResponseDTO actualizarUsuario(Long id, UsuarioRequestDTO request) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con ID: " + id));

        validarCamposObligatorios(request, false);

        String nuevoCorreo = request.getCorreo().trim();
        if (!usuario.getCorreo().equalsIgnoreCase(nuevoCorreo)) {
            Optional<Usuario> existente = usuarioRepository.findByCorreo(nuevoCorreo);
            if (existente.isPresent() && !existente.get().getIdUsuario().equals(id)) {
                throw new IllegalArgumentException("El correo ya está en uso por otro usuario");
            }
        }

        usuario.setNombre(request.getNombre().trim());
        usuario.setApellido(request.getApellido().trim());
        usuario.setCorreo(nuevoCorreo);

        if (request.getIdRol() != null) {
            Rol rol = rolRepository.findById(request.getIdRol())
                    .orElseThrow(() -> new IllegalArgumentException("El rol seleccionado no existe"));
            usuario.setRol(rol);
        }

        if (request.getEstado() != null) {
            usuario.setEstado(request.getEstado());
        }

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            usuario.setPassword(passwordEncoder.encode(request.getPassword().trim()));
        }

        Usuario usuarioActualizado = usuarioRepository.save(usuario);
        return mapearADTO(usuarioActualizado);
    }

    public void eliminarUsuario(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con ID: " + id));

        usuarioRepository.delete(usuario);
    }

    public List<RolResponseDTO> listarRoles() {
        return rolRepository.findAll().stream()
                .map(r -> new RolResponseDTO(r.getIdRol(), r.getNombre(), r.getDescripcion()))
                .toList();
    }

    private void validarCamposObligatorios(UsuarioRequestDTO request, boolean validarPassword) {
        if (request.getNombre() == null || request.getNombre().isBlank()) {
            throw new IllegalArgumentException("El nombre es obligatorio");
        }
        if (request.getApellido() == null || request.getApellido().isBlank()) {
            throw new IllegalArgumentException("El apellido es obligatorio");
        }
        if (request.getCorreo() == null || request.getCorreo().isBlank()) {
            throw new IllegalArgumentException("El correo es obligatorio");
        }
        if (request.getIdRol() == null) {
            throw new IllegalArgumentException("El rol es obligatorio");
        }
        if (validarPassword && (request.getPassword() == null || request.getPassword().isBlank())) {
            throw new IllegalArgumentException("La contraseña es obligatoria");
        }
    }

    private UsuarioResponseDTO mapearADTO(Usuario u) {
        return new UsuarioResponseDTO(
                u.getIdUsuario(),
                u.getNombre(),
                u.getApellido(),
                u.getCorreo(),
                u.getEstado(),
                u.getFechaCreacion(),
                u.getRol() != null ? u.getRol().getIdRol() : null,
                u.getRol() != null ? u.getRol().getNombre() : null,
                u.getRol() != null ? u.getRol().getDescripcion() : null
        );
    }
}
