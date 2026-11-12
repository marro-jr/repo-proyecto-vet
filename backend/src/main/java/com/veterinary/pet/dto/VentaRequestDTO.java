package com.veterinary.pet.dto;

import java.math.BigDecimal;

import com.veterinary.pet.entity.EstadoVenta;

public class VentaRequestDTO {

    private Long idPropietario;
    private BigDecimal total;
    private EstadoVenta estado;

    public VentaRequestDTO() {
    }

    public Long getIdPropietario() {
        return idPropietario;
    }

    public void setIdPropietario(Long idPropietario) {
        this.idPropietario = idPropietario;
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
