import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CatalogosCita, Cita, CitaService, DatosCita } from './cita.service';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './citas.component.html',
})
export class CitasComponent implements OnInit {
  private citaService = inject(CitaService);
  private detectorCambios = inject(ChangeDetectorRef);

  listaCitas: Cita[] = [];
  catalogos: CatalogosCita = {
    mascotas: [],
    servicios: [],
    veterinarios: [],
  };
  citaSeleccionada: Cita | null = null;
  formularioCita = new FormGroup({
    idMascota: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
    }),
    idServicio: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
    }),
    idVeterinario: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
    }),
    fechaHora: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    motivo: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    estado: new FormControl<'PENDIENTE' | 'CONFIRMADA' | 'ATENDIDA' | 'CANCELADA'>('PENDIENTE', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    observaciones: new FormControl('', { nonNullable: true }),
  });
  formularioEnviado = false;
  estaCargando = false;
  estaGuardando = false;
  mensajeExito = '';
  mensajeError = '';

  ngOnInit(): void {
    this.cargarCatalogos();
    this.cargarCitas();
  }

  cargarCatalogos(): void {
    this.citaService.obtenerCatalogos().subscribe({
      next: (catalogos) => {
        this.catalogos = catalogos;
        if (!this.citaSeleccionada) {
          this.formularioCita.patchValue({
            idMascota: catalogos.mascotas[0]?.id ?? 0,
            idServicio: catalogos.servicios[0]?.id ?? 0,
            idVeterinario: catalogos.veterinarios[0]?.id ?? 0,
          });
        }
        this.detectorCambios.detectChanges();
      },
      error: (error) => this.mostrarError(error, 'No fue posible cargar los catálogos.'),
    });
  }

  cargarCitas(): void {
    this.estaCargando = true;
    this.mensajeError = '';
    this.detectorCambios.detectChanges();

    this.citaService.listarCitas().subscribe({
      next: (citas) => {
        this.listaCitas = citas;
        this.estaCargando = false;
        this.detectorCambios.detectChanges();
      },
      error: (error) => {
        this.estaCargando = false;
        this.mostrarError(error, 'No fue posible cargar las citas.');
      },
    });
  }

  guardarCita(): void {
    this.formularioEnviado = true;

    if (this.formularioCita.invalid) {
      this.formularioCita.markAllAsTouched();
      this.mensajeError = 'Revisa los campos del formulario.';
      this.detectorCambios.detectChanges();
      return;
    }

    this.estaGuardando = true;
    this.mensajeExito = '';
    this.mensajeError = '';
    this.detectorCambios.detectChanges();

    const formulario = this.formularioCita.getRawValue();
    const datosCita: DatosCita = {
      idMascota: formulario.idMascota,
      idServicio: formulario.idServicio,
      idVeterinario: formulario.idVeterinario,
      fechaHora: formulario.fechaHora,
      motivo: formulario.motivo.trim(),
      estado: formulario.estado,
      observaciones: formulario.observaciones.trim(),
    };
    const solicitud = this.citaSeleccionada
      ? this.citaService.actualizarCita(this.citaSeleccionada.idCita, datosCita)
      : this.citaService.registrarCita(datosCita);

    solicitud.subscribe({
      next: () => {
        this.mensajeExito = this.citaSeleccionada
          ? 'Cita actualizada correctamente.'
          : 'Cita registrada correctamente.';
        this.estaGuardando = false;
        this.cancelarEdicion();
        this.cargarCitas();
      },
      error: (error) => {
        this.estaGuardando = false;
        this.mostrarError(error, 'No fue posible guardar la cita.');
      },
    });
  }

  editarCita(cita: Cita): void {
    this.citaSeleccionada = cita;
    this.formularioCita.setValue({
      idMascota: cita.idMascota,
      idServicio: cita.idServicio,
      idVeterinario: cita.idVeterinario,
      fechaHora: cita.fechaHora.substring(0, 16),
      motivo: cita.motivo,
      estado: cita.estado,
      observaciones: cita.observaciones || '',
    });
    this.formularioEnviado = false;
    this.mensajeExito = '';
    this.mensajeError = '';
    this.detectorCambios.detectChanges();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelarEdicion(): void {
    this.citaSeleccionada = null;
    this.formularioCita.reset({
      idMascota: this.catalogos.mascotas[0]?.id ?? 0,
      idServicio: this.catalogos.servicios[0]?.id ?? 0,
      idVeterinario: this.catalogos.veterinarios[0]?.id ?? 0,
      fechaHora: '',
      motivo: '',
      estado: 'PENDIENTE',
      observaciones: '',
    });
    this.formularioEnviado = false;
    this.detectorCambios.detectChanges();
  }

  eliminarCita(cita: Cita): void {
    if (!window.confirm('¿Eliminar la cita de ' + cita.mascota + '?')) {
      return;
    }

    this.citaService.eliminarCita(cita.idCita).subscribe({
      next: () => {
        this.mensajeExito = 'Cita eliminada correctamente.';
        this.cargarCitas();
      },
      error: (error) => this.mostrarError(error, 'No fue posible eliminar la cita.'),
    });
  }

  campoInvalido(nombreCampo: string): boolean {
    const campo = this.formularioCita.get(nombreCampo);
    return !!campo && campo.invalid && (campo.touched || this.formularioEnviado);
  }

  private mostrarError(error: HttpErrorResponse, mensajePredeterminado: string): void {
    const respuesta = error.error as { error?: string; detail?: string } | null;
    this.mensajeError = respuesta?.detail || respuesta?.error || mensajePredeterminado;
    this.detectorCambios.detectChanges();
  }
}
