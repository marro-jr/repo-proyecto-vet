import { Component, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-wrapper">
      <div class="container-fluid p-0">
        <div class="row g-0 login-card-container">

          <div class="col-lg-6 form-column">
            <div class="mx-auto w-100" style="max-width: 440px;">

              <div class="mb-4">
                <span class="brand-badge mb-3">
                  <i class="bi bi-heart-pulse-fill text-teal"></i>
                  Portal Clínico Veterinario
                </span>
                <h2 class="fw-bold text-dark mt-2 mb-1">Bienvenido a PetaPet</h2>
                <p class="text-secondary small">Ingresa tus credenciales para acceder a la plataforma clínica</p>
              </div>

              <div *ngIf="errorMensaje" class="alert alert-danger py-2 px-3 small rounded-3 d-flex align-items-center gap-2 mb-3" role="alert">
                <i class="bi bi-exclamation-triangle-fill"></i>
                <div>{{ errorMensaje }}</div>
              </div>

              <form (submit)="$event.preventDefault(); iniciarSesion()" autocomplete="off">
                <div class="mb-3">
                  <label for="correo" class="form-label fw-semibold small text-secondary">Correo Institucional</label>
                  <div class="input-group-custom">
                    <i class="bi bi-envelope input-icon-left"></i>
                    <input
                      type="email"
                      class="form-control input-with-icon"
                      id="correo"
                      name="correo"
                      [(ngModel)]="correo"
                      placeholder="ejemplo@petapet.test"
                      autocomplete="off"
                      (keydown.enter)="$event.preventDefault(); iniciarSesion()"
                      required
                    />
                  </div>
                </div>

                <div class="mb-4">
                  <label for="password" class="form-label fw-semibold small text-secondary">Contraseña</label>
                  <div class="input-group-custom">
                    <i class="bi bi-key input-icon-left"></i>
                    <input
                      [type]="mostrarPassword ? 'text' : 'password'"
                      class="form-control input-with-icon"
                      id="password"
                      name="password"
                      [(ngModel)]="password"
                      placeholder="Ingresa tu contraseña"
                      autocomplete="new-password"
                      (keydown.enter)="$event.preventDefault(); iniciarSesion()"
                      required
                    />
                    <button
                      type="button"
                      class="btn-toggle-eye"
                      (click)="alternarMostrarPassword()"
                      [attr.aria-label]="mostrarPassword ? 'Ocultar contraseña' : 'Ver contraseña'"
                    >
                      <i class="bi" [ngClass]="mostrarPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'"></i>
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  (click)="iniciarSesion()"
                  class="btn btn-primary-custom w-100 d-flex align-items-center justify-content-center gap-2"
                  [disabled]="cargando"
                >
                  <span *ngIf="cargando" class="spinner-border spinner-border-sm" role="status"></span>
                  <span>{{ cargando ? 'Iniciando sesión...' : 'Iniciar Sesión' }}</span>
                  <i *ngIf="!cargando" class="bi bi-arrow-right"></i>
                </button>
              </form>

            </div>
          </div>

          <div class="col-lg-6 hero-column d-none d-lg-flex">
            <div class="d-flex align-items-center gap-2">
              <span class="fs-4">🐾</span>
              <span class="fw-bold fs-5 tracking-wide">PetaPet</span>
            </div>

            <div class="my-auto py-5" style="max-width: 480px;">
              <h1 class="display-6 fw-bold mb-3 text-white">
                Cuidamos con amor a quienes alegran tu vida.
              </h1>
              <p class="text-white-50 lead fs-6 mb-4">
                Gestión clínica, control de citas veterinarias y administración de usuarios con la más alta seguridad y calidez humana.
              </p>

              <div class="row g-3">
                <div class="col-6">
                  <div class="feature-pill">
                    <div class="d-flex align-items-center gap-2 text-warning mb-1">
                      <i class="bi bi-star-fill"></i>
                      <span class="fw-bold small text-white">Atención 24/7</span>
                    </div>
                    <small class="text-white-50">Cuidado médico continuo</small>
                  </div>
                </div>
                <div class="col-6">
                  <div class="feature-pill">
                    <div class="d-flex align-items-center gap-2 text-warning mb-1">
                      <i class="bi bi-patch-check-fill"></i>
                      <span class="fw-bold small text-white">100% Certificado</span>
                    </div>
                    <small class="text-white-50">Especialistas clínicos</small>
                  </div>
                </div>
              </div>
            </div>

            <div class="text-white-50 small">
              &copy; 2026 PetaPet &bull; Todos los derechos reservados.
            </div>
          </div>

        </div>
      </div>
    </div>
  `
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  correo = '';
  password = '';
  mostrarPassword = false;

  cargando = false;
  errorMensaje = '';

  ngOnInit() {
    if (this.authService.estaAutenticado()) {
      this.router.navigate(['/panel']);
    }
  }

  alternarMostrarPassword() {
    this.mostrarPassword = !this.mostrarPassword;
    this.cdr.detectChanges();
  }

  iniciarSesion() {
    if (!this.correo || !this.password) {
      this.errorMensaje = 'Por favor completa todos los campos requeridos.';
      this.cdr.detectChanges();
      return;
    }

    this.cargando = true;
    this.errorMensaje = '';
    this.cdr.detectChanges();

    this.authService.login(this.correo.trim(), this.password).subscribe({
      next: () => {
        this.cargando = false;
        this.cdr.detectChanges();
        this.router.navigate(['/panel']);
      },
      error: (err) => {
        this.cargando = false;
        if (err.status === 401) {
          this.errorMensaje = 'Credenciales no válidas. Revisa el correo y contraseña.';
        } else if (err.status === 0) {
          this.errorMensaje = 'No fue posible conectar con el servidor backend en http://localhost:8080.';
        } else {
          this.errorMensaje = err.error?.error || 'No fue posible iniciar sesión en este momento.';
        }
        this.cdr.detectChanges();
      }
    });
  }
}
