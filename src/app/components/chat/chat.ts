import { Component, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

interface Mensaje {
  tipo: 'bot' | 'you';
  texto: string;
  fuentes?: any[];
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})
export class ChatComponent implements AfterViewChecked {
  @ViewChild('chatBox') chatBox!: ElementRef;

  mensajes: Mensaje[] = [
    { tipo: 'bot', texto: 'Hola, soy Shadow IA 👋\n¿En qué puedo ayudarte hoy? Puedo recomendarte laptops, comparar productos e informarte sobre garantías.' }
  ];
  input   = '';
  loading = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    public auth: AuthService
  ) {}

  ngAfterViewChecked() {
    if (this.chatBox) {
      this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
    }
  }

  enviar() {
    const texto = this.input.trim();
    if (!texto || this.loading) return;
    this.input = '';
    this.mensajes.push({ tipo: 'you', texto });
    this.loading = true;
    this.mensajes.push({ tipo: 'bot', texto: '● ● ●' });

    this.http.post<any>(`${environment.apiUrl}/chat/mensaje`, {
      contenido: texto,
      origen: 'WEB'
    }).subscribe({
      next: res => {
        this.mensajes.pop();
        this.mensajes.push({
          tipo: 'bot',
          texto: res.contenido || 'Procesando tu consulta...',
          fuentes: res.fuentes || []
        });
        this.loading = false;
      },
      error: () => {
        this.mensajes.pop();
        this.mensajes.push({ tipo: 'bot', texto: 'Ocurrió un error. Por favor intenta nuevamente.' });
        this.loading = false;
      }
    });
  }

  nuevo() {
    this.mensajes = [{ tipo: 'bot', texto: 'Chat nuevo iniciado. ¿En qué puedo ayudarte?' }];
  }

  irCatalogo() { this.router.navigate(['/catalogo']); }
  logout()     { this.auth.logout(); }
}
