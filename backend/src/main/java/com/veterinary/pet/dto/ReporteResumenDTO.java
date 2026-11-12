package com.veterinary.pet.dto;

import java.math.BigDecimal;

public class ReporteResumenDTO {

    private long usuarios;
    private long servicios;
    private long propietarios;
    private long mascotas;
    private long citas;
    private long ventas;
    private BigDecimal totalVentas;

    public ReporteResumenDTO() {
    }

    public ReporteResumenDTO(long usuarios, long servicios, long propietarios, long mascotas,
            long citas, long ventas, BigDecimal totalVentas) {
        this.usuarios = usuarios;
        this.servicios = servicios;
        this.propietarios = propietarios;
        this.mascotas = mascotas;
        this.citas = citas;
        this.ventas = ventas;
        this.totalVentas = totalVentas;
    }

    public long getUsuarios() {
        return usuarios;
    }

    public void setUsuarios(long usuarios) {
        this.usuarios = usuarios;
    }

    public long getServicios() {
        return servicios;
    }

    public void setServicios(long servicios) {
        this.servicios = servicios;
    }

    public long getPropietarios() {
        return propietarios;
    }

    public void setPropietarios(long propietarios) {
        this.propietarios = propietarios;
    }

    public long getMascotas() {
        return mascotas;
    }

    public void setMascotas(long mascotas) {
        this.mascotas = mascotas;
    }

    public long getCitas() {
        return citas;
    }

    public void setCitas(long citas) {
        this.citas = citas;
    }

    public long getVentas() {
        return ventas;
    }

    public void setVentas(long ventas) {
        this.ventas = ventas;
    }

    public BigDecimal getTotalVentas() {
        return totalVentas;
    }

    public void setTotalVentas(BigDecimal totalVentas) {
        this.totalVentas = totalVentas;
    }
}
