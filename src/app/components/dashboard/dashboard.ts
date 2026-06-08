import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavbarComponent } from '../shared/navbar/navbar';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  kpis: any = null;
  cargando = true;
  rangoFechas = 'Últimos 7 días';

  kpisMock = {
    totalConversaciones: 2842,
    tasaResolucion: 81,
    tiempoPromedioMs: 102000,
    satisfaccionPromedio: 4.7,
    variacionConversaciones: 18.6,
    variacionResolucion: 3.2,
    variacionTiempo: -8.7,
    variacionSatisfaccion: 5.1
  };

  intencionesData = [
    { nombre: 'Laptops',        porcentaje: 48.2, color: '#2f28a8' },
    { nombre: 'Periféricos',    porcentaje: 21.7, color: '#5b50e8' },
    { nombre: 'Compatibilidad', porcentaje: 14.6, color: '#f59e0b' },
    { nombre: 'Stock',          porcentaje:  9.8, color: '#16a34a' },
    { nombre: 'Otros',          porcentaje:  5.7, color: '#94a3b8' }
  ];

  actividadReciente = [
    { texto: 'Nueva conversación',    detalle: 'Usuario consultó sobre laptop HP',  estado: 'Completada',  color: '#16a34a' },
    { texto: 'Actualización Base RAG',detalle: 'Se subieron 24 documentos',         estado: 'Procesado',   color: '#5b50e8' },
    { texto: 'Producto agregado',     detalle: 'Logitech MX Keys S',                estado: 'Completada',  color: '#16a34a' },
    { texto: 'Escalación creada',     detalle: 'Caso asignado a soporte',           estado: 'En progreso', color: '#f59e0b' },
    { texto: 'Consulta por WhatsApp', detalle: '+51 999 000 001',                   estado: 'Completada',  color: '#16a34a' }
  ];

  estadoSistema = [
    { nombre: 'Servicio del chatbot',     estado: 'Operativo',          ok: true  },
    { nombre: 'Base RAG',                 estado: 'Operativo',          ok: true  },
    { nombre: 'Integración WhatsApp',     estado: 'Pendiente config.',  ok: false },
    { nombre: 'Azure Blob Storage',       estado: 'Pendiente config.',  ok: false }
  ];

  diasSemana = [420, 380, 510, 490, 560, 430, 470];
  maxDia = 560;

  private getHeaders() {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargando = true;
    this.http.get<any>(`${environment.apiUrl}/admin/dashboard/kpis`,
      { headers: this.getHeaders() }).subscribe({
      next:  (data) => { this.kpis = data; this.cargando = false; },
      error: ()     => { this.kpis = this.kpisMock; this.cargando = false; }
    });
  }

  formatTiempo(ms: number): string {
    if (!ms) return '--';
    const seg = Math.floor(ms / 1000);
    const min = Math.floor(seg / 60);
    const s   = seg % 60;
    return min > 0 ? `${min}:${s.toString().padStart(2, '0')}` : `${s}s`;
  }

  getVariacionClass(v: number): string { return v >= 0 ? 'var-positiva' : 'var-negativa'; }
  getVariacionIcon(v: number):  string { return v >= 0 ? '↑' : '↓'; }
}
