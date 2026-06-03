import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class RegistroComponent {
  form = { nombres:'', apellidos:'', correo:'', telefono:'', username:'', password:'' };
  loading = false;
  error   = '';
  success = '';

  constructor(private auth: AuthService, private router: Router) {}

  registrar() {
    this.loading = true; this.error = '';
    this.auth.registro(this.form).subscribe({
      next: () => {
        this.loading = false;
        this.success = '¡Cuenta creada! Redirigiendo...';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: () => { this.loading = false; this.error = 'Error al crear la cuenta. El usuario o correo ya existe.'; }
    });
  }
}
