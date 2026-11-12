package com.veterinary.pet.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.veterinary.pet.entity.EstadoVenta;

public class VentaResponseDTO {

    private Long idVenta;
    private String usuario;
    private Long idPropietario;
    private String propietario;
    private LocalDateTime fechaVenta;
    private BigDecimal total;
    private EstadoVenta estado;

    public VentaResponseDTO() {
    }

    public VentaResponseDTO(Long idVenta, String usuario, Long idPropietario, String propietario,
            LocalDateTime fechaVenta, BigDecimal total, EstadoVenta estado) {
        this.idVenta = idVenta;
        this.usuario = usuario;
        this.idPropietario = idPropietario;
        this.propietario = propietario;
        this.fechaVenta = fechaVenta;
        this.total = total;
        this.estado = estado;
    }

    public Long getIdVenta() {
        return idVenta;
    }

    public void setIdVenta(Long idVenta) {
        this.idVenta = idVenta;
    }

    public String getUsuario() {
        return usuario;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }

    public Long getIdPropietario() {
        return idPropietario;
    }

    public void setIdPropietario(Long idPropietario) {
        this.idPropietario = idPropietario;
    }

    public String getPropietario() {
        return propietario;
    }

    public void setPropietario(String propietario) {
        this.propietario = propietario;
    }

    public LocalDateTime getFechaVenta() {
        return fechaVenta;
    }

    public void setFechaVenta(LocalDateTime fechaVenta) {
        this.fechaVenta = fechaVenta;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public EstadoVenta getEstado() {
        return estado;
    }

    public void setEstado(EstadoVenta estado) {
        this.estado = estado;
    }
}
