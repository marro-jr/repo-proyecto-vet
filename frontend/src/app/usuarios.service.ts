import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Usuario {
  idUsuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  estado: 'ACTIVO' | 'INACTIVO';
  fechaCreacion: string;
  idRol: number;
  nombreRol: string;
}

export interface Rol {
  idRol: number;
  nombre: string;
}

export interface UsuarioDatos {
  nombre: string;
  apellido: string;
  correo: string;
  password: string;
  estado: 'ACTIVO' | 'INACTIVO';
  idRol: number;
}

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/usuarios';

  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  listarRoles(): Observable<Rol[]> {
    return this.http.get<Rol[]>(`${this.apiUrl}/roles`);
  }

  registrar(usuario: UsuarioDatos): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }

  actualizar(id: number, usuario: UsuarioDatos): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, usuario);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
