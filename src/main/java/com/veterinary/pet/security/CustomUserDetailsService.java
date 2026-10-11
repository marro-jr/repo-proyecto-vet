package com.veterinary.pet.security;



import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;

import com.veterinary.pet.entity.EstadoUsuario;
import com.veterinary.pet.entity.Usuario;
import com.veterinary.pet.repository.UsuarioRepository;

@Service 
public class CustomUserDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    public CustomUserDetailsService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String correo) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByCorreo(correo)
        .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        UserDetails cuenta = User
        .withUsername(usuario.getCorreo())
        .password(usuario.getPassword())
        .roles(usuario.getRol().getNombre())
        .disabled(EstadoUsuario.ACTIVO != usuario.getEstado())
        .build();

        return cuenta;
    }
    
}
