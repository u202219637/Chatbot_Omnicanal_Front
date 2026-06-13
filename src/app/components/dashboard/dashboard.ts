import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../shared/navbar/navbar';
import { DashboardService } from '../../services/dashboard.service';
import { KpiDTO, TokenConsumo, IntencionFrecuente } from '../../models/dashboard.model';
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
  tokens: TokenConsumo[] = [];
  documentosUsados: any[] = [];

  cargando = true;
  errorKpis = false;
  rangoFechas = 'Últimos 30 días';

  COLORES = ['#2f28a8', '#5b50e8', '#f59e0b', '#16a34a', '#94a3b8', '#ef4444'];

  estadoSistema = [
    { nombre: 'Servicio del chatbot',  estado: 'Operativo',         ok: true  },
    { nombre: 'Base RAG',              estado: 'Operativo',         ok: true  },
    { nombre: 'Integración WhatsApp',  estado: 'Pendiente config.', ok: false },
    { nombre: 'Azure Blob Storage',    estado: 'Pendiente config.', ok: false }
  ];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.cargando = true;

    forkJoin({
      kpis:       this.dashboardService.kpis(),
      intenciones: this.dashboardService.intenciones(),
      tokens:      this.dashboardService.tokens(),
      documentos:  this.dashboardService.documentosUsados()
    }).subscribe({
      next: ({ kpis, intenciones, tokens, documentos }) => {
        this.kpis             = kpis;
        this.intenciones      = intenciones.slice(0, 6);
        this.tokens           = tokens.slice(-7);
        this.documentosUsados = documentos.slice(0, 5);
        this.cargando         = false;
      },
      error: () => {
        this.kpis = {
          totalConversaciones:     0,
          conversacionesResueltas: 0,
          tiempoPromedioRespuesta: '--:--',
          tasaResolucionAutomatica: 0,
          satisfaccionPromedio:    0,
          tasaDesvioHumano:        0,
          conversacionesWeb:       0,
          conversacionesWhatsapp:  0
        };
        this.errorKpis = true;
        this.cargando  = false;
      }
    });
  }

  maxTokens(): number {
    return Math.max(...this.tokens.map(t => t.tokensTotal), 1);
  }

  colorIntencion(i: number): string {
    return this.COLORES[i % this.COLORES.length];
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

  totalTokensHoy(): number {
    if (!this.tokens.length) return 0;
    return this.tokens[this.tokens.length - 1]?.tokensTotal ?? 0;
  }
}