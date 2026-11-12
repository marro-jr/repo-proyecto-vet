package com.veterinary.pet.dto;

import java.util.List;

public class VentaCatalogosDTO {

    private List<CatalogoDTO> propietarios;

    public VentaCatalogosDTO() {
    }

    public VentaCatalogosDTO(List<CatalogoDTO> propietarios) {
        this.propietarios = propietarios;
    }

    public List<CatalogoDTO> getPropietarios() {
        return propietarios;
    }

    public void setPropietarios(List<CatalogoDTO> propietarios) {
        this.propietarios = propietarios;
    }
}
