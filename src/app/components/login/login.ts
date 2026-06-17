import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  username = '';
  password = '';
  loading  = false;
  error    = '';

  mostrarRecuperar  = false;
  correoRecuperar   = '';
  enviandoRecuperar = false;
  recuperarEnviado  = false;
  errorRecuperar    = '';

  features = [
    '💻 Catálogo de 500+ productos',
    '🤖 Asistente IA 24/7',
    '📱 Continúa por WhatsApp',
    '🛡️ Compra segura y garantizada'
  ];

  constructor(
    private auth: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  login() {
    if (!this.username || !this.password) {
      this.error = 'Completa todos los campos'; return;
    }
    this.loading = true; this.error = '';
    this.auth.login(this.username, this.password).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.rol === 'ADMINISTRADOR') this.router.navigate(['/dashboard']);
        else if (res.rol === 'ASESOR')   this.router.navigate(['/escalaciones']);
        else                             this.router.navigate(['/catalogo']);
      },
      error: () => {
        this.loading = false;
        this.error = 'Usuario o contraseña incorrectos';
      }
    });
  }

  enviarRecuperacion() {
    if (!this.correoRecuperar.trim()) {
      this.errorRecuperar = 'Ingresa tu correo';
      return;
    }
    this.enviandoRecuperar = true;
    this.errorRecuperar = '';
    this.http.post<any>(`${environment.apiUrl}/auth/recuperar`,
      { correo: this.correoRecuperar.trim() }
    ).subscribe({
      next: () => {
        this.enviandoRecuperar = false;
        this.recuperarEnviado  = true;
      },
      error: () => {
        this.enviandoRecuperar = false;
        // Igual mostramos éxito por seguridad (no revelar si el correo existe)
        this.recuperarEnviado = true;
      }
    });
  }

  cerrarModalRecuperar() {
    this.mostrarRecuperar  = false;
    this.correoRecuperar   = '';
    this.recuperarEnviado  = false;
    this.errorRecuperar    = '';
  }
}