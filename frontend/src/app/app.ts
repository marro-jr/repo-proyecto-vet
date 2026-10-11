import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private http = inject(HttpClient);

  correo = '';
  password = '';
  mostrarPassword = false;

  cargando = false;
  errorMensaje = '';
  token = '';
  rol = '';
  usuarioLogueado = '';

  alternarMostrarPassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  iniciarSesion() {
    if (!this.correo || !this.password) {
      this.errorMensaje = 'Por favor completa todos los campos requeridos.';
      return;
    }

    this.cargando = true;
    this.errorMensaje = '';

    const payload = {
      correo: this.correo,
      password: this.password
    };

    this.http.post<any>('http://localhost:8080/auth/login', payload).subscribe({
      next: (res) => {
        this.cargando = false;
        this.token = res.token;
        this.rol = res.rol || (this.correo.includes('admin') ? 'ADMIN' : 'USER');
        this.usuarioLogueado = res.correo || this.correo;
        localStorage.setItem('token', this.token);
        localStorage.setItem('rol', this.rol);
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
      }
    });
  }

  cerrarSesion() {
    this.token = '';
    this.rol = '';
    this.usuarioLogueado = '';
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
  }
}
