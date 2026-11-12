package com.veterinary.pet.dto;

import java.util.List;

public class CitaCatalogosDTO {

    private List<CatalogoDTO> mascotas;
    private List<CatalogoDTO> servicios;
    private List<CatalogoDTO> veterinarios;

    public CitaCatalogosDTO() {
    }

    public CitaCatalogosDTO(List<CatalogoDTO> mascotas, List<CatalogoDTO> servicios,
            List<CatalogoDTO> veterinarios) {
        this.mascotas = mascotas;
        this.servicios = servicios;
        this.veterinarios = veterinarios;
    }

    public List<CatalogoDTO> getMascotas() {
        return mascotas;
    }

    public void setMascotas(List<CatalogoDTO> mascotas) {
        this.mascotas = mascotas;
    }

    public List<CatalogoDTO> getServicios() {
        return servicios;
    }

    public void setServicios(List<CatalogoDTO> servicios) {
        this.servicios = servicios;
    }

    public List<CatalogoDTO> getVeterinarios() {
        return veterinarios;
    }

    public void setVeterinarios(List<CatalogoDTO> veterinarios) {
        this.veterinarios = veterinarios;
    }
}
