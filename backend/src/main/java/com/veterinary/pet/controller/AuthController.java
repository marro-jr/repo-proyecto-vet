package com.veterinary.pet.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.veterinary.pet.dto.LoginRequest;
import com.veterinary.pet.dto.LoginResponse;
import com.veterinary.pet.security.JwtService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthController(
            AuthenticationManager authenticationManager,
            JwtService jwtService) {

        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
 
        if (request.correo() == null || request.correo().isBlank()
                || request.password() == null || request.password().isBlank()) {

            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Correo y contraseña obligatorios"));
        }

        try {

            
            Authentication credenciales =
                    UsernamePasswordAuthenticationToken.unauthenticated(
                            request.correo(),
                            request.password()
                    );

           
            Authentication autenticacion =
                    authenticationManager.authenticate(credenciales);

            
            String token = jwtService.generarToken(
                    autenticacion.getName()
            );

            
            String rol = autenticacion.getAuthorities().stream()
                    .map(a -> a.getAuthority())
                    .findFirst()
                    .orElse("ROLE_USER")
                    .replace("ROLE_", "");

            return ResponseEntity.ok(
                    new LoginResponse(token, "Bearer", rol, autenticacion.getName())
            );

        } catch (AuthenticationException ex) {

         
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Credenciales inválidas"));
        }
    }
}
