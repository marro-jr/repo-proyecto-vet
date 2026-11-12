import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReporteService, ResumenReporte } from './reporte.service';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './reportes.component.html',
})
export class ReportesComponent implements OnInit {
  private reporteService = inject(ReporteService);
  private detectorCambios = inject(ChangeDetectorRef);

  resumen: ResumenReporte | null = null;
  estaCargando = false;
  mensajeError = '';

  ngOnInit(): void {
    this.cargarResumen();
  }

  cargarResumen(): void {
    this.estaCargando = true;
    this.mensajeError = '';
    this.detectorCambios.detectChanges();

    this.reporteService.obtenerResumen().subscribe({
      next: (resumen) => {
        this.resumen = resumen;
        this.estaCargando = false;
        this.detectorCambios.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        const respuesta = error.error as { error?: string; detail?: string } | null;
        this.mensajeError =
          respuesta?.detail || respuesta?.error || 'No fue posible cargar el reporte.';
        this.estaCargando = false;
        this.detectorCambios.detectChanges();
      },
    });
  }
}
