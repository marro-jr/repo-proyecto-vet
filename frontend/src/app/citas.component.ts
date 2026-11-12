import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CatalogosCita, Cita, CitaService, DatosCita } from './cita.service';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
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
  formulario: DatosCita = this.crearFormularioVacio();
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
        this.formulario.idMascota = catalogos.mascotas[0]?.id ?? 0;
        this.formulario.idServicio = catalogos.servicios[0]?.id ?? 0;
        this.formulario.idVeterinario = catalogos.veterinarios[0]?.id ?? 0;
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
    this.estaGuardando = true;
    this.mensajeExito = '';
    this.mensajeError = '';
    this.detectorCambios.detectChanges();

    const solicitud = this.citaSeleccionada
      ? this.citaService.actualizarCita(this.citaSeleccionada.idCita, this.formulario)
      : this.citaService.registrarCita(this.formulario);

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
    this.formulario = {
      idMascota: cita.idMascota,
      idServicio: cita.idServicio,
      idVeterinario: cita.idVeterinario,
      fechaHora: cita.fechaHora.substring(0, 16),
      motivo: cita.motivo,
      estado: cita.estado,
      observaciones: cita.observaciones || '',
    };
    this.mensajeExito = '';
    this.mensajeError = '';
    this.detectorCambios.detectChanges();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelarEdicion(): void {
    this.citaSeleccionada = null;
    this.formulario = this.crearFormularioVacio();
    this.formulario.idMascota = this.catalogos.mascotas[0]?.id ?? 0;
    this.formulario.idServicio = this.catalogos.servicios[0]?.id ?? 0;
    this.formulario.idVeterinario = this.catalogos.veterinarios[0]?.id ?? 0;
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

  private crearFormularioVacio(): DatosCita {
    return {
      idMascota: 0,
      idServicio: 0,
      idVeterinario: 0,
      fechaHora: '',
      motivo: '',
      estado: 'PENDIENTE',
      observaciones: '',
    };
  }

  private mostrarError(error: HttpErrorResponse, mensajePredeterminado: string): void {
    const respuesta = error.error as { error?: string; detail?: string } | null;
    this.mensajeError = respuesta?.detail || respuesta?.error || mensajePredeterminado;
    this.detectorCambios.detectChanges();
  }
}
