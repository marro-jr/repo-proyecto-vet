import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ServicioService } from './servicio.service';
import { Servicio } from './servicio';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './servicios.component.html'
})
export class ServiciosComponent implements OnInit {
  private servicioService = inject(ServicioService);
  private cdr = inject(ChangeDetectorRef);

  servicios: Servicio[] = [];
  servicioActual: Servicio = {
    nombre: '',
    descripcion: '',
    precio: 0,
    duracion: 0
  };
  editando: boolean = false;
  guardando: boolean = false;
  cargando: boolean = false;
  errorMensaje: string = '';
  exitoMensaje: string = '';

  ngOnInit(): void {
    this.cargarServicios();
  }

  cargarServicios(): void {
    this.cargando = true;
    this.errorMensaje = '';
    this.cdr.detectChanges();

    this.servicioService.getServicios().subscribe({
      next: (data) => {
        this.servicios = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMensaje = 'No fue posible cargar el catálogo de servicios.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  guardarServicio(): void {
    if (!this.servicioActual.nombre || !this.servicioActual.descripcion || this.servicioActual.precio == null || !this.servicioActual.duracion) {
      this.errorMensaje = 'Por favor completa todos los campos del formulario.';
      this.cdr.detectChanges();
      return;
    }

    this.guardando = true;
    this.errorMensaje = '';
    this.exitoMensaje = '';
    this.cdr.detectChanges();

    if (this.editando && this.servicioActual.idServicio) {
      this.servicioService.actualizarServicio(this.servicioActual.idServicio, this.servicioActual).subscribe({
        next: () => {
          this.guardando = false;
          this.exitoMensaje = 'Servicio actualizado correctamente.';
          this.cargarServicios();
          this.resetForm();
          this.cdr.detectChanges();
        },
        error: () => {
          this.guardando = false;
          this.errorMensaje = 'No fue posible actualizar el servicio.';
          this.cdr.detectChanges();
        }
      });
    } else {
      this.servicioService.crearServicio(this.servicioActual).subscribe({
        next: () => {
          this.guardando = false;
          this.exitoMensaje = 'Servicio registrado exitosamente.';
          this.cargarServicios();
          this.resetForm();
          this.cdr.detectChanges();
        },
        error: () => {
          this.guardando = false;
          this.errorMensaje = 'No fue posible crear el servicio.';
          this.cdr.detectChanges();
        }
      });
    }
  }

  editarServicio(servicio: Servicio): void {
    this.servicioActual = { ...servicio };
    this.editando = true;
    this.errorMensaje = '';
    this.exitoMensaje = '';
    this.cdr.detectChanges();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  eliminarServicio(idServicio?: number): void {
    if (!idServicio) return;
    if (confirm('¿Estás seguro de eliminar este servicio del catálogo?')) {
      this.errorMensaje = '';
      this.exitoMensaje = '';
      this.cdr.detectChanges();
      this.servicioService.eliminarServicio(idServicio).subscribe({
        next: () => {
          this.exitoMensaje = 'Servicio eliminado correctamente.';
          this.cargarServicios();
          this.cdr.detectChanges();
        },
        error: () => {
          this.errorMensaje = 'No fue posible eliminar el servicio.';
          this.cdr.detectChanges();
        }
      });
    }
  }

  resetForm(): void {
    this.servicioActual = { nombre: '', descripcion: '', precio: 0, duracion: 0 };
    this.editando = false;
    this.cdr.detectChanges();
  }
}