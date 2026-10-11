import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/auth/login';

  private token: string | null = localStorage.getItem('token');
  private rol: string | null = localStorage.getItem('rol');
  private correo: string | null = localStorage.getItem('usuarioLogueado');

  login(correo: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { correo, password }).pipe(
      tap(res => {
        this.token = res.token;
        this.rol = res.rol || (correo.toLowerCase().includes('admin') ? 'ADMIN' : 'USER');
        this.correo = res.correo || correo;
        localStorage.setItem('token', this.token!);
        localStorage.setItem('rol', this.rol!);
        localStorage.setItem('usuarioLogueado', this.correo!);
      })
    );
  }

  logout() {
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
