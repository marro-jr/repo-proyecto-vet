package com.veterinary.pet.service;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.veterinary.pet.dto.UsuarioDto;
import com.veterinary.pet.entity.EstadoUsuario;
import com.veterinary.pet.entity.Rol;
import com.veterinary.pet.entity.Usuario;
import com.veterinary.pet.repository.UsuarioRepository;

@ExtendWith(MockitoExtension.class)
public class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private UsuarioService usuarioService;

    private Rol rolAdmin;
    private Usuario usuarioPrueba;

    @BeforeEach
    void setUp() {
        rolAdmin = new Rol(1L, "ADMIN", "Administrador del sistema");
        usuarioPrueba = new Usuario(
            1L,
            "Carlos",
            "Mendoza",
            "carlos@vet.com",
            "password123",
            EstadoUsuario.ACTIVO,
            LocalDate.now(),
            rolAdmin
        );
    }

   
    // Test para la autenticacion

    @Test
    void deberiaValidarCredencialesCorrectas() {
        when(usuarioRepository.findByCorreo("carlos@vet.com")).thenReturn(usuarioPrueba);

        boolean esValido = usuarioService.validarCredenciales("carlos@vet.com", "password123");

        assertTrue(esValido);
    }

    @Test
    void deberiaRechazarCredencialesIncorrectas() {
        when(usuarioRepository.findByCorreo("carlos@vet.com")).thenReturn(usuarioPrueba);

        boolean esValido = usuarioService.validarCredenciales("carlos@vet.com", "password_incorrecto");

        assertFalse(esValido);
    }

    @Test
    void deberiaAutenticarYDevolverRolCorrecto() {
        when(usuarioRepository.findByCorreo("carlos@vet.com")).thenReturn(usuarioPrueba);

        boolean esValido = usuarioService.validarCredenciales("carlos@vet.com", "password123");
        UsuarioDto dto = usuarioService.buscarUsuarioPorCorreo("carlos@vet.com");

        assertTrue(esValido);
        assertNotNull(dto);
        assertEquals("ADMIN", dto.getNombreRol());
    }

    @Test
    void deberiaRechazarAutenticacionConPasswordIncorrecto() {
        when(usuarioRepository.findByCorreo("carlos@vet.com")).thenReturn(usuarioPrueba);

        boolean esValido = usuarioService.validarCredenciales("carlos@vet.com", "claveErronea");

        assertFalse(esValido);
    }

    // test para la autorizacion

    @Test
    void deberiaTenerRolCorrecto() {
        when(usuarioRepository.findByCorreo("carlos@vet.com")).thenReturn(usuarioPrueba);

        boolean tieneRol = usuarioService.tieneRol("carlos@vet.com", "ADMIN");

        assertTrue(tieneRol);
    }

    @Test
    void noDeberiaTenerRolDiferente() {
        when(usuarioRepository.findByCorreo("carlos@vet.com")).thenReturn(usuarioPrueba);

        boolean tieneRol = usuarioService.tieneRol("carlos@vet.com", "VETERINARIO");

        assertFalse(tieneRol);
    }
}
