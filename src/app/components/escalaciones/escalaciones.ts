import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../shared/navbar/navbar';
import { environment } from '../../../environments/environment';
import { LinebreakPipe } from '../shared/linebreak.pipe';

@Component({
  selector: 'app-escalaciones',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, LinebreakPipe],
  templateUrl: './escalaciones.html',
  styleUrl: './escalaciones.css'
})
export class EscalacionesComponent implements OnInit, OnDestroy {

  tabActivo = 'escalaciones';
  rolUsuario = '';

  // ESCALACIONES
  escalaciones: any[] = [];
  escalacionesFiltradas: any[] = [];
  filtroEstado    = '';
  filtroPrioridad = '';
  filtroBuscar    = '';

  // CONVERSACIONES OMNICANAL
  conversaciones: any[] = [];
  conversacionesFiltradas: any[] = [];
  filtroConvEstado = '';
  filtroConvOrigen = '';
  filtroConvDesde  = '';
  filtroConvHasta  = '';
  filtroConvBuscar = '';

  // Panel Meta
  convSeleccionada: any = null;
  prioridadConvSeleccionada = 'MEDIA';
  mensajesConv: any[] = [];
  inputRespuesta = '';
  enviandoMsg = false;
  cargandoMensajes = false;
  private pollingConv: any = null;
  private lastMsgCount = 0;

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
    this.iniciarPollingLista();
  }

  ngOnDestroy() {
    this.detenerPollingConv();
    this.detenerPollingLista();
  }

  // FIX: la lista de escalaciones solo se cargaba una vez al entrar a la
  // página. Un asesor con el panel abierto no se enteraba de un cliente
  // nuevo escalado (por WhatsApp o web) hasta recargar manualmente. Esto
  // refresca la lista cada 8s, igual que ya se hace con los mensajes de
  // una conversación abierta (iniciarPollingConv).
  private pollingLista: any = null;

  iniciarPollingLista() {
    this.pollingLista = setInterval(() => {
      this.cargarEscalaciones(false);
    }, 8000);
  }

  detenerPollingLista() {
    if (this.pollingLista) { clearInterval(this.pollingLista); this.pollingLista = null; }
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // ── ESCALACIONES ──────────────────────────────────────────────────────────
  cargarEscalaciones(mostrarSpinner: boolean = true) {
    if (mostrarSpinner) this.cargando = true;
    this.http.get<any[]>(`${environment.apiUrl}/escalaciones`,
      { headers: this.getHeaders() }).subscribe({
      next: (data) => { this.escalaciones = data; this.aplicarFiltros(); this.cargando = false; },
      error: () => { this.cargando = false; }
    });
  }

cambiarTab(tab: string) {
    this.tabActivo = tab;
    if (tab === 'conversaciones') {
      setTimeout(() => this.limpiarFiltrosConv(), 0);
    }
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
      queryParams: { escalacionId: e.id, cliente: e.clienteNombre || 'Cliente', origen: 'WEB' }
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

  // ── CONVERSACIONES OMNICANAL (panel Meta) ─────────────────────────────────
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

  seleccionarConv(conv: any) {
    this.detenerPollingConv();
    this.convSeleccionada = conv;
    this.mensajesConv = [];
    this.inputRespuesta = '';
    this.cargandoMensajes = true;
    // Cargar prioridad desde escalaciones
    const esc = this.escalaciones.find(e => e.conversacionId === conv.id);
    this.prioridadConvSeleccionada = esc?.prioridad || 'MEDIA';
    this.http.get<any[]>(
      `${environment.apiUrl}/chat/${conv.id}/mensajes`,
      { headers: this.getHeaders() }
    ).subscribe({
      next: (msgs) => {
        this.mensajesConv = msgs;
        this.lastMsgCount = msgs.length;
        this.cargandoMensajes = false;
        this.iniciarPollingConv(conv.id);
      },
      error: () => { this.cargandoMensajes = false; }
    });
  }

  iniciarPollingConv(convId: number) {
    this.pollingConv = setInterval(() => {
      this.http.get<any[]>(
        `${environment.apiUrl}/chat/${convId}/mensajes`,
        { headers: this.getHeaders() }
      ).subscribe({
        next: (msgs) => {
          if (msgs.length > this.lastMsgCount) {
            this.mensajesConv = msgs;
            this.lastMsgCount = msgs.length;
          }
        }
      });
    }, 5000);
  }

  detenerPollingConv() {
    if (this.pollingConv) { clearInterval(this.pollingConv); this.pollingConv = null; }
  }

  enviarMensajeConv() {
    const texto = this.inputRespuesta.trim();
    if (!texto || this.enviandoMsg || !this.convSeleccionada) return;
    this.enviandoMsg = true;
    this.inputRespuesta = '';
    this.http.post<any>(
      `${environment.apiUrl}/chat/${this.convSeleccionada.id}/mensaje-asesor`,
      { contenido: texto, origen: 'WEB' },
      { headers: this.getHeaders() }
    ).subscribe({
      next: () => {
        this.mensajesConv.push({
          tipoEmisor: 'ASESOR', contenido: texto,
          canalNombre: 'WEB', fechaEnvio: new Date().toISOString()
        });
        this.lastMsgCount++;
        this.enviandoMsg = false;
      },
      error: (err) => { 
        console.error('ERROR:', err.status, err.error); 
        this.enviandoMsg = false; 
      }
    });
  }

handleEnterConv(event: Event) {
  const ke = event as KeyboardEvent;
  if (ke.key === 'Enter' && !ke.shiftKey) {
    event.preventDefault();
    this.enviarMensajeConv();
  }
}

  resolverConv() {
    if (!this.convSeleccionada) return;
    const esc = this.escalaciones.find(e => e.conversacionId === this.convSeleccionada.id);
    if (!esc) return;
    this.http.put(`${environment.apiUrl}/escalaciones/${esc.id}/resolver`, {},
      { headers: this.getHeaders() }).subscribe({
      next: () => {
        this.convSeleccionada.estado = 'CERRADA';
        this.mostrarExito('Caso resuelto correctamente.');
        this.cargarConversaciones();
        this.cargarEscalaciones();
      }
    });
  }

  cerrarConv() {
    if (!this.convSeleccionada) return;
    if (!confirm('¿Cerrar esta conversación?')) return;
    const esc = this.escalaciones.find(e => e.conversacionId === this.convSeleccionada.id);
    if (esc) {
      this.http.put(`${environment.apiUrl}/escalaciones/${esc.id}/cerrar`, {},
        { headers: this.getHeaders() }).subscribe({
        next: () => {
          this.convSeleccionada.estado = 'CERRADA';
          this.mostrarExito('Conversación cerrada.');
          this.cargarConversaciones();
          this.cargarEscalaciones();
        }
      });
    } else {
      this.http.put(`${environment.apiUrl}/chat/${this.convSeleccionada.id}/cerrar`, {},
        { headers: this.getHeaders() }).subscribe({
        next: () => {
          this.convSeleccionada.estado = 'CERRADA';
          this.mostrarExito('Conversación cerrada.');
          this.cargarConversaciones();
        }
      });
    }
  }

  cambiarPrioridadConv(event: Event) {
    const prioridad = (event.target as HTMLSelectElement).value;
    this.prioridadConvSeleccionada = prioridad;
    const esc = this.escalaciones.find(e => e.conversacionId === this.convSeleccionada?.id);
    if (!esc) return;
    this.http.put(`${environment.apiUrl}/escalaciones/${esc.id}/prioridad`,
      { prioridad },
      { headers: this.getHeaders() }
    ).subscribe({
      next: () => { esc.prioridad = prioridad; }
    });
  }

  getCanalIcon(canal: string): string {
    return canal === 'WHATSAPP' ? '📱' : '🌐';
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

  countEstado(estado: string) { return this.escalaciones.filter(e => e.estado === estado).length; }
  countPrioridad(p: string)   { return this.escalaciones.filter(e => e.prioridad === p).length; }
}