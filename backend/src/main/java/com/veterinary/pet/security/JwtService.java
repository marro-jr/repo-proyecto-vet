package com.veterinary.pet.security;

import java.time.Instant;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;



@Service
public class JwtService {

    private final SecretKey clave;

    public JwtService( @Value("${app.jwt.secret}") String textoBase64){

        byte[] bytes = Decoders.BASE64.decode(textoBase64);

        this.clave = Keys.hmacShaKeyFor(bytes);

    }
    
    public String generarToken(String correo){

        Instant ahora = Instant.now();
        Instant vencimiento = ahora.plusSeconds(3600);

        return Jwts.builder()
        .subject(correo)
        .issuedAt(Date.from(ahora))
        .expiration(Date.from(vencimiento))
        .signWith(this.clave, Jwts.SIG.HS256)
        .compact();

    }   
    
    public String obtenerCorreo(String token){
        return Jwts.parser()
        .verifyWith(this.clave)
        .build()
        .parseSignedClaims(token)
        .getPayload()
        .getSubject();
    }

}
