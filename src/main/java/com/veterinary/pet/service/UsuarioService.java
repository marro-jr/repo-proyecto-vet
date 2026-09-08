package com.veterinary.pet.service;

import org.springframework.stereotype.Service;

import com.veterinary.pet.dto.UsuarioDto;
import com.veterinary.pet.entity.EstadoUsuario;
import com.veterinary.pet.entity.Usuario;
import com.veterinary.pet.repository.UsuarioRepository;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
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

    public UsuarioDto buscarUsuarioPorCorreo(String correo) {
        if (correo == null || correo.trim().isEmpty()) {
            return null;
        }

        Usuario usuario = this.usuarioRepository.findByCorreo(correo);

        if (usuario == null) {
            return null;
        }

        return convertirADto(usuario);
    }

    public boolean tieneRol(String correo, String rolSolicitado) {
        Usuario usuario = this.usuarioRepository.findByCorreo(correo);

        if (usuario == null) {
            return false;
        }

        if (usuario.getEstado() != EstadoUsuario.ACTIVO) {
            return false;
        }

        String rolDelUsuario = usuario.getRol().getNombre();

        return rolDelUsuario.equalsIgnoreCase(rolSolicitado);
    }

    private UsuarioDto convertirADto(Usuario usuario) {
        UsuarioDto dto = new UsuarioDto();
        dto.setNombre(usuario.getNombre());
        dto.setCorreo(usuario.getCorreo());
        dto.setEstado(usuario.getEstado());
        dto.setNombreRol(usuario.getRol().getNombre());
        return dto;
    }
}