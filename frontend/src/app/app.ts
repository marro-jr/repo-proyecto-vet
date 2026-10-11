import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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

  vistaActual: 'citas' | 'usuarios' = 'citas';

  citasPrueba = [
    { id: 101, mascota: 'Firulais (Golden Retriever)', propietario: 'Juan Pérez', motivo: 'Vacunación y desparasitación', fecha: '2026-10-15', estado: 'CONFIRMADA' },
    { id: 102, mascota: 'Michi (Siamés)', propietario: 'María Gómez', motivo: 'Control de rutina felino', fecha: '2026-10-16', estado: 'PENDIENTE' },
    { id: 103, mascota: 'Rocky (Bulldog Francés)', propietario: 'Carlos Díaz', motivo: 'Limpieza dental preventiva', fecha: '2026-10-18', estado: 'EN ESPERA' }
  ];
  respuestaApiCitas: any = null;
  cargandoCitas = false;

  usuariosPrueba = [
    { id: 1, nombre: 'Dra. Valeria Ramos', correo: 'admin@vet.test', rol: 'ADMIN', estado: 'ACTIVO' },
    { id: 2, nombre: 'Dr. Lucas Mendoza', correo: 'empleado@vet.test', rol: 'USER', estado: 'ACTIVO' },
    { id: 3, nombre: 'Camila Torres', correo: 'asistente@vet.test', rol: 'USER', estado: 'INACTIVO' }
  ];
  respuestaApiUsuarios: any = null;
  errorApiUsuarios = '';
  cargandoUsuarios = false;

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
        this.vistaActual = 'citas';
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
    this.respuestaApiCitas = null;
    this.respuestaApiUsuarios = null;
    this.errorApiUsuarios = '';
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
  }

  cambiarVista(vista: 'citas' | 'usuarios') {
    this.vistaActual = vista;
    this.respuestaApiCitas = null;
    this.respuestaApiUsuarios = null;
    this.errorApiUsuarios = '';
  }

  probarEndpointCitas() {
    this.cargandoCitas = true;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    this.http.get<any>('http://localhost:8080/citas', { headers }).subscribe({
      next: (data) => {
        this.cargandoCitas = false;
        this.respuestaApiCitas = data;
      },
      error: (err) => {
        this.cargandoCitas = false;
        this.respuestaApiCitas = { error: `HTTP ${err.status}: ${err.statusText}` };
      }
    });
  }

  probarEndpointUsuarios() {
    this.cargandoUsuarios = true;
    this.errorApiUsuarios = '';
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    this.http.get<any>('http://localhost:8080/usuarios', { headers }).subscribe({
      next: (data) => {
        this.cargandoUsuarios = false;
        this.respuestaApiUsuarios = data;
      },
      error: (err) => {
        this.cargandoUsuarios = false;
        if (err.status === 403) {
          this.errorApiUsuarios = 'HTTP 403 Forbidden: Spring Security restringió este recurso al rol ADMIN.';
        } else {
          this.errorApiUsuarios = `Error ${err.status}: ${err.statusText}`;
        }
      }
    });
  }
}
