package com.veterinary.pet.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.veterinary.pet.entity.EstadoVenta;
import com.veterinary.pet.entity.Venta;

public interface VentaRepository extends JpaRepository<Venta, Long> {

    List<Venta> findAllByOrderByFechaVentaDesc();

    @Query("SELECT COALESCE(SUM(v.total), 0) FROM Venta v WHERE v.estado = :estado")
    BigDecimal sumarPorEstado(@Param("estado") EstadoVenta estado);
}
