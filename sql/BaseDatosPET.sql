
-- =====================================================
-- SISTEMA DE GESTIÓN VETERINARIA
-- MySQL 8
-- =====================================================

USE veterinaria_db;


-- =====================================================
-- 1. ROLES
-- ADMIN = Veterinario / Administrador
-- USER  = Recepcionista / Empleado
-- =====================================================

CREATE TABLE IF NOT EXISTS rol (
    id_rol BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(150)
) ENGINE=InnoDB;


-- =====================================================
-- 2. USUARIOS
-- Utilizada por Spring Security + JWT
-- =====================================================

CREATE TABLE IF NOT EXISTS usuario (
    id_usuario BIGINT AUTO_INCREMENT PRIMARY KEY,

    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,

    correo VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,

    estado ENUM('ACTIVO', 'INACTIVO')
        NOT NULL DEFAULT 'ACTIVO',

    fecha_creacion DATE NOT NULL
        DEFAULT (CURRENT_DATE),

    id_rol BIGINT NOT NULL,

    CONSTRAINT fk_usuario_rol
        FOREIGN KEY (id_rol)
        REFERENCES rol(id_rol)
        ON DELETE RESTRICT

) ENGINE=InnoDB;


-- =====================================================
-- 3. PROPIETARIOS
-- Dueños de las mascotas
-- =====================================================

CREATE TABLE IF NOT EXISTS propietario (
    id_propietario BIGINT AUTO_INCREMENT PRIMARY KEY,

    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,

    documento VARCHAR(20) UNIQUE,
    telefono VARCHAR(20) NOT NULL,
    correo VARCHAR(100),
    direccion VARCHAR(200)

) ENGINE=InnoDB;


-- =====================================================
-- 4. MASCOTAS
-- Cada mascota pertenece a un propietario
-- =====================================================

CREATE TABLE IF NOT EXISTS mascota (
    id_mascota BIGINT AUTO_INCREMENT PRIMARY KEY,

    nombre VARCHAR(100) NOT NULL,
    especie VARCHAR(50) NOT NULL,
    raza VARCHAR(100),

    sexo ENUM('MACHO', 'HEMBRA'),

    fecha_nacimiento DATE,
    peso DECIMAL(6,2),

    estado ENUM('ACTIVO', 'INACTIVO')
        NOT NULL DEFAULT 'ACTIVO',

    id_propietario BIGINT NOT NULL,

    CONSTRAINT fk_mascota_propietario
        FOREIGN KEY (id_propietario)
        REFERENCES propietario(id_propietario)
        ON DELETE RESTRICT,

    CONSTRAINT chk_mascota_peso
        CHECK (peso IS NULL OR peso > 0)

) ENGINE=InnoDB;


-- =====================================================
-- 5. SERVICIOS VETERINARIOS
-- Consultas, vacunas, baños, desparasitación, etc.
-- =====================================================

CREATE TABLE IF NOT EXISTS servicio (
    id_servicio BIGINT AUTO_INCREMENT PRIMARY KEY,

    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(250),

    precio DECIMAL(10,2) NOT NULL,
    duracion_minutos INT NOT NULL DEFAULT 30,

    activo BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT chk_servicio_precio
        CHECK (precio >= 0),

    CONSTRAINT chk_servicio_duracion
        CHECK (duracion_minutos > 0)

) ENGINE=InnoDB;


-- =====================================================
-- 6. CITAS VETERINARIAS
-- Mascota + Servicio + Veterinario + Fecha
-- =====================================================

CREATE TABLE IF NOT EXISTS cita (
    id_cita BIGINT AUTO_INCREMENT PRIMARY KEY,

    id_mascota BIGINT NOT NULL,
    id_servicio BIGINT NOT NULL,

    id_veterinario BIGINT NOT NULL,
    id_usuario_registro BIGINT NOT NULL,

    fecha_hora DATETIME NOT NULL,
    motivo VARCHAR(250) NOT NULL,

    estado ENUM(
        'PENDIENTE',
        'CONFIRMADA',
        'ATENDIDA',
        'CANCELADA'
    ) NOT NULL DEFAULT 'PENDIENTE',

    observaciones VARCHAR(500),

    CONSTRAINT fk_cita_mascota
        FOREIGN KEY (id_mascota)
        REFERENCES mascota(id_mascota)
        ON DELETE RESTRICT,

    CONSTRAINT fk_cita_servicio
        FOREIGN KEY (id_servicio)
        REFERENCES servicio(id_servicio)
        ON DELETE RESTRICT,

    CONSTRAINT fk_cita_veterinario
        FOREIGN KEY (id_veterinario)
        REFERENCES usuario(id_usuario)
        ON DELETE RESTRICT,

    CONSTRAINT fk_cita_usuario_registro
        FOREIGN KEY (id_usuario_registro)
        REFERENCES usuario(id_usuario)
        ON DELETE RESTRICT

) ENGINE=InnoDB;


-- =====================================================
-- 7. ATENCIONES MÉDICAS
-- Registros del historial clínico de cada mascota
-- =====================================================

CREATE TABLE IF NOT EXISTS atencion (
    id_atencion BIGINT AUTO_INCREMENT PRIMARY KEY,

    id_mascota BIGINT NOT NULL,
    id_veterinario BIGINT NOT NULL,

    id_cita BIGINT UNIQUE,

    fecha_atencion DATETIME NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    peso DECIMAL(6,2),

    diagnostico TEXT NOT NULL,
    tratamiento TEXT,
    observaciones TEXT,

    CONSTRAINT fk_atencion_mascota
        FOREIGN KEY (id_mascota)
        REFERENCES mascota(id_mascota)
        ON DELETE RESTRICT,

    CONSTRAINT fk_atencion_veterinario
        FOREIGN KEY (id_veterinario)
        REFERENCES usuario(id_usuario)
        ON DELETE RESTRICT,

    CONSTRAINT fk_atencion_cita
        FOREIGN KEY (id_cita)
        REFERENCES cita(id_cita)
        ON DELETE RESTRICT,

    CONSTRAINT chk_atencion_peso
        CHECK (peso IS NULL OR peso > 0)

) ENGINE=InnoDB;


-- =====================================================
-- 8. VACUNAS
-- Catálogo de vacunas disponibles
-- =====================================================

CREATE TABLE IF NOT EXISTS vacuna (
    id_vacuna BIGINT AUTO_INCREMENT PRIMARY KEY,

    nombre VARCHAR(120) NOT NULL UNIQUE,
    descripcion VARCHAR(300)

) ENGINE=InnoDB;


-- =====================================================
-- 9. VACUNACIONES
-- Historial de vacunas aplicadas a mascotas
-- =====================================================

CREATE TABLE IF NOT EXISTS vacunacion (
    id_vacunacion BIGINT AUTO_INCREMENT PRIMARY KEY,

    id_mascota BIGINT NOT NULL,
    id_vacuna BIGINT NOT NULL,
    id_veterinario BIGINT NOT NULL,

    fecha_aplicacion DATE NOT NULL,
    proxima_dosis DATE,

    lote VARCHAR(100),
    observaciones VARCHAR(500),

    CONSTRAINT fk_vacunacion_mascota
        FOREIGN KEY (id_mascota)
        REFERENCES mascota(id_mascota)
        ON DELETE RESTRICT,

    CONSTRAINT fk_vacunacion_vacuna
        FOREIGN KEY (id_vacuna)
        REFERENCES vacuna(id_vacuna)
        ON DELETE RESTRICT,

    CONSTRAINT fk_vacunacion_veterinario
        FOREIGN KEY (id_veterinario)
        REFERENCES usuario(id_usuario)
        ON DELETE RESTRICT,

    CONSTRAINT chk_vacunacion_fecha
        CHECK (
            proxima_dosis IS NULL
            OR proxima_dosis >= fecha_aplicacion
        )

) ENGINE=InnoDB;


-- =====================================================
-- 10. PRODUCTOS
-- Alimentos, accesorios, medicamentos, etc.
-- =====================================================

CREATE TABLE IF NOT EXISTS producto (
    id_producto BIGINT AUTO_INCREMENT PRIMARY KEY,

    codigo VARCHAR(30) NOT NULL UNIQUE,
    nombre VARCHAR(120) NOT NULL,
    descripcion VARCHAR(300),
    categoria VARCHAR(80),

    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,

    activo BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT chk_producto_precio
        CHECK (precio >= 0),

    CONSTRAINT chk_producto_stock
        CHECK (stock >= 0)

) ENGINE=InnoDB;


-- =====================================================
-- 11. VENTAS
-- Registra quién realizó la venta
-- =====================================================

CREATE TABLE IF NOT EXISTS venta (
    id_venta BIGINT AUTO_INCREMENT PRIMARY KEY,

    id_usuario BIGINT NOT NULL,
    id_propietario BIGINT,

    fecha_venta DATETIME NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    total DECIMAL(12,2) NOT NULL DEFAULT 0,

    estado ENUM(
        'REGISTRADA',
        'ANULADA'
    ) NOT NULL DEFAULT 'REGISTRADA',

    CONSTRAINT fk_venta_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
        ON DELETE RESTRICT,

    CONSTRAINT fk_venta_propietario
        FOREIGN KEY (id_propietario)
        REFERENCES propietario(id_propietario)
        ON DELETE RESTRICT,

    CONSTRAINT chk_venta_total
        CHECK (total >= 0)

) ENGINE=InnoDB;


-- =====================================================
-- 12. DETALLE DE VENTA
-- Productos vendidos, cantidades y precios
-- =====================================================

CREATE TABLE IF NOT EXISTS detalle_venta (
    id_detalle BIGINT AUTO_INCREMENT PRIMARY KEY,

    id_venta BIGINT NOT NULL,
    id_producto BIGINT NOT NULL,

    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,

    CONSTRAINT fk_detalle_venta
        FOREIGN KEY (id_venta)
        REFERENCES venta(id_venta)
        ON DELETE RESTRICT,

    CONSTRAINT fk_detalle_producto
        FOREIGN KEY (id_producto)
        REFERENCES producto(id_producto)
        ON DELETE RESTRICT,

    CONSTRAINT uk_venta_producto
        UNIQUE (id_venta, id_producto),

    CONSTRAINT chk_detalle_cantidad
        CHECK (cantidad > 0),

    CONSTRAINT chk_detalle_precio
        CHECK (precio_unitario >= 0)

) ENGINE=InnoDB;


-- =====================================================
-- 13. ÍNDICES
-- Para optimizar consultas frecuentes
-- =====================================================

CREATE INDEX idx_cita_fecha
ON cita(fecha_hora);

CREATE INDEX idx_cita_estado
ON cita(estado);

CREATE INDEX idx_cita_veterinario_fecha
ON cita(id_veterinario, fecha_hora);

CREATE INDEX idx_atencion_mascota_fecha
ON atencion(id_mascota, fecha_atencion);

CREATE INDEX idx_vacunacion_mascota_fecha
ON vacunacion(id_mascota, fecha_aplicacion);

CREATE INDEX idx_venta_fecha
ON venta(fecha_venta);


-- =====================================================
-- 14. DATOS INICIALES
-- DML: roles del sistema
-- =====================================================

INSERT IGNORE INTO rol (nombre, descripcion)
VALUES
('ADMIN', 'Veterinario y administrador'),
('USER', 'Recepcionista o empleado');


-- =====================================================
-- 15. SERVICIOS INICIALES
-- DML: valores de ejemplo en soles
-- =====================================================

INSERT IGNORE INTO servicio
(nombre, descripcion, precio, duracion_minutos)
VALUES
('Consulta general',
 'Evaluación médica general', 50.00, 30),

('Vacunación',
 'Aplicación de vacuna veterinaria', 45.00, 20),

('Desparasitación',
 'Tratamiento antiparasitario', 35.00, 20),

('Baño y peluquería',
 'Aseo y corte de pelo', 60.00, 60),

('Control médico',
 'Seguimiento de tratamiento', 40.00, 30),

('Limpieza dental',
 'Servicio de higiene dental', 100.00, 60);


-- =====================================================
-- 16. VERIFICACIÓN
-- =====================================================

SHOW TABLES;

SELECT * FROM rol;

SELECT * FROM servicio;
