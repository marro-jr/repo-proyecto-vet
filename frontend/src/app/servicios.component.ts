import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Servicio } from './servicio';
import { ServicioService } from './servicio.service';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './servicios.component.html',
})
export class ServiciosComponent implements OnInit {
  private servicioService = inject(ServicioService);
  private detectorCambios = inject(ChangeDetectorRef);

  listaServicios: Servicio[] = [];
  servicioSeleccionado: Servicio | null = null;
  formulario: Servicio = this.crearFormularioVacio();
  estaCargando = false;
  estaGuardando = false;
  mensajeExito = '';
  mensajeError = '';

  get estaEditando(): boolean {
    return this.servicioSeleccionado !== null;
  }

  ngOnInit(): void {
    this.cargarServicios();
  }

  cargarServicios(): void {
    this.estaCargando = true;
    this.mensajeError = '';
    this.detectorCambios.detectChanges();

    this.servicioService.listarServicios().subscribe({
      next: (servicios) => {
        this.listaServicios = servicios;
        this.estaCargando = false;
        this.detectorCambios.detectChanges();
      },
      error: (error) => {
        this.estaCargando = false;
        this.mostrarError(error, 'No fue posible cargar el catálogo de servicios.');
      },
    });
  }

  guardarServicio(): void {
    this.estaGuardando = true;
    this.mensajeExito = '';
    this.mensajeError = '';
    this.detectorCambios.detectChanges();

    const idServicio = this.servicioSeleccionado?.idServicio;
    const solicitud = idServicio
      ? this.servicioService.actualizarServicio(idServicio, this.formulario)
      : this.servicioService.registrarServicio(this.formulario);

    solicitud.subscribe({
      next: () => {
        this.mensajeExito = idServicio
          ? 'Servicio actualizado correctamente.'
          : 'Servicio registrado correctamente.';
        this.estaGuardando = false;
        this.cancelarEdicion();
        this.cargarServicios();
      },
      error: (error) => {
        this.estaGuardando = false;
        this.mostrarError(error, 'No fue posible guardar el servicio.');
      },
    });
  }

  editarServicio(servicio: Servicio): void {
    this.servicioSeleccionado = servicio;
    this.formulario = { ...servicio };
    this.mensajeExito = '';
    this.mensajeError = '';
    this.detectorCambios.detectChanges();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelarEdicion(): void {
    this.servicioSeleccionado = null;
    this.formulario = this.crearFormularioVacio();
    this.detectorCambios.detectChanges();
  }

  eliminarServicio(servicio: Servicio): void {
    if (!servicio.idServicio || !window.confirm('¿Eliminar el servicio ' + servicio.nombre + '?')) {
      return;
    }

    this.mensajeExito = '';
    this.mensajeError = '';
    this.servicioService.eliminarServicio(servicio.idServicio).subscribe({
      next: () => {
        this.mensajeExito = 'Servicio eliminado correctamente.';
        this.cargarServicios();
      },
      error: (error) => this.mostrarError(error, 'No fue posible eliminar el servicio.'),
    });
  }

  private crearFormularioVacio(): Servicio {
    return {
      nombre: '',
      descripcion: '',
      precio: 0,
      duracion: 30,
    };
  }

  private mostrarError(error: HttpErrorResponse, mensajePredeterminado: string): void {
    const respuesta = error.error as { error?: string; detail?: string } | null;
    this.mensajeError = respuesta?.detail || respuesta?.error || mensajePredeterminado;
    this.detectorCambios.detectChanges();
  }
}
