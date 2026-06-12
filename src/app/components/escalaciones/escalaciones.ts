import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../shared/navbar/navbar';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-escalaciones',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './escalaciones.html',
  styleUrl: './escalaciones.css'
})
export class EscalacionesComponent implements OnInit {

  // Tab activo: 'escalaciones' o 'conversaciones'
  tabActivo = 'escalaciones';

  // ESCALACIONES
  escalaciones: any[] = [];
  escalacionesFiltradas: any[] = [];
  filtroEstado    = '';
  filtroPrioridad = '';
  filtroBuscar    = '';

  // CONVERSACIONES ADMIN (HU22, HU25)
  conversaciones: any[] = [];
  conversacionesFiltradas: any[] = [];
  filtroConvEstado  = '';
  filtroConvOrigen  = '';
  filtroConvDesde   = '';
  filtroConvHasta   = '';
  filtroConvBuscar  = '';

  // Detalle conversacion seleccionada
  convSeleccionada: any = null;
  mensajesDetalle: any[] = [];
  cargandoMensajes = false;

  cargando = false;

  constructor(private http: HttpClient, public auth: AuthService) {}

  ngOnInit() { this.cargarEscalaciones(); this.cargarConversaciones(); }

  private getHeaders() {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  cargarEscalaciones() {
    this.cargando = true;
    this.http.get<any[]>(`${environment.apiUrl}/escalaciones`,
      { headers: this.getHeaders() }).subscribe({
      next: (data) => {
        this.escalaciones = data;
        this.escalacionesFiltradas = [...data];
        this.cargando = false;
      },
      error: () => { this.cargando = false; }
    });
  }

  cargarConversaciones() {
    let params = '?';
    if (this.filtroConvEstado) params += `estado=${this.filtroConvEstado}&`;
    if (this.filtroConvOrigen) params += `origen=${this.filtroConvOrigen}&`;
    if (this.filtroConvDesde)  params += `desde=${this.filtroConvDesde}&`;
    if (this.filtroConvHasta)  params += `hasta=${this.filtroConvHasta}&`;

    this.http.get<any[]>(
      `${environment.apiUrl}/chat/admin/conversaciones${params}`,
      { headers: this.getHeaders() }).subscribe({
      next: (data) => {
        this.conversaciones = data;
        this.aplicarFiltrosConv();
      },
      error: () => {}
    });
  }

  aplicarFiltrosConv() {
    const q = this.filtroConvBuscar.toLowerCase();
    this.conversacionesFiltradas = this.conversaciones.filter(c => {
      return !q || (c.clienteNombre?.toLowerCase().includes(q))
                || (c.clienteUsername?.toLowerCase().includes(q));
    });
  }

  verDetalle(conv: any) {
    this.convSeleccionada = conv;
    this.cargandoMensajes = true;
    this.mensajesDetalle = [];
    this.http.get<any[]>(
      `${environment.apiUrl}/chat/${conv.id}/mensajes`,
      { headers: this.getHeaders() }).subscribe({
      next: (msgs) => { this.mensajesDetalle = msgs; this.cargandoMensajes = false; },
      error: () => { this.cargandoMensajes = false; }
    });
  }

  cerrarDetalle() { this.convSeleccionada = null; this.mensajesDetalle = []; }

  getCanalIcon(canal: string): string {
    return canal === 'WHATSAPP' ? '📱' : '🌐';
  }

  aplicarFiltros() {
    this.escalacionesFiltradas = this.escalaciones.filter(e => {
      const okEstado    = !this.filtroEstado    || e.estado    === this.filtroEstado;
      const okPrioridad = !this.filtroPrioridad || e.prioridad === this.filtroPrioridad;
      const q = this.filtroBuscar.toLowerCase();
      const okBuscar = !q || e.clienteNombre?.toLowerCase().includes(q)
                          || e.motivo?.toLowerCase().includes(q);
      return okEstado && okPrioridad && okBuscar;
    });
  }

  countEstado(estado: string)  { return this.escalaciones.filter(e => e.estado === estado).length; }
  countPrioridad(p: string)    { return this.escalaciones.filter(e => e.prioridad === p).length; }
}