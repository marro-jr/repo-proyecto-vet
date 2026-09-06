package com.veterinary.pet.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.veterinary.pet.entity.Usuario;
import com.veterinary.pet.service.UsuarioService;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioRestController {

    private final UsuarioService usuarioService;

    public UsuarioRestController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public ResponseEntity<List<Usuario>> listar() {
        List<Usuario> lista = this.usuarioService.listarUsuarios();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscarPorId(@PathVariable Long id) {
        Usuario usuario = this.usuarioService.buscarUsuarioPorId(id);
        if (usuario == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(usuario);
    }

    @PostMapping
    public ResponseEntity<Usuario> registrar(@RequestBody Usuario usuario) {
        Usuario nuevoUsuario = this.usuarioService.registrarUsuario(usuario);
        if (nuevoUsuario == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoUsuario);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> actualizar(@PathVariable Long id, @RequestBody Usuario usuario) {
        Usuario usuarioActualizado = this.usuarioService.actualizarUsuario(id, usuario);
        if (usuarioActualizado == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(usuarioActualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desactivar(@PathVariable Long id) {
        boolean desactivado = this.usuarioService.desactivarUsuario(id);
        if (!desactivado) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }
}
