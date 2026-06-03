import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ProductoList, ProductoDetalle } from '../models/producto.model';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private url = `${environment.apiUrl}/productos`;

  constructor(private http: HttpClient) {}

  listar(categoriaId?: number, marcaId?: number, q?: string): Observable<ProductoList[]> {
    let params = new HttpParams();
    if (categoriaId) params = params.set('categoriaId', categoriaId);
    if (marcaId)     params = params.set('marcaId', marcaId);
    if (q)           params = params.set('q', q);
    return this.http.get<ProductoList[]>(this.url, { params });
  }

  detalle(id: number): Observable<ProductoDetalle> {
    return this.http.get<ProductoDetalle>(`${this.url}/${id}`);
  }
}
