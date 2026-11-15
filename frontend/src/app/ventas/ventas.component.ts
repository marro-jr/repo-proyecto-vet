import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CatalogosVenta, DatosVenta, Venta, VentaService } from './venta.service';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './ventas.component.html',
})
export class VentasComponent implements OnInit {
  private ventaService = inject(VentaService);
  private detectorCambios = inject(ChangeDetectorRef);

  listaVentas: Venta[] = [];
  catalogos: CatalogosVenta = { propietarios: [] };
  ventaSeleccionada: Venta | null = null;
  formularioVenta = new FormGroup({
    idPropietario: new FormControl<number | null>(null),
    total: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),
    estado: new FormControl<'REGISTRADA' | 'ANULADA'>('REGISTRADA', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });
  formularioEnviado = false;
  estaCargando = false;
  estaGuardando = false;
  mensajeExito = '';
  mensajeError = '';

  ngOnInit(): void {
    this.cargarCatalogos();
    this.cargarVentas();
  }

  cargarCatalogos(): void {
    this.ventaService.obtenerCatalogos().subscribe({
      next: (catalogos) => {
        this.catalogos = catalogos;
        this.detectorCambios.detectChanges();
      },
      error: (error) => this.mostrarError(error, 'No fue posible cargar los propietarios.'),
    });
  }

  cargarVentas(): void {
    this.estaCargando = true;
    this.mensajeError = '';
    this.detectorCambios.detectChanges();

    this.ventaService.listarVentas().subscribe({
      next: (ventas) => {
        this.listaVentas = ventas;
        this.estaCargando = false;
        this.detectorCambios.detectChanges();
      },
      error: (error) => {
        this.estaCargando = false;
        this.mostrarError(error, 'No fue posible cargar las ventas.');
      },
    });
  }

  guardarVenta(): void {
    this.formularioEnviado = true;

    if (this.formularioVenta.invalid) {
      this.formularioVenta.markAllAsTouched();
      this.mensajeError = 'Revisa los campos del formulario.';
      this.detectorCambios.detectChanges();
      return;
    }

    this.estaGuardando = true;
    this.mensajeExito = '';
    this.mensajeError = '';
    this.detectorCambios.detectChanges();

    const formulario = this.formularioVenta.getRawValue();
    const datosVenta: DatosVenta = {
      idPropietario: formulario.idPropietario,
      total: formulario.total,
      estado: formulario.estado,
    };
    const solicitud = this.ventaSeleccionada
      ? this.ventaService.actualizarVenta(this.ventaSeleccionada.idVenta, datosVenta)
      : this.ventaService.registrarVenta(datosVenta);

    solicitud.subscribe({
      next: () => {
        this.mensajeExito = this.ventaSeleccionada
          ? 'Venta actualizada correctamente.'
          : 'Venta registrada correctamente.';
        this.estaGuardando = false;
        this.cancelarEdicion();
        this.cargarVentas();
      },
      error: (error) => {
        this.estaGuardando = false;
        this.mostrarError(error, 'No fue posible guardar la venta.');
      },
    });
  }

  editarVenta(venta: Venta): void {
    this.ventaSeleccionada = venta;
    this.formularioVenta.setValue({
      idPropietario: venta.idPropietario,
      total: venta.total,
      estado: venta.estado,
    });
    this.formularioEnviado = false;
    this.mensajeExito = '';
    this.mensajeError = '';
    this.detectorCambios.detectChanges();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelarEdicion(): void {
    this.ventaSeleccionada = null;
    this.formularioVenta.reset({
      idPropietario: null,
      total: 0,
      estado: 'REGISTRADA',
    });
    this.formularioEnviado = false;
    this.detectorCambios.detectChanges();
  }

  eliminarVenta(venta: Venta): void {
    if (!window.confirm('¿Eliminar la venta #' + venta.idVenta + '?')) {
      return;
    }

    this.ventaService.eliminarVenta(venta.idVenta).subscribe({
      next: () => {
        this.mensajeExito = 'Venta eliminada correctamente.';
        this.cargarVentas();
      },
      error: (error) => this.mostrarError(error, 'No fue posible eliminar la venta.'),
    });
  }

  campoInvalido(nombreCampo: string): boolean {
    const campo = this.formularioVenta.get(nombreCampo);
    return !!campo && campo.invalid && (campo.touched || this.formularioEnviado);
  }

  private mostrarError(error: HttpErrorResponse, mensajePredeterminado: string): void {
    const respuesta = error.error as { error?: string; detail?: string } | null;
    this.mensajeError = respuesta?.detail || respuesta?.error || mensajePredeterminado;
    this.detectorCambios.detectChanges();
  }
}
