import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { MensajeRequest, MensajeResponse, ConversacionList, FeedbackDTO } from '../models/conversacion.model';

@Injectable({ providedIn: 'root' })
export class ConversacionService {
  private url = `${environment.apiUrl}/chat`;

  constructor(private http: HttpClient) {}

  enviarMensaje(req: MensajeRequest): Observable<MensajeResponse> {
    return this.http.post<MensajeResponse>(`${this.url}/mensaje`, req);
  }

  historial(): Observable<ConversacionList[]> {
    return this.http.get<ConversacionList[]>(`${this.url}/historial`);
  }

  mensajes(conversacionId: number): Observable<MensajeResponse[]> {
    return this.http.get<MensajeResponse[]>(`${this.url}/${conversacionId}/mensajes`);
  }

  calificar(conversacionId: number, fb: FeedbackDTO): Observable<void> {
    return this.http.post<void>(`${this.url}/${conversacionId}/feedback`, fb);
  }

  cerrar(conversacionId: number): Observable<void> {
    return this.http.put<void>(`${this.url}/${conversacionId}/cerrar`, {});
  }
}
