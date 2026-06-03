import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { KpiDTO, TokenConsumo, IntencionFrecuente } from '../models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private url = `${environment.apiUrl}/admin/dashboard`;

  constructor(private http: HttpClient) {}

  kpis(): Observable<KpiDTO>                        { return this.http.get<KpiDTO>(`${this.url}/kpis`); }
  tokens(): Observable<TokenConsumo[]>              { return this.http.get<TokenConsumo[]>(`${this.url}/tokens`); }
  intenciones(): Observable<IntencionFrecuente[]>   { return this.http.get<IntencionFrecuente[]>(`${this.url}/intenciones`); }
  documentosUsados(): Observable<any[]>             { return this.http.get<any[]>(`${this.url}/documentos-usados`); }
}
