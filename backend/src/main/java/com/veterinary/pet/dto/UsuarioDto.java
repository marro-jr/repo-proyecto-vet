package com.veterinary.pet.dto;

import com.veterinary.pet.entity.EstadoUsuario;

public class UsuarioDto {

    private String nombre;
    private String correo;
    private EstadoUsuario estado;
    private String nombreRol;

    public UsuarioDto() {
    }

    public UsuarioDto(String nombre, String correo, EstadoUsuario estado, String nombreRol) {
        this.nombre = nombre;
        this.correo = correo;
        this.estado = estado;
        this.nombreRol = nombreRol;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public EstadoUsuario getEstado() {
        return estado;
    }

    public void setEstado(EstadoUsuario estado) {
        this.estado = estado;
    }

    public String getNombreRol() {
        return nombreRol;
    }

    public void setNombreRol(String nombreRol) {
        this.nombreRol = nombreRol;
    }
}
