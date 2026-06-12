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

  // Solo permite dígitos en el campo teléfono
  soloNumeros(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/\D/g, '');
    this.form.telefono = input.value;
  }

  registrar() {
    // Normaliza el teléfono: siempre guardar con +51
    const telefonoNormalizado = this.normalizarTelefono(this.form.telefono);

    if (!telefonoNormalizado) {
      this.error = 'Ingresa un número de teléfono válido (9 dígitos).';
      return;
    }

    this.loading = true;
    this.error = '';

    const payload = { ...this.form, telefono: telefonoNormalizado };

    this.auth.registro(payload).subscribe({
      next: () => {
        this.loading = false;
        this.success = '¡Cuenta creada! Redirigiendo...';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: () => {
        this.loading = false;
        this.error = 'Error al crear la cuenta. El usuario o correo ya existe.';
      }
    });
  }

  private normalizarTelefono(tel: string): string {
    if (!tel) return '';
    // Quita todo lo que no sea dígito o +
    let limpio = tel.replace(/[^\d+]/g, '');
    // Si ya viene con +51, lo dejamos
    if (limpio.startsWith('+51')) return limpio;
    // Si viene con 51 sin +
    if (limpio.startsWith('51') && limpio.length === 11) return '+' + limpio;
    // Si son 9 dígitos (lo normal en Perú)
    if (limpio.length === 9) return '+51' + limpio;
    return limpio; // fallback
  }
}