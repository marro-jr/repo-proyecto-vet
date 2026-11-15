import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ResumenReporte {
  usuarios: number;
  servicios: number;
  propietarios: number;
  mascotas: number;
  citas: number;
  ventas: number;
  totalVentas: number;
}

@Injectable({
  providedIn: 'root',
})
export class ReporteService {
  private readonly apiUrl = 'http://localhost:8080/reportes/resumen';

  constructor(private http: HttpClient) {}

  obtenerResumen(): Observable<ResumenReporte> {
    return this.http.get<ResumenReporte>(this.apiUrl);
  }
}
