import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServicioService } from './servicio.service';
import { Servicio } from './servicio';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './servicios.component.html'
})
export class ServiciosComponent implements OnInit {
  servicios: Servicio[] = [];
  servicioActual: Servicio = {
    nombre: '',
    descripcion: '',
    precio: 0,
    duracion: 0
  };
  editando: boolean = false;
  isAdmin: boolean = false;
  cargando: boolean = false;
  errorMensaje: string = '';

  constructor(private servicioService: ServicioService) {}

  ngOnInit(): void {
    this.verificarRol();
    this.cargarServicios();
  }

  verificarRol(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log("Datos del token JWT:", payload); 

        const rolExtraido = payload.rol || payload.role || payload.authorities || '';
        
        if (typeof rolExtraido === 'string') {
          this.isAdmin = rolExtraido.includes('ADMIN');
        } else if (Array.isArray(rolExtraido)) {
          this.isAdmin = rolExtraido.some(r => r.includes('ADMIN'));
        }
      } catch (e) {
        console.error('Error al decodificar el token', e);
      }
    }
  }

  cargarServicios(): void {
    this.cargando = true;
    this.errorMensaje = '';
    this.servicioService.getServicios().subscribe({
      next: (data) => {
        this.servicios = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar servicios', err);
        this.errorMensaje = 'Error al cargar los datos. Verifica que el servidor esté activo.';
        this.cargando = false;
      }
    });
  }

  guardarServicio(): void {
    if (this.editando && this.servicioActual.idServicio) {
      this.servicioService.actualizarServicio(this.servicioActual.idServicio, this.servicioActual).subscribe({
        next: () => {
          this.cargarServicios();
          this.resetForm();
        },
        error: (err) => console.error('Error al actualizar servicio', err)
      });
    } else {
      this.servicioService.crearServicio(this.servicioActual).subscribe({
        next: () => {
          this.cargarServicios();
          this.resetForm();
        },
        error: (err) => console.error('Error al crear servicio', err)
      });
    }
  }

  editarServicio(servicio: Servicio): void {
    this.servicioActual = { ...servicio };
    this.editando = true;
  }

  eliminarServicio(idServicio?: number): void {
    if (idServicio && confirm('¿Estás seguro de eliminar este servicio?')) {
      this.servicioService.eliminarServicio(idServicio).subscribe({
        next: () => this.cargarServicios(),
        error: (err) => console.error('Error al eliminar servicio', err)
      });
    }
  }

  resetForm(): void {
    this.servicioActual = { nombre: '', descripcion: '', precio: 0, duracion: 0 };
    this.editando = false;
  }
}