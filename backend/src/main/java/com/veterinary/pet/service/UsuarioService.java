package com.veterinary.pet.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.veterinary.pet.dto.RolResponse;
import com.veterinary.pet.dto.UsuarioRequest;
import com.veterinary.pet.dto.UsuarioResponse;
import com.veterinary.pet.entity.EstadoUsuario;
import com.veterinary.pet.entity.Rol;
import com.veterinary.pet.entity.Usuario;
import com.veterinary.pet.repository.RolRepository;
import com.veterinary.pet.repository.UsuarioRepository;

@Service
@Transactional(readOnly = true)
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(
            UsuarioRepository usuarioRepository,
            RolRepository rolRepository,
            PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UsuarioResponse> listar() {
        return usuarioRepository.listarConRol().stream()
                .map(this::aRespuesta)
                .toList();
    }

    public List<RolResponse> listarRoles() {
        return rolRepository.findAll().stream()
                .map(rol -> new RolResponse(rol.getIdRol(), rol.getNombre()))
                .toList();
    }

    @Transactional
    public UsuarioResponse registrar(UsuarioRequest request) {
        validarDatos(request, true);

        if (usuarioRepository.findByCorreo(request.correo().trim()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un usuario con ese correo");
        }

        Rol rol = obtenerRol(request.idRol());
        Usuario usuario = new Usuario(
                request.nombre().trim(),
                request.apellido().trim(),
                request.correo().trim(),
                passwordEncoder.encode(request.password()),
                request.estado() == null ? EstadoUsuario.ACTIVO : request.estado(),
                LocalDate.now(),
                rol);

        return aRespuesta(usuarioRepository.save(usuario));
    }

    @Transactional
    public UsuarioResponse actualizar(Long id, UsuarioRequest request) {
        validarDatos(request, false);
        if (request.idRol() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El idRol es obligatorio");
        }

        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        usuarioRepository.findByCorreo(request.correo().trim()).ifPresent(existente -> {
            if (!existente.getIdUsuario().equals(id)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un usuario con ese correo");
            }
        });

        usuario.setNombre(request.nombre().trim());
        usuario.setApellido(request.apellido().trim());
        usuario.setCorreo(request.correo().trim());
        usuario.setEstado(request.estado() == null ? usuario.getEstado() : request.estado());
        usuario.setRol(obtenerRol(request.idRol()));
        if (request.password() != null && !request.password().isBlank()) {
            usuario.setPassword(passwordEncoder.encode(request.password()));
        }

        return aRespuesta(usuarioRepository.save(usuario));
    }

    @Transactional
    public void eliminar(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado");
        }
        usuarioRepository.deleteById(id);
    }

    private void validarDatos(UsuarioRequest request, boolean requierePassword) {
        if (request == null
                || request.nombre() == null || request.nombre().isBlank()
                || request.apellido() == null || request.apellido().isBlank()
                || request.correo() == null || request.correo().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Nombre, apellido y correo son obligatorios");
        }
        if (requierePassword && (request.password() == null || request.password().isBlank())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La contraseña es obligatoria");
        }
        if (requierePassword && request.idRol() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El idRol es obligatorio");
        }
    }

    private Rol obtenerRol(Long idRol) {
        return rolRepository.findById(idRol)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "El rol indicado no existe"));
    }

    private UsuarioResponse aRespuesta(Usuario usuario) {
        return new UsuarioResponse(
                usuario.getIdUsuario(),
                usuario.getNombre(),
                usuario.getApellido(),
                usuario.getCorreo(),
                usuario.getEstado(),
                usuario.getFechaCreacion(),
                usuario.getRol().getIdRol(),
                usuario.getRol().getNombre());
    }
}
