package com.veterinary.pet.dto;

import java.time.LocalDate;

import com.veterinary.pet.entity.EstadoUsuario;

public class UsuarioResponseDTO {

    private Long idUsuario;
    private String nombre;
    private String apellido;
    private String correo;
    private EstadoUsuario estado;
    private LocalDate fechaCreacion;
    private Long idRol;
    private String rol;
    private String rolDescripcion;

    public UsuarioResponseDTO() {
    }

    public UsuarioResponseDTO(Long idUsuario, String nombre, String apellido, String correo,
                              EstadoUsuario estado, LocalDate fechaCreacion,
                              Long idRol, String rol, String rolDescripcion) {
        this.idUsuario = idUsuario;
        this.nombre = nombre;
        this.apellido = apellido;
        this.correo = correo;
        this.estado = estado;
        this.fechaCreacion = fechaCreacion;
        this.idRol = idRol;
        this.rol = rol;
        this.rolDescripcion = rolDescripcion;
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
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

    public EstadoUsuario getEstado() {
        return estado;
    }

    public void setEstado(EstadoUsuario estado) {
        this.estado = estado;
    }

    public LocalDate getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDate fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public Long getIdRol() {
        return idRol;
    }

    public void setIdRol(Long idRol) {
        this.idRol = idRol;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public String getRolDescripcion() {
        return rolDescripcion;
    }

    public void setRolDescripcion(String rolDescripcion) {
        this.rolDescripcion = rolDescripcion;
    }
}
