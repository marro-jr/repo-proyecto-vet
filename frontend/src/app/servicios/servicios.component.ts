import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Servicio } from './servicio';
import { ServicioService } from './servicio.service';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './servicios.component.html',
})
export class ServiciosComponent implements OnInit {
  private servicioService = inject(ServicioService);
  private detectorCambios = inject(ChangeDetectorRef);

  listaServicios: Servicio[] = [];
  servicioSeleccionado: Servicio | null = null;
  formularioServicio = new FormGroup({
    nombre: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    descripcion: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    precio: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),
    duracion: new FormControl(30, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
    }),
  });
  formularioEnviado = false;
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
    this.formularioEnviado = true;

    if (this.formularioServicio.invalid) {
      this.formularioServicio.markAllAsTouched();
      this.mensajeError = 'Revisa los campos del formulario.';
      this.detectorCambios.detectChanges();
      return;
    }

    this.estaGuardando = true;
    this.mensajeExito = '';
    this.mensajeError = '';
    this.detectorCambios.detectChanges();

    const formulario = this.formularioServicio.getRawValue();
    const datosServicio: Servicio = {
      nombre: formulario.nombre.trim(),
      descripcion: formulario.descripcion.trim(),
      precio: formulario.precio,
      duracion: formulario.duracion,
    };
    const idServicio = this.servicioSeleccionado?.idServicio;
    const solicitud = idServicio
      ? this.servicioService.actualizarServicio(idServicio, datosServicio)
      : this.servicioService.registrarServicio(datosServicio);

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
    this.formularioServicio.setValue({
      nombre: servicio.nombre,
      descripcion: servicio.descripcion,
      precio: servicio.precio,
      duracion: servicio.duracion,
    });
    this.formularioEnviado = false;
    this.mensajeExito = '';
    this.mensajeError = '';
    this.detectorCambios.detectChanges();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelarEdicion(): void {
    this.servicioSeleccionado = null;
    this.formularioServicio.reset({
      nombre: '',
      descripcion: '',
      precio: 0,
      duracion: 30,
    });
    this.formularioEnviado = false;
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

  campoInvalido(nombreCampo: string): boolean {
    const campo = this.formularioServicio.get(nombreCampo);
    return !!campo && campo.invalid && (campo.touched || this.formularioEnviado);
  }

  private mostrarError(error: HttpErrorResponse, mensajePredeterminado: string): void {
    const respuesta = error.error as { error?: string; detail?: string } | null;
    this.mensajeError = respuesta?.detail || respuesta?.error || mensajePredeterminado;
    this.detectorCambios.detectChanges();
  }
}
