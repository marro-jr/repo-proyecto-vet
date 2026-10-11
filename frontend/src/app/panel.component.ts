import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-vh-100 bg-light d-flex flex-column">

      <nav class="navbar navbar-expand-lg bg-navbar-black px-4 py-3 shadow-sm">
        <div class="container-fluid">
          <a class="navbar-brand fw-bold d-flex align-items-center gap-2 text-white" href="javascript:void(0)">
            <span class="fs-4">🐾</span>
            <span class="fs-5 tracking-wide">PetaPet</span>
          </a>

          <div class="d-flex align-items-center gap-3 ms-auto navbar-user-info">
            <span class="text-white small fw-medium">{{ usuarioLogueado }}</span>
            <span [ngClass]="rol === 'ADMIN' ? 'role-badge-admin' : 'role-badge-user'">
              ROL: {{ rol }}
            </span>

            <button type="button" class="btn btn-outline-light btn-sm ms-2" (click)="cerrarSesion()">
              <i class="bi bi-box-arrow-right me-1"></i>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      <main class="container my-5 flex-grow-1">
        <div class="dashboard-card">
          <div class="d-flex align-items-center gap-3">
            <div class="p-3 bg-light rounded-circle fs-3">
              <i class="bi bi-person-circle text-dark"></i>
            </div>
            <div>
              <h3 class="fw-bold mb-1 text-dark">Panel Principal</h3>
              <p class="text-secondary mb-0 small">
                Sesión activa como: <strong class="text-dark">{{ usuarioLogueado }}</strong> &bull;
                Permisos asignados: <strong [ngClass]="rol === 'ADMIN' ? 'text-danger' : 'text-success'">{{ rol }}</strong>
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer class="bg-white border-top py-3 text-center text-muted small mt-auto">
        PetaPet &bull; Sistema Clínico Veterinario
      </footer>

    </div>
  `
})
export class PanelComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  get rol(): string | null {
    return this.authService.obtenerRol();
  }

  get usuarioLogueado(): string | null {
    return this.authService.obtenerCorreo();
  }

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
