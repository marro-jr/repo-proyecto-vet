package com.veterinary.pet.controller;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.veterinary.pet.entity.Rol;
import com.veterinary.pet.entity.Usuario;
import com.veterinary.pet.repository.RolRepository;
import com.veterinary.pet.service.UsuarioService;

import jakarta.servlet.http.HttpSession;

@Controller
public class UsuarioViewController {

    private final UsuarioService usuarioService;
    private final RolRepository rolRepository;

    public UsuarioViewController(UsuarioService usuarioService, RolRepository rolRepository) {
        this.usuarioService = usuarioService;
        this.rolRepository = rolRepository;
    }

    @GetMapping({"/", "/login"})
    public String mostrarLogin(Model model) {
        return "login";
    }

    @PostMapping("/login")
    public String procesarLogin(@RequestParam String correo,
                                @RequestParam String password,
                                HttpSession session,
                                Model model) {
        boolean esValido = this.usuarioService.validarCredenciales(correo, password);

        if (esValido) {
            session.setAttribute("usuarioLogueado", correo);
            return "redirect:/usuarios";
        } else {
            model.addAttribute("error", "Correo o contraseña incorrectos, o usuario inactivo.");
            return "login";
        }
    }

    @GetMapping("/logout")
    public String cerrarSesion(HttpSession session) {
        session.invalidate();
        return "redirect:/login";
    }

    @GetMapping("/usuarios")
    public String listarUsuarios(Model model) {
        List<Usuario> usuarios = this.usuarioService.listarUsuarios();
        model.addAttribute("usuarios", usuarios);
        return "usuarios/lista";
    }

    @GetMapping("/usuarios/nuevo")
    public String mostrarFormularioRegistro(Model model) {
        model.addAttribute("usuario", new Usuario());
        model.addAttribute("roles", this.rolRepository.findAll());
        return "usuarios/formulario";
    }

    @PostMapping("/usuarios/guardar")
    public String guardarUsuario(@ModelAttribute("usuario") Usuario usuario, Model model) {
        if (usuario.getIdUsuario() == null) {
            Usuario guardado = this.usuarioService.registrarUsuario(usuario);
            if (guardado == null) {
                model.addAttribute("error", "No se pudo registrar el usuario. Verifique los campos o si el correo ya existe.");
                model.addAttribute("roles", this.rolRepository.findAll());
                return "usuarios/formulario";
            }
        } else {
            Usuario actualizado = this.usuarioService.actualizarUsuario(usuario.getIdUsuario(), usuario);
            if (actualizado == null) {
                model.addAttribute("error", "No se pudo actualizar el usuario. Verifique los datos ingresados.");
                model.addAttribute("roles", this.rolRepository.findAll());
                return "usuarios/formulario";
            }
        }
        return "redirect:/usuarios";
    }

    @GetMapping("/usuarios/editar/{id}")
    public String mostrarFormularioEdicion(@PathVariable Long id, Model model) {
        Usuario usuario = this.usuarioService.buscarUsuarioPorId(id);
        if (usuario == null) {
            return "redirect:/usuarios";
        }
        model.addAttribute("usuario", usuario);
        model.addAttribute("roles", this.rolRepository.findAll());
        return "usuarios/formulario";
    }

    @GetMapping("/usuarios/desactivar/{id}")
    public String desactivarUsuario(@PathVariable Long id) {
        this.usuarioService.desactivarUsuario(id);
        return "redirect:/usuarios";
    }
}
