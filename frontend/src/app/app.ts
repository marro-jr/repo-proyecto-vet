import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
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
export class App implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  correo = '';
  password = '';
  mostrarPassword = false;

  cargando = false;
  errorMensaje = '';
  token = '';
  rol = '';
  usuarioLogueado = '';

  ngOnInit() {
    const tokenGuardado = localStorage.getItem('token');
    const rolGuardado = localStorage.getItem('rol');
    const correoGuardado = localStorage.getItem('usuarioLogueado');
    if (tokenGuardado) {
      this.token = tokenGuardado;
      this.rol = rolGuardado || 'USER';
      this.usuarioLogueado = correoGuardado || '';
      this.cdr.detectChanges();
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

    const payload = {
      correo: this.correo.trim(),
      password: this.password
    };

    this.http.post<any>('http://localhost:8080/auth/login', payload).subscribe({
      next: (res) => {
        this.cargando = false;
        this.token = res.token;
        this.rol = res.rol || (this.correo.toLowerCase().includes('admin') ? 'ADMIN' : 'USER');
        this.usuarioLogueado = res.correo || this.correo.trim();
        localStorage.setItem('token', this.token);
        localStorage.setItem('rol', this.rol);
        localStorage.setItem('usuarioLogueado', this.usuarioLogueado);
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
    this.token = '';
    this.rol = '';
    this.usuarioLogueado = '';
    this.correo = '';
    this.password = '';
    this.errorMensaje = '';
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('usuarioLogueado');
    this.cdr.detectChanges();
  }
}
