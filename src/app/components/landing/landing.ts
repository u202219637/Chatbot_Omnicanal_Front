import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../shared/navbar/navbar';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})
export class LandingComponent {
  features = [
    { icon: '🤖', title: 'Chat IA 24/7', desc: 'Resuelve dudas al instante con IA entrenada en nuestro catálogo.' },
    { icon: '📱', title: 'Omnicanal', desc: 'Empieza en la web y continúa por WhatsApp. Mismo historial.' },
    { icon: '🔍', title: 'Recomendaciones', desc: 'El bot analiza tu presupuesto y sugiere el producto ideal.' },
    { icon: '🛡️', title: 'Garantía', desc: 'Consulta políticas de garantía y soporte técnico al instante.' },
    { icon: '⚡', title: 'Inmediato', desc: 'Sin esperas. Respuesta promedio menor a 2 segundos.' },
    { icon: '📊', title: 'Dashboard', desc: 'Panel de gestión con métricas en tiempo real para admins.' },
  ];

  stats = [
    { value: '500+', label: 'Productos' },
    { value: '24/7', label: 'Soporte IA' },
    { value: '2 años', label: 'Garantía' },
    { value: '99.9%', label: 'Uptime' },
  ];

  widgetOpen = false;

  constructor(private router: Router, public auth: AuthService) {}

  goLogin()    { this.router.navigate(['/login']); }
  goCatalogo() { this.router.navigate(this.auth.isLoggedIn() ? ['/catalogo'] : ['/login']); }

  toggleWidget() {
    this.widgetOpen = !this.widgetOpen;
    const panel = document.getElementById('chat-panel');
    if (panel) panel.style.display = this.widgetOpen ? 'block' : 'none';
  }
}
