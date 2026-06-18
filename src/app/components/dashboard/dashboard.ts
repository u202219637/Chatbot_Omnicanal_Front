import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../shared/navbar/navbar';
import { DashboardService } from '../../services/dashboard.service';
import { KpiDTO, IntencionFrecuente } from '../../models/dashboard.model';
import { environment } from '../../../environments/environment';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {

  kpis: KpiDTO | null = null;
  intenciones: IntencionFrecuente[] = [];
  convsDia: any[] = [];
  documentosUsados: any[] = [];
  comentariosRecientes: any[] = [];
  palabrasFrecuentes: any[] = [];
  maxPalabra = 1;

  cargando = true;
  errorKpis = false;
  rangoFechas = 'Últimos 30 días';

  COLORES = ['#2f28a8', '#5b50e8', '#f59e0b', '#16a34a', '#94a3b8', '#ef4444'];

  estadoSistema = [
    { nombre: 'Servicio del chatbot',  estado: 'Operativo',         ok: true  },
    { nombre: 'Base RAG',              estado: 'Operativo',         ok: true  },
    { nombre: 'Integración WhatsApp',  estado: 'Operativo',         ok: true },
    { nombre: 'Azure Blob Storage',    estado: 'Operativo',         ok: true }
  ];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.cargando = true;

    forkJoin({
      kpis:        this.dashboardService.kpis(),
      intenciones: this.dashboardService.intenciones(),
      convsDia:    this.dashboardService.convsPorDia(),
      documentos:  this.dashboardService.documentosUsados(),
      comentarios: this.dashboardService.comentarios(),
      palabras:    this.dashboardService.palabrasFrecuentes()
    }).subscribe({
      next: ({ kpis, intenciones, convsDia, documentos, comentarios, palabras }) => {
        this.kpis                  = kpis;
        this.intenciones           = intenciones.slice(0, 6);
        this.convsDia              = convsDia.slice(-30);
        this.documentosUsados      = documentos.slice(0, 5);
        this.comentariosRecientes  = comentarios;
        this.palabrasFrecuentes    = palabras;
        this.maxPalabra            = Math.max(1, ...palabras.map((p: any) => p.total));
        this.cargando              = false;
      },
      error: () => {
        this.kpis = {
          totalConversaciones: 0, conversacionesResueltas: 0,
          tiempoPromedioRespuesta: '--:--', tasaResolucionAutomatica: 0,
          satisfaccionPromedio: 0, tasaDesvioHumano: 0,
          conversacionesWeb: 0, conversacionesWhatsapp: 0
        };
        this.errorKpis = true;
        this.cargando  = false;
      }
    });
  }

  maxConvs(): number {
    return Math.max(...this.convsDia.map(d => d.total), 1);
  }

  colorIntencion(i: number): string {
    return this.COLORES[i % this.COLORES.length];
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

  estrellasArray(n: number): number[] {
      return Array(Math.round(n || 0)).fill(0);
    }

  pieGradient(): string {
    if (!this.intenciones.length) return 'conic-gradient(#e2e8f0 0% 100%)';
    let acum = 0;
    const partes = this.intenciones.map((item, i) => {
      const desde = acum;
      acum += item.porcentaje;
      return `${this.colorIntencion(i)} ${desde.toFixed(1)}% ${acum.toFixed(1)}%`;
    });
    return `conic-gradient(${partes.join(', ')})`;
  }
}