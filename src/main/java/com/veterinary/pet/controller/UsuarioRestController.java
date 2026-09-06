package com.veterinary.pet.controller;

import org.springframework.web.bind.annotation.RestController;

import com.veterinary.pet.entity.Usuario;
import com.veterinary.pet.service.UsuarioService;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;


@RestController 
@RequestMapping("/api")
public class UsuarioRestController {
    
    private final UsuarioService userService;

    public UsuarioRestController(UsuarioService userService) {
        this.userService = userService;
    }

    @GetMapping("/usuarios")
    public List<Usuario> listar() {
        return this.userService.listarUsuarios();
    }
    
    @GetMapping("/usuarios/{id}")
    public Usuario buscarPorId(Long id) {
        return this.userService.buscarUsuarioPorId(id);
    }


}
