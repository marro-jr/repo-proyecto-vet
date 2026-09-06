package com.veterinary.pet.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.veterinary.pet.entity.Usuario;
import com.veterinary.pet.repo.UsuarioRepository;


@Service
public class UsuarioService {

    private UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    public Usuario buscarUsuarioPorId(Long id) {
        return usuarioRepository.findById(id).orElse(null);
    }

  
    public Usuario registrarUsuario(Usuario usuario) {

        if (usuario.getCorreo() == null || usuario.getCorreo().trim().isEmpty()) {
            return null;
        }
        if (usuario.getPassword() == null || usuario.getPassword().trim().isEmpty()) {
            return null;
        }
        if (usuario.getRol() == null) {
            return null;
        }

        if (usuarioRepository.existsByCorreo(usuario.getCorreo())) {
            return null;
        }

        
        return usuarioRepository.save(usuario);
    }

    public  Usuario actualizarUsuario(Usuario usuario) {
        
        if(usuario.getIdUsuario() == null || !usuarioRepository.existsById(usuario.getIdUsuario())) {
            return null;
        }

        return usuarioRepository.save(usuario);
    }

    public boolean validarCredenciales(String correo, String contrasena) {
        Usuario usuario = usuarioRepository.findByCorreo(correo);
        if (usuario != null && usuario.getPassword().equals(contrasena)) {
            return true;
        }
        return false;
    }

}