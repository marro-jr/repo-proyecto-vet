package com.veterinary.pet.service;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.veterinary.pet.entity.EstadoUsuario;
import com.veterinary.pet.entity.Rol;
import com.veterinary.pet.entity.Usuario;
import com.veterinary.pet.repository.RolRepository;
import com.veterinary.pet.repository.UsuarioRepository;

@ExtendWith(MockitoExtension.class)
public class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private RolRepository rolRepository;

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

    @Test
    void deberiaRegistrarUsuario() {
        Usuario nuevo = new Usuario(
            "Ana",
            "Gomez",
            "ana@vet.com",
            "clave456",
            null,
            null,
            rolAdmin
        );

        when(usuarioRepository.existsByCorreo("ana@vet.com")).thenReturn(false);
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(inv -> inv.getArgument(0));

        Usuario resultado = usuarioService.registrarUsuario(nuevo);

        assertNotNull(resultado);
        assertEquals("Ana", resultado.getNombre());
        assertEquals("Gomez", resultado.getApellido());
        assertEquals("ana@vet.com", resultado.getCorreo());
        assertEquals(EstadoUsuario.ACTIVO, resultado.getEstado());
        assertNotNull(resultado.getFechaCreacion());
    }

    @Test
    void noDeberiaRegistrarCorreoDuplicado() {
        Usuario duplicado = new Usuario(
            "Carlos",
            "Mendoza",
            "carlos@vet.com",
            "pass123",
            null,
            null,
            rolAdmin
        );

        when(usuarioRepository.existsByCorreo("carlos@vet.com")).thenReturn(true);

        Usuario resultado = usuarioService.registrarUsuario(duplicado);

        assertNull(resultado);
    }

    @Test
    void deberiaBuscarUsuarioPorId() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuarioPrueba));

        Usuario resultado = usuarioService.buscarUsuarioPorId(1L);

        assertNotNull(resultado);
        assertEquals(1L, resultado.getIdUsuario());
        assertEquals("Carlos", resultado.getNombre());
    }

    @Test
    void deberiaDesactivarUsuario() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuarioPrueba));

        boolean desactivado = usuarioService.desactivarUsuario(1L);

        assertTrue(desactivado);
        assertEquals(EstadoUsuario.INACTIVO, usuarioPrueba.getEstado());
        verify(usuarioRepository).save(usuarioPrueba);
    }

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
}
