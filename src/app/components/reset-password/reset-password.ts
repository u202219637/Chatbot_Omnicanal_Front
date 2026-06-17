import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPasswordComponent implements OnInit {

  token = '';
  password = '';
  confirmarPassword = '';
  loading = false;
  error = '';
  exito = false;
  tokenValido = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    if (!this.token) {
      this.tokenValido = false;
      this.error = 'Enlace inválido. Solicita uno nuevo desde la pantalla de login.';
    }
  }

  resetear() {
    if (!this.password || this.password.length < 6) {
      this.error = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }
    if (this.password !== this.confirmarPassword) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }

    this.loading = true;
    this.error = '';

    this.http.post<any>(`${environment.apiUrl}/auth/reset-password`,
      { token: this.token, password: this.password }
    ).subscribe({
      next: () => {
        this.loading = false;
        this.exito = true;
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || 'El enlace expiró o ya fue usado. Solicita uno nuevo.';
      }
    });
  }
}