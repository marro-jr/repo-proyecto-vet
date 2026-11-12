import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Catalogo } from './cita.service';

export interface Venta {
  idVenta: number;
  usuario: string;
  idPropietario: number | null;
  propietario: string;
  fechaVenta: string;
  total: number;
  estado: 'REGISTRADA' | 'ANULADA';
}

export interface DatosVenta {
  idPropietario: number | null;
  total: number;
  estado: 'REGISTRADA' | 'ANULADA';
}

export interface CatalogosVenta {
  propietarios: Catalogo[];
}

@Injectable({
  providedIn: 'root',
})
export class VentaService {
  private readonly apiUrl = 'http://localhost:8080/ventas';

  constructor(private http: HttpClient) {}

  listarVentas(): Observable<Venta[]> {
    return this.http.get<Venta[]>(this.apiUrl);
  }

  obtenerCatalogos(): Observable<CatalogosVenta> {
    return this.http.get<CatalogosVenta>(`${this.apiUrl}/catalogos`);
  }

  registrarVenta(venta: DatosVenta): Observable<Venta> {
    return this.http.post<Venta>(this.apiUrl, venta);
  }

  actualizarVenta(id: number, venta: DatosVenta): Observable<Venta> {
    return this.http.put<Venta>(`${this.apiUrl}/${id}`, venta);
  }

  eliminarVenta(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
