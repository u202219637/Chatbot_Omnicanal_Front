import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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
  mostrarRecuperar = false;

  features = [
    '💻 Catálogo de 500+ productos',
    '🤖 Asistente IA 24/7',
    '📱 Continúa por WhatsApp',
    '🛡️ Compra segura y garantizada'
  ];

  constructor(private auth: AuthService, private router: Router) {}

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
}
