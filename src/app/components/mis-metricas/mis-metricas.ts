import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavbarComponent } from '../shared/navbar/navbar';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-mis-metricas',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './mis-metricas.html',
  styleUrl: './mis-metricas.css'
})
export class MisMetricasComponent implements OnInit {

  cargando = true;
  error = '';

  promedioPropio = 0;
  totalCasosCalificados = 0;
  distribucion: { estrellas: number; total: number }[] = [];
  comentariosRecientes: any[] = [];

  maxDistribucion = 1;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargar();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  cargar() {
    this.cargando = true;
    this.error = '';
    this.http.get<any>(`${environment.apiUrl}/asesor/dashboard/satisfaccion`,
      { headers: this.getHeaders() }
    ).subscribe({
      next: (data) => {
        this.promedioPropio = data.promedioPropio || 0;
        this.totalCasosCalificados = data.totalCasosCalificados || 0;
        this.distribucion = this.normalizarDistribucion(data.distribucion || []);
        this.comentariosRecientes = data.comentariosRecientes || [];
        this.maxDistribucion = Math.max(1, ...this.distribucion.map(d => d.total));
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar tus métricas.';
        this.cargando = false;
      }
    });
  }

  // Asegura que siempre se muestren las 5 barras (1 a 5), aunque no tengan datos
  private normalizarDistribucion(data: { estrellas: number; total: number }[]) {
    const mapa = new Map(data.map(d => [d.estrellas, d.total]));
    const resultado = [];
    for (let i = 1; i <= 5; i++) {
      resultado.push({ estrellas: i, total: mapa.get(i) || 0 });
    }
    return resultado;
  }

  estrellasArray(n: number): number[] {
    return Array(Math.round(n)).fill(0);
  }

  motivoLabel(motivo: string): string {
    const map: { [key: string]: string } = {
      'RESPUESTA_INCORRECTA': 'Respuesta incorrecta',
      'TARDO_DEMASIADO': 'Tardó demasiado',
      'BUENA_ATENCION': 'Buena atención',
      'OTRO': 'Otro'
    };
    return map[motivo] || motivo || '';
  }
}