import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-vh-100 bg-light d-flex flex-column">
      <nav class="navbar navbar-expand-lg bg-navbar-black px-4 py-3 shadow-sm">
        <div class="container-fluid">
          <a class="navbar-brand fw-bold text-white" routerLink="/panel">PetaPet</a>

          <div class="d-flex align-items-center gap-3 ms-auto navbar-user-info">
            <span class="text-white small fw-medium">{{ correoUsuario }}</span>
            <span class="badge" [ngClass]="esAdministrador ? 'bg-danger' : 'bg-primary'">
              ROL: {{ rol }}
            </span>
            <button type="button" class="btn btn-outline-light btn-sm" (click)="cerrarSesion()">
              <i class="bi bi-box-arrow-right me-1"></i>
              Cerrar sesión
            </button>
          </div>
        </div>
      </nav>

      <main class="container my-5 flex-grow-1">
        <div class="mb-4">
          <h1 class="h3 fw-bold mb-1">Panel principal</h1>
          <p class="text-secondary mb-0">
            Bienvenido, {{ correoUsuario }}. Selecciona una opción para continuar.
          </p>
        </div>

        <div class="row g-4">
          <div class="col-md-6">
            <section class="dashboard-card h-100">
              <div class="fs-1 text-primary mb-3">
                <i class="bi bi-card-checklist"></i>
              </div>
              <h2 class="h5 fw-bold">Gestión de servicios</h2>
              <p class="text-secondary">
                Consulta, registra, modifica y elimina los servicios veterinarios.
              </p>
              <a class="btn btn-primary" routerLink="/servicios"> Ir a servicios </a>
            </section>
          </div>

          <div class="col-md-6">
            <section class="dashboard-card h-100">
              <div class="fs-1 text-info mb-3">
                <i class="bi bi-calendar-check"></i>
              </div>
              <h2 class="h5 fw-bold">Gestión de citas</h2>
              <p class="text-secondary">Registra y administra las citas veterinarias.</p>
              <a class="btn btn-info text-white" routerLink="/citas"> Ir a citas </a>
            </section>
          </div>

          <div class="col-md-6">
            <section class="dashboard-card h-100">
              <div class="fs-1 text-warning mb-3">
                <i class="bi bi-receipt"></i>
              </div>
              <h2 class="h5 fw-bold">Gestión de ventas</h2>
              <p class="text-secondary">Registra y consulta las ventas realizadas.</p>
              <a class="btn btn-warning" routerLink="/ventas"> Ir a ventas </a>
            </section>
          </div>

          <div *ngIf="esAdministrador" class="col-md-6">
            <section class="dashboard-card h-100">
              <div class="fs-1 text-success mb-3">
                <i class="bi bi-people-fill"></i>
              </div>
              <h2 class="h5 fw-bold">Gestión de usuarios</h2>
              <p class="text-secondary">Administra las cuentas, roles y estados de los usuarios.</p>
              <a class="btn btn-success" routerLink="/usuarios"> Ir a usuarios </a>
            </section>
          </div>

          <div *ngIf="esAdministrador" class="col-md-6">
            <section class="dashboard-card h-100">
              <div class="fs-1 text-danger mb-3">
                <i class="bi bi-bar-chart-fill"></i>
              </div>
              <h2 class="h5 fw-bold">Reportes</h2>
              <p class="text-secondary">Consulta el resumen general del sistema.</p>
              <a class="btn btn-danger" routerLink="/reportes"> Ir a reportes </a>
            </section>
          </div>
        </div>
      </main>

      <footer class="bg-white border-top py-3 text-center text-muted small">
        PetaPet &bull; Sistema Veterinario
      </footer>
    </div>
  `,
})
export class PanelComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  get rol(): string | null {
    return this.authService.obtenerRol();
  }

  get correoUsuario(): string | null {
    return this.authService.obtenerCorreo();
  }

  get esAdministrador(): boolean {
    return this.rol === 'ADMIN';
  }

  cerrarSesion(): void {
    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
  }
}
