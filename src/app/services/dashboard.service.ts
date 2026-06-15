import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { KpiDTO, TokenConsumo, IntencionFrecuente } from '../models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private url = `${environment.apiUrl}/admin/dashboard`;

  constructor(private http: HttpClient) {}

  private headers(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token') || '';
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  kpis(): Observable<KpiDTO>                      { return this.http.get<KpiDTO>(`${this.url}/kpis`, this.headers()); }
  tokens(): Observable<TokenConsumo[]>            { return this.http.get<TokenConsumo[]>(`${this.url}/tokens`, this.headers()); }
  intenciones(): Observable<IntencionFrecuente[]> { return this.http.get<IntencionFrecuente[]>(`${this.url}/intenciones`, this.headers()); }
  documentosUsados(): Observable<any[]>           { return this.http.get<any[]>(`${this.url}/documentos-usados`, this.headers()); }
  convsPorDia(): Observable<any[]>                { return this.http.get<any[]>(`${this.url}/conversaciones-por-dia`, this.headers()); }
}