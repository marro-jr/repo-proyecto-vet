package com.veterinary.pet.service;
import com.veterinary.pet.dto.ServicioDTO;
import com.veterinary.pet.entity.Servicio;
import com.veterinary.pet.repository.ServicioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ServicioService {

    @Autowired
    private ServicioRepository servicioRepository;

    public List<ServicioDTO> listarTodos() {
        return servicioRepository.findAll().stream().map(this::convertirADto).collect(Collectors.toList());
    }

    public ServicioDTO crearServicio(ServicioDTO dto) {
        Servicio servicio = convertirAEntidad(dto);
        servicio = servicioRepository.save(servicio);
        return convertirADto(servicio);
    }

    public ServicioDTO actualizarServicio(Long id, ServicioDTO dto) {
        Servicio servicio = servicioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));
        
        servicio.setNombre(dto.getNombre());
        servicio.setDescripcion(dto.getDescripcion());
        servicio.setPrecio(dto.getPrecio());
        servicio.setDuracion(dto.getDuracion());
        
        servicioRepository.save(servicio);
        return convertirADto(servicio);
    }

    public void eliminarServicio(Long id) {
        servicioRepository.deleteById(id);
    }

    private ServicioDTO convertirADto(Servicio servicio) {
        ServicioDTO dto = new ServicioDTO();
        dto.setIdServicio(servicio.getIdServicio());
        dto.setNombre(servicio.getNombre());
        dto.setDescripcion(servicio.getDescripcion());
        dto.setPrecio(servicio.getPrecio());
        dto.setDuracion(servicio.getDuracion());
        return dto;
    }

    private Servicio convertirAEntidad(ServicioDTO dto) {
        Servicio servicio = new Servicio();
        servicio.setNombre(dto.getNombre());
        servicio.setDescripcion(dto.getDescripcion());
        servicio.setPrecio(dto.getPrecio());
        servicio.setDuracion(dto.getDuracion());
        return servicio;
    }
}