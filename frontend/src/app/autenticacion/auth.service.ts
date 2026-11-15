import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface RespuestaLogin {
  token: string;
  tokenType: string;
  rol: string;
  correo: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/auth/login';

  private token: string | null = localStorage.getItem('token');
  private rol: string | null = localStorage.getItem('rol');
  private correo: string | null = localStorage.getItem('usuarioLogueado');

  iniciarSesion(correo: string, password: string): Observable<RespuestaLogin> {
    return this.http.post<RespuestaLogin>(this.apiUrl, { correo, password }).pipe(
      tap((respuesta) => {
        this.token = respuesta.token;
        this.rol = respuesta.rol;
        this.correo = respuesta.correo;
        localStorage.setItem('token', respuesta.token);
        localStorage.setItem('rol', respuesta.rol);
        localStorage.setItem('usuarioLogueado', respuesta.correo);
      }),
    );
  }

  cerrarSesion(): void {
    this.token = null;
    this.rol = null;
    this.correo = null;
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('usuarioLogueado');
  }

  estaAutenticado(): boolean {
    return !!this.token;
  }

  obtenerToken(): string | null {
    return this.token;
  }

  obtenerRol(): string | null {
    return this.rol;
  }

  obtenerCorreo(): string | null {
    return this.correo;
  }
}
