package com.veterinary.pet.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.veterinary.pet.entity.EstadoUsuario;
import com.veterinary.pet.entity.Usuario;
import com.veterinary.pet.repository.RolRepository;
import com.veterinary.pet.repository.UsuarioRepository;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;

    public UsuarioService(UsuarioRepository usuarioRepository, RolRepository rolRepository) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
    }

    public List<Usuario> listarUsuarios() {
        return this.usuarioRepository.findAll();
    }

    public Usuario buscarUsuarioPorId(Long id) {
        return this.usuarioRepository.findById(id).orElse(null);
    }

    public Usuario registrarUsuario(Usuario usuario) {
        if (usuario.getNombre() == null || usuario.getNombre().trim().isEmpty()) {
            return null;
        }
        if (usuario.getApellido() == null || usuario.getApellido().trim().isEmpty()) {
            return null;
        }
        if (usuario.getCorreo() == null || usuario.getCorreo().trim().isEmpty()) {
            return null;
        }
        if (usuario.getPassword() == null || usuario.getPassword().trim().isEmpty()) {
            return null;
        }
        if (usuario.getRol() == null) {
            return null;
        }

        if (this.usuarioRepository.existsByCorreo(usuario.getCorreo())) {
            return null;
        }

        usuario.setEstado(EstadoUsuario.ACTIVO);
        if (usuario.getFechaCreacion() == null) {
            usuario.setFechaCreacion(LocalDate.now());
        }

        return this.usuarioRepository.save(usuario);
    }

    public Usuario actualizarUsuario(Long id, Usuario usuario) {
        Usuario usuarioExistente = buscarUsuarioPorId(id);

        if (usuarioExistente == null) {
            return null;
        }

        if (usuario.getNombre() == null || usuario.getNombre().trim().isEmpty() ||
            usuario.getApellido() == null || usuario.getApellido().trim().isEmpty() ||
            usuario.getCorreo() == null || usuario.getCorreo().trim().isEmpty()) {
            return null;
        }

        if (!usuarioExistente.getCorreo().equalsIgnoreCase(usuario.getCorreo()) &&
            this.usuarioRepository.existsByCorreo(usuario.getCorreo())) {
            return null;
        }

        usuarioExistente.setNombre(usuario.getNombre());
        usuarioExistente.setApellido(usuario.getApellido());
        usuarioExistente.setCorreo(usuario.getCorreo());

        if (usuario.getPassword() != null && !usuario.getPassword().trim().isEmpty()) {
            usuarioExistente.setPassword(usuario.getPassword());
        }

        if (usuario.getRol() != null) {
            usuarioExistente.setRol(usuario.getRol());
        }

        if (usuario.getEstado() != null) {
            usuarioExistente.setEstado(usuario.getEstado());
        }

        return this.usuarioRepository.save(usuarioExistente);
    }

    public boolean desactivarUsuario(Long id) {
        Usuario usuario = buscarUsuarioPorId(id);
        if (usuario == null) {
            return false;
        }

        usuario.setEstado(EstadoUsuario.INACTIVO);
        this.usuarioRepository.save(usuario);
        return true;
    }

    public boolean validarCredenciales(String correo, String password) {
        if (correo == null || password == null) {
            return false;
        }

        Usuario usuario = this.usuarioRepository.findByCorreo(correo);

        if (usuario == null) {
            return false;
        }

        if (usuario.getEstado() != EstadoUsuario.ACTIVO) {
            return false;
        }

        return usuario.getPassword().equals(password);
    }
}