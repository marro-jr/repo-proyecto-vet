import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Catalogo {
  id: number;
  nombre: string;
}

export interface Cita {
  idCita: number;
  idMascota: number;
  mascota: string;
  idServicio: number;
  servicio: string;
  idVeterinario: number;
  veterinario: string;
  usuarioRegistro: string;
  fechaHora: string;
  motivo: string;
  estado: 'PENDIENTE' | 'CONFIRMADA' | 'ATENDIDA' | 'CANCELADA';
  observaciones: string;
}

export interface DatosCita {
  idMascota: number;
  idServicio: number;
  idVeterinario: number;
  fechaHora: string;
  motivo: string;
  estado: 'PENDIENTE' | 'CONFIRMADA' | 'ATENDIDA' | 'CANCELADA';
  observaciones: string;
}

export interface CatalogosCita {
  mascotas: Catalogo[];
  servicios: Catalogo[];
  veterinarios: Catalogo[];
}

@Injectable({
  providedIn: 'root',
})
export class CitaService {
  private readonly apiUrl = 'http://localhost:8080/citas';

  constructor(private http: HttpClient) {}

  listarCitas(): Observable<Cita[]> {
    return this.http.get<Cita[]>(this.apiUrl);
  }

  obtenerCatalogos(): Observable<CatalogosCita> {
    return this.http.get<CatalogosCita>(`${this.apiUrl}/catalogos`);
  }

  registrarCita(cita: DatosCita): Observable<Cita> {
    return this.http.post<Cita>(this.apiUrl, cita);
  }

  actualizarCita(id: number, cita: DatosCita): Observable<Cita> {
    return this.http.put<Cita>(`${this.apiUrl}/${id}`, cita);
  }

  eliminarCita(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
