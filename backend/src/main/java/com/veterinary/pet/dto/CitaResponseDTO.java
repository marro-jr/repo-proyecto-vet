package com.veterinary.pet.dto;

import java.time.LocalDateTime;

import com.veterinary.pet.entity.EstadoCita;

public class CitaResponseDTO {

    private Long idCita;
    private Long idMascota;
    private String mascota;
    private Long idServicio;
    private String servicio;
    private Long idVeterinario;
    private String veterinario;
    private String usuarioRegistro;
    private LocalDateTime fechaHora;
    private String motivo;
    private EstadoCita estado;
    private String observaciones;

    public CitaResponseDTO() {
    }

    public CitaResponseDTO(Long idCita, Long idMascota, String mascota, Long idServicio,
            String servicio, Long idVeterinario, String veterinario, String usuarioRegistro,
            LocalDateTime fechaHora, String motivo, EstadoCita estado, String observaciones) {
        this.idCita = idCita;
        this.idMascota = idMascota;
        this.mascota = mascota;
        this.idServicio = idServicio;
        this.servicio = servicio;
        this.idVeterinario = idVeterinario;
        this.veterinario = veterinario;
        this.usuarioRegistro = usuarioRegistro;
        this.fechaHora = fechaHora;
        this.motivo = motivo;
        this.estado = estado;
        this.observaciones = observaciones;
    }

    public Long getIdCita() {
        return idCita;
    }

    public void setIdCita(Long idCita) {
        this.idCita = idCita;
    }

    public Long getIdMascota() {
        return idMascota;
    }

    public void setIdMascota(Long idMascota) {
        this.idMascota = idMascota;
    }

    public String getMascota() {
        return mascota;
    }

    public void setMascota(String mascota) {
        this.mascota = mascota;
    }

    public Long getIdServicio() {
        return idServicio;
    }

    public void setIdServicio(Long idServicio) {
        this.idServicio = idServicio;
    }

    public String getServicio() {
        return servicio;
    }

    public void setServicio(String servicio) {
        this.servicio = servicio;
    }

    public Long getIdVeterinario() {
        return idVeterinario;
    }

    public void setIdVeterinario(Long idVeterinario) {
        this.idVeterinario = idVeterinario;
    }

    public String getVeterinario() {
        return veterinario;
    }

    public void setVeterinario(String veterinario) {
        this.veterinario = veterinario;
    }

    public String getUsuarioRegistro() {
        return usuarioRegistro;
    }

    public void setUsuarioRegistro(String usuarioRegistro) {
        this.usuarioRegistro = usuarioRegistro;
    }

    public LocalDateTime getFechaHora() {
        return fechaHora;
    }

    public void setFechaHora(LocalDateTime fechaHora) {
        this.fechaHora = fechaHora;
    }

    public String getMotivo() {
        return motivo;
    }

    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }

    public EstadoCita getEstado() {
        return estado;
    }

    public void setEstado(EstadoCita estado) {
        this.estado = estado;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }
}
