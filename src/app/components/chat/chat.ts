import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../shared/navbar/navbar';
import { environment } from '../../../environments/environment';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({ name: 'linebreak', standalone: true })
export class LinebreakPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(value: string): SafeHtml {
    const escaped = value
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
    return this.sanitizer.bypassSecurityTrustHtml(escaped);
  }
}

interface Mensaje {
  tipo: 'bot' | 'you';
  texto: string;
  fuentes?: any[];
  escalada?: boolean;
  tipoEmisor?: string;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, LinebreakPipe],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('chatBox') chatBox!: ElementRef;

  mensajes: Mensaje[] = [];
  inputText   = '';
  loading     = false;
  escalando   = false;
  yaEscalado  = false;
  modoLectura = false;
  convIdActual: number | null = null;

  private pollingInterval: any = null;
  private lastMensajesCount = 0;

  preguntas = [
    { label: '¿Qué laptop me recomiendas para trabajo y estudio?', texto: '¿Qué laptop me recomiendas para trabajo y estudio con buen rendimiento?' },
    { label: 'Tengo presupuesto de S/ 3,500',                      texto: 'Tengo un presupuesto de S/ 3,500. ¿Qué opciones tienes?' },
    { label: '¿Cuál es la mejor laptop gaming?',                   texto: '¿Cuál es la mejor laptop gaming que tienen?' },
    { label: '¿Cuál es la política de garantía?',                  texto: '¿Cuál es la política de garantía de los productos ShadowByte?' },
    { label: 'Ver stock disponible',                               texto: '¿Qué productos tienen en stock ahorita?' },
  ];

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    public auth: AuthService
  ) {}

  ngOnInit() {
    const convId = this.route.snapshot.queryParams['id'];
    const estado  = this.route.snapshot.queryParams['estado'];
    if (convId) {
      this.cargarHistorial(Number(convId), estado);
      return;
    }

    const raw = sessionStorage.getItem('chatContexto');
    if (raw) {
      sessionStorage.removeItem('chatContexto');
      const ctx = JSON.parse(raw);
      this.mensajesBienvenida();
      setTimeout(() => { this.inputText = ctx.mensajeInicial; this.enviar(); }, 400);
      return;
    }

    this.mensajesBienvenida();
  }

  ngOnDestroy() { this.detenerPolling(); }

  ngAfterViewChecked() {
    if (this.chatBox?.nativeElement) {
      const el = this.chatBox.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }

  mensajesBienvenida() {
    this.mensajes = [{
      tipo: 'bot',
      texto: 'Hola, soy Shadow IA, tu asistente de ShadowByte.\n¿Buscas una laptop, periférico o accesorio? Cuéntame tu presupuesto y necesidades.\n\nSi prefieres hablar con un asesor, usa el botón del panel izquierdo.'
    }];
  }

  cargarHistorial(convId: number, estado?: string) {
      // Si la conversación está escalada, NO es solo lectura — el cliente puede recibir mensajes del asesor
    this.modoLectura = estado !== 'ESCALADA';
    this.yaEscalado  = estado === 'ESCALADA';
    this.loading = true;
    this.mensajes = [];
    this.convIdActual = convId;

    this.http.get<any[]>(
      `${environment.apiUrl}/chat/${convId}/mensajes`,
      { headers: this.getHeaders() }
    ).subscribe({
      next: (msgs) => {
        this.mensajes = msgs.map(m => ({
          tipo: m.tipoEmisor === 'CLIENTE' ? 'you' as const : 'bot' as const,
          texto: m.tipoEmisor === 'ASESOR' ? `[Asesor]: ${m.contenido}` : m.contenido,
          fuentes: m.fuentes || [],
          escalada: false,
          tipoEmisor: m.tipoEmisor
        }));
        this.lastMensajesCount = this.mensajes.length;
        this.loading = false;
        if (estado === 'ESCALADA') {
          this.iniciarPolling(convId);
        }
      },
      error: () => {
        this.loading = false;
        this.mensajes = [{ tipo: 'bot', texto: 'No se pudo cargar el historial.' }];
      }
    });
  }

  enviar() {
    const texto = this.inputText.trim();
    if (!texto || this.loading || this.modoLectura) return;
    this.inputText = '';
    this.mensajes.push({ tipo: 'you', texto });
    this.loading = true;

    this.http.post<any>(
      `${environment.apiUrl}/chat/mensaje`,
      { contenido: texto, origen: 'WEB' },
      { headers: this.getHeaders() }
    ).subscribe({
      next: res => {
        this.convIdActual = res.conversacionId;
        // Conversación escalada — no mostrar burbuja de IA
        if (res.tipoEmisor === 'SISTEMA') {
          this.loading = false;
          return;
        }
        const msg: Mensaje = {
          tipo: 'bot',
          texto: res.contenido || 'Tu consulta fue procesada.',
          fuentes: res.fuentes || [],
          escalada: res.escalada || false
        };
        this.mensajes.push(msg);
        if (res.escalada) {
          this.yaEscalado = true;
          this.iniciarPolling(res.conversacionId);
        }
        this.loading = false;
      },
      error: () => {
        this.mensajes.push({ tipo: 'bot', texto: 'Ocurrió un error. Por favor intenta de nuevo.' });
        this.loading = false;
      }
    });
  }

  solicitarAsesor() {
    if (this.escalando || this.yaEscalado || this.modoLectura) return;
    this.escalando = true;

    this.http.post<any>(
      `${environment.apiUrl}/escalaciones/solicitar`,
      { motivo: 'Solicitud manual del cliente desde el chat web', prioridad: 'MEDIA' },
      { headers: this.getHeaders() }
    ).subscribe({
      next: res => {
        this.yaEscalado = true;
        this.escalando  = false;
        this.mensajes.push({
          tipo: 'bot',
          texto: res.mensaje || 'Tu consulta fue escalada. Un asesor te atenderá pronto.',
          escalada: true
        });
        if (this.convIdActual) this.iniciarPolling(this.convIdActual);
      },
      error: () => {
        this.escalando = false;
        this.mensajes.push({
          tipo: 'bot',
          texto: 'No se pudo escalar en este momento. Escribe "quiero un asesor" para intentarlo.'
        });
      }
    });
  }

  iniciarPolling(convId: number) {
    this.detenerPolling();
    this.lastMensajesCount = this.mensajes.length;

    this.pollingInterval = setInterval(() => {
      this.http.get<any[]>(
        `${environment.apiUrl}/chat/${convId}/mensajes`,
        { headers: this.getHeaders() }
      ).subscribe({
        next: (msgs) => {
          const nuevos = msgs.slice(this.lastMensajesCount);
          nuevos.forEach(m => {
            if (m.tipoEmisor === 'ASESOR') {
              this.mensajes.push({
                tipo: 'bot',
                texto: `[Asesor]: ${m.contenido}`,
                fuentes: [],
                tipoEmisor: 'ASESOR'
              });
            }
          });
          this.lastMensajesCount = msgs.length;
        }
      });
    }, 5000);
  }

  detenerPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  preguntaRapida(texto: string) { this.inputText = texto; this.enviar(); }

  nuevo() {
    this.detenerPolling();
    this.mensajesBienvenida();
    this.yaEscalado  = false;
    this.modoLectura = false;
    this.convIdActual = null;
    this.router.navigate(['/chat']);
  }

  logout() { this.auth.logout(); }
}