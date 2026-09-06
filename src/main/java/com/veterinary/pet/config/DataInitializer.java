package com.veterinary.pet.config;

import java.time.LocalDate;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.veterinary.pet.entity.EstadoUsuario;
import com.veterinary.pet.entity.Rol;
import com.veterinary.pet.entity.Usuario;
import com.veterinary.pet.repository.RolRepository;
import com.veterinary.pet.repository.UsuarioRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RolRepository rolRepository;
    private final UsuarioRepository usuarioRepository;

    public DataInitializer(RolRepository rolRepository, UsuarioRepository usuarioRepository) {
        this.rolRepository = rolRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (rolRepository.count() == 0) {
            Rol admin = rolRepository.save(new Rol("ADMIN", "Administrador del sistema"));
            rolRepository.save(new Rol("RECEPCIONISTA", "Gestión administrativa"));
            rolRepository.save(new Rol("VETERINARIO", "Gestión de atención veterinaria"));

            if (usuarioRepository.count() == 0) {
                Usuario usuarioAdmin = new Usuario(
                    "Admin",
                    "Sistema",
                    "admin@vet.com",
                    "admin123",
                    EstadoUsuario.ACTIVO,
                    LocalDate.now(),
                    admin
                );
                usuarioRepository.save(usuarioAdmin);
            }
        }
    }
}
