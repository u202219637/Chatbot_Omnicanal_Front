import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
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

  tabActivo = 'escalaciones';
  rolUsuario = '';

  escalaciones: any[] = [];
  escalacionesFiltradas: any[] = [];
  filtroEstado    = '';
  filtroPrioridad = '';
  filtroBuscar    = '';

  conversaciones: any[] = [];
  conversacionesFiltradas: any[] = [];
  filtroConvEstado = '';
  filtroConvOrigen = '';
  filtroConvDesde  = '';
  filtroConvHasta  = '';
  filtroConvBuscar = '';

  accionando: { [id: number]: boolean } = {};
  mensajeExito = '';
  cargando = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.rolUsuario = localStorage.getItem('rol') || '';
    this.cargarEscalaciones();
    this.cargarConversaciones();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  cargarEscalaciones() {
    this.cargando = true;
    this.http.get<any[]>(`${environment.apiUrl}/escalaciones`,
      { headers: this.getHeaders() }).subscribe({
      next: (data) => { this.escalaciones = data; this.aplicarFiltros(); this.cargando = false; },
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
      next: (data) => { this.conversaciones = data; this.aplicarFiltrosConv(); },
      error: () => {}
    });
  }

  cambiarTab(tab: string) {
    this.tabActivo = tab;
    if (tab === 'conversaciones') this.limpiarFiltrosConv();
  }

  tomarYAtender(e: any) {
    if (e.estado === 'EN_ATENCION') { this.irAtencion(e); return; }
    if (this.accionando[e.id]) return;
    this.accionando[e.id] = true;

    this.http.put(`${environment.apiUrl}/escalaciones/${e.id}/iniciar`, {},
      { headers: this.getHeaders() }).subscribe({
      next: () => { this.accionando[e.id] = false; this.irAtencion(e); },
      error: () => { this.accionando[e.id] = false; }
    });
  }

  irAtencion(e: any) {
    this.router.navigate(['/atencion', e.conversacionId], {
      queryParams: {
        escalacionId: e.id,
        cliente: e.clienteNombre || 'Cliente',
        origen: 'WEB'
      }
    });
  }

  cerrarCaso(e: any) {
    if (this.accionando[e.id]) return;
    if (!confirm(`¿Cerrar el caso #${e.id} de ${e.clienteNombre}?`)) return;
    this.accionando[e.id] = true;

    this.http.put(`${environment.apiUrl}/escalaciones/${e.id}/cerrar`, {},
      { headers: this.getHeaders() }).subscribe({
      next: () => {
        this.mostrarExito('Caso cerrado correctamente.');
        this.accionando[e.id] = false;
        this.cargarEscalaciones();
      },
      error: () => { this.accionando[e.id] = false; }
    });
  }

  aplicarFiltros() {
    this.escalacionesFiltradas = this.escalaciones.filter(e => {
      const okEstado    = !this.filtroEstado    || e.estado    === this.filtroEstado;
      const okPrioridad = !this.filtroPrioridad || e.prioridad === this.filtroPrioridad;
      const q = this.filtroBuscar.toLowerCase();
      const okBuscar = !q || e.clienteNombre?.toLowerCase().includes(q)
                          || e.motivo?.toLowerCase().includes(q)
                          || String(e.id).includes(q);
      return okEstado && okPrioridad && okBuscar;
    });
  }

  aplicarFiltrosConv() {
    const q = this.filtroConvBuscar.toLowerCase();
    this.conversacionesFiltradas = this.conversaciones.filter(c =>
      !q || c.clienteNombre?.toLowerCase().includes(q)
          || c.clienteUsername?.toLowerCase().includes(q)
    );
  }

  limpiarFiltrosConv() {
    this.filtroConvEstado = '';
    this.filtroConvOrigen = '';
    this.filtroConvDesde  = '';
    this.filtroConvHasta  = '';
    this.filtroConvBuscar = '';
    this.cargarConversaciones();
  }

  mostrarExito(msg: string) {
    this.mensajeExito = msg;
    setTimeout(() => this.mensajeExito = '', 3500);
  }

  puedeAtender(e: any): boolean {
    return ['PENDIENTE', 'ASIGNADA', 'EN_ATENCION'].includes(e.estado);
  }

  puedeCerrar(e: any): boolean {
    return e.estado !== 'CERRADA' && e.estado !== 'RESUELTA';
  }

  getCanalIcon(canal: string): string {
    if (!canal) return 'WEB';
    return canal === 'WHATSAPP' ? 'WA' : 'WEB';
  }

  countEstado(estado: string) { return this.escalaciones.filter(e => e.estado === estado).length; }
  countPrioridad(p: string)   { return this.escalaciones.filter(e => e.prioridad === p).length; }
}