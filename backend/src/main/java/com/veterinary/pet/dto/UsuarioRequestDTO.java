package com.veterinary.pet.dto;

import com.veterinary.pet.entity.EstadoUsuario;

public class UsuarioRequestDTO {

    private String nombre;
    private String apellido;
    private String correo;
    private String password;
    private EstadoUsuario estado;
    private Long idRol;

    public UsuarioRequestDTO() {
    }

    public UsuarioRequestDTO(String nombre, String apellido, String correo, String password, EstadoUsuario estado, Long idRol) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.correo = correo;
        this.password = password;
        this.estado = estado;
        this.idRol = idRol;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public EstadoUsuario getEstado() {
        return estado;
    }

    public void setEstado(EstadoUsuario estado) {
        this.estado = estado;
    }

    public Long getIdRol() {
        return idRol;
    }

    public void setIdRol(Long idRol) {
        this.idRol = idRol;
    }
}
