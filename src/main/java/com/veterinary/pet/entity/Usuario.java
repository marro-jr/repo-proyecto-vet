package com.veterinary.pet.entity;

import jakarta.persistence.*;


@Entity 
@Table(name = "usuario")
public class Usuario {
    

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Long idUsuario;

    @Column(name = "nombre" , nullable = false, length = 100)
    private String nombre;

    @Column(name = "apellido" , nullable = false, length = 100)
    private String apellido;

    @Column(name = "correo" , nullable = false, unique = true, length = 100)
    private String correo;

    @Column (name = "password" , nullable = false, length = 100)
    private String password;

    @Column(name = "estado" , nullable = false)
    private Boolean estado;

    @Column(name = "fecha_creacion" , nullable = false)
    private String fechaCreacion;

    public Usuario() {
    }

    @ManyToOne
    @JoinColumn(name = "id_rol", nullable = false)
    private Rol rol;

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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Boolean getEstado() {
        return estado;
    }

    public void setEstado(Boolean estado) {
        this.estado = estado;
    }

    public String getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(String fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public Rol getRol() {
        return rol;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
    }


    
}