import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  correo = '';
  password = '';
  mostrarPassword = false;

  cargando = false;
  errorMensaje = '';

  get token(): string | null {
    return this.authService.obtenerToken();
  }

  get rol(): string | null {
    return this.authService.obtenerRol();
  }

  get usuarioLogueado(): string | null {
    return this.authService.obtenerCorreo();
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

  cerrarSesion() {
    this.authService.logout();
    this.correo = '';
    this.password = '';
    this.errorMensaje = '';
    this.cdr.detectChanges();
  }
}
