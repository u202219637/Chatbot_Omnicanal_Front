import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavbarComponent } from '../shared/navbar/navbar';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-atencion',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './atencion.html',
  styleUrl: './atencion.css'
})
export class AtencionComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatBox') chatBox!: ElementRef;

  conversacionId: number | null = null;
  escalacionId: number | null = null;
  clienteNombre = '';
  origen = '';

  mensajes: any[] = [];
  inputText = '';
  enviando = false;
  cargando = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  ngOnInit() {
    this.conversacionId = Number(this.route.snapshot.paramMap.get('conversacionId'));
    this.escalacionId   = Number(this.route.snapshot.queryParamMap.get('escalacionId')) || null;
    this.clienteNombre  = this.route.snapshot.queryParamMap.get('cliente') || 'Cliente';
    this.origen         = this.route.snapshot.queryParamMap.get('origen') || 'WEB';
    this.cargarMensajes();
  }

  ngAfterViewChecked() {
    if (this.chatBox?.nativeElement) {
      const el = this.chatBox.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }

  cargarMensajes() {
    this.cargando = true;
    this.http.get<any[]>(
      `${environment.apiUrl}/chat/${this.conversacionId}/mensajes`,
      { headers: this.getHeaders() }
    ).subscribe({
      next: (msgs) => { this.mensajes = msgs; this.cargando = false; },
      error: () => { this.cargando = false; }
    });
  }

  enviar() {
    const texto = this.inputText.trim();
    if (!texto || this.enviando) return;
    this.enviando = true;
    this.inputText = '';

    this.mensajes.push({
      tipoEmisor: 'ASESOR',
      contenido: texto,
      canalNombre: 'WEB',
      fechaEnvio: new Date().toISOString()
    });

    this.http.post<any>(
      `${environment.apiUrl}/chat/${this.conversacionId}/mensaje-asesor`,
      { contenido: texto, origen: 'WEB' },
      { headers: this.getHeaders() }
    ).subscribe({
      next: () => { this.enviando = false; },
      error: () => { this.mensajes.pop(); this.inputText = texto; this.enviando = false; }
    });
  }

  cerrarCaso() {
    if (!this.escalacionId) { this.volver(); return; }
    if (!confirm('¿Marcar este caso como cerrado?')) return;
    this.http.put(
      `${environment.apiUrl}/escalaciones/${this.escalacionId}/cerrar`, {},
      { headers: this.getHeaders() }
    ).subscribe({ next: () => this.volver(), error: () => this.volver() });
  }

  volver() { this.router.navigate(['/escalaciones']); }

  getCanalIcon(canal: string): string {
    if (!canal) return '🌐';
    return canal === 'WHATSAPP' ? '📱' : '🌐';
  }

  handleEnter(event: Event) {
    const ke = event as KeyboardEvent;
    if (!ke.shiftKey) {
      event.preventDefault();
      this.enviar();
    }
  }
}