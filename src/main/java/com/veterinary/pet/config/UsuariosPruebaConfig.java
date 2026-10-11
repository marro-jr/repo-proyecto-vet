package com.veterinary.pet.config;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import org.springframework.security.crypto.password.PasswordEncoder;

import com.veterinary.pet.entity.EstadoUsuario;
import com.veterinary.pet.entity.Rol;
import com.veterinary.pet.entity.Usuario;
import com.veterinary.pet.repository.RolRepository;
import com.veterinary.pet.repository.UsuarioRepository;

@Configuration
@Profile("dev")
public class UsuariosPruebaConfig {

    @Bean
    public CommandLineRunner cargarUsuarios(
            UsuarioRepository usuarios,
            RolRepository roles,
            PasswordEncoder encoder,
            @Value("${VET_ADMIN_PASSWORD:contrasenadmin1}") String claveAdmin,
            @Value("${VET_USER_PASSWORD:contrasenauser2}") String claveEmpleado) {

        return args -> {

            Rol admin = roles.findByNombre("ADMIN")
                    .orElseGet(() -> roles.save(
                            new Rol("ADMIN", "Administrador veterinario")));

            Rol empleado = roles.findByNombre("USER")
                    .orElseGet(() -> roles.save(
                            new Rol("USER", "Recepcionista")));

            crearSiNoExiste(
                    usuarios, encoder, admin,
                    "admin@vet.test", "Admin", "Veterinaria",
                    claveAdmin);

            crearSiNoExiste(
                    usuarios, encoder, empleado,
                    "empleado@vet.test", "Empleado", "Recepcion",
                    claveEmpleado);
        };
    }

    private void crearSiNoExiste(
            UsuarioRepository usuarios,
            PasswordEncoder encoder,
            Rol rol,
            String correo,
            String nombre,
            String apellido,
            String password) {

        if (usuarios.findByCorreo(correo).isPresent()) {
            return;
        }

        Usuario usuario = new Usuario(
                nombre,
                apellido,
                correo,
                encoder.encode(password),
                EstadoUsuario.ACTIVO,
                LocalDate.now(),
                rol);

        usuarios.save(usuario);
    }
}
