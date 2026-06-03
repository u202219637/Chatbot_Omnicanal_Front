import { Component, ViewChild, ElementRef, AfterViewChecked, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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

interface Mensaje { tipo: 'bot'|'you'; texto: string; fuentes?: any[]; }

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, LinebreakPipe],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})
export class ChatComponent implements AfterViewChecked {
  @ViewChild('chatBox') chatBox!: ElementRef;

  mensajes: Mensaje[] = [
    { tipo: 'bot', texto: 'Hola 👋 Soy Shadow IA, tu asistente de ShadowByte.\n¿Buscas una laptop, periférico o accesorio? Cuéntame tu presupuesto y necesidades.' }
  ];
  inputText  = '';
  loading    = false;
  widgetOpen = false;

  preguntas = [
    { icon: '💻', label: '¿Qué laptop me recomiendas?', texto: '¿Qué laptop me recomiendas para trabajo y estudio con buen rendimiento?' },
    { icon: '💰', label: 'Presupuesto S/ 3,500',        texto: 'Tengo un presupuesto de S/ 3,500. ¿Qué opciones tienes?' },
    { icon: '🎮', label: 'Laptop para gaming',           texto: '¿Cuál es la mejor laptop gaming que tienen?' },
    { icon: '🛡️', label: '¿Cuál es la garantía?',       texto: '¿Cuál es la política de garantía de los productos ShadowByte?' },
    { icon: '📦', label: 'Stock disponible',             texto: '¿Qué productos tienen en stock ahorita?' },
  ];

  constructor(
    private http: HttpClient,
    private router: Router,
    public auth: AuthService
  ) {}

  ngAfterViewChecked() {
    if (this.chatBox?.nativeElement) {
      const el = this.chatBox.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }

  enviar() {
    const texto = this.inputText.trim();
    if (!texto || this.loading) return;
    this.inputText = '';
    this.mensajes.push({ tipo: 'you', texto });
    this.loading = true;

    this.http.post<any>(`${environment.apiUrl}/chat/mensaje`, {
      contenido: texto,
      origen: 'WEB'
    }).subscribe({
      next: res => {
        this.mensajes.push({
          tipo: 'bot',
          texto: res.contenido || 'Tu consulta fue procesada.',
          fuentes: res.fuentes || []
        });
        this.loading = false;
      },
      error: () => {
        this.mensajes.push({ tipo: 'bot', texto: 'Ocurrió un error. Por favor intenta de nuevo.' });
        this.loading = false;
      }
    });
  }

  preguntaRapida(texto: string) {
    this.inputText = texto;
    this.enviar();
  }

  nuevo()  { this.mensajes = [{ tipo: 'bot', texto: '¡Nuevo chat iniciado! ¿En qué puedo ayudarte?' }]; }
  logout() { this.auth.logout(); }
}
