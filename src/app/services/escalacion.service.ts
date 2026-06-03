import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Escalacion } from '../models/escalacion.model';

@Injectable({ providedIn: 'root' })
export class EscalacionService {
  private url = `${environment.apiUrl}/escalaciones`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Escalacion[]> {
    return this.http.get<Escalacion[]>(this.url);
  }

  atender(id: number): Observable<void> {
    return this.http.put<void>(`${this.url}/${id}/atender`, {});
  }
}
