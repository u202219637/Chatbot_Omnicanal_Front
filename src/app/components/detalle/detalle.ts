import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../shared/navbar/navbar';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent],
  templateUrl: './detalle.html',
  styleUrl: './detalle.css'
})
export class DetalleComponent implements OnInit {
  producto: any = null;
  relacionados: any[] = [];
  loading = true;
  widgetOpen = false;
  miniChatOpen = false;
  miniMensajes: any[] = [];
  miniInput = '';
  miniLoading = false;
  cantidad = 1;

  resenas = [
    { usuario: 'Carlos M.', rating: 5, fecha: 'Mayo 2025', texto: 'Excelente producto, llegó en perfecto estado y funciona de maravilla. Lo recomiendo totalmente.' },
    { usuario: 'Ana P.',    rating: 4, fecha: 'Abril 2025', texto: 'Muy buena calidad. El envío fue rápido. Le quito una estrella porque el empaque podría mejorar.' },
    { usuario: 'Luis R.',   rating: 5, fecha: 'Marzo 2025', texto: 'Justo lo que necesitaba. Shadow IA me ayudó a elegir entre varios modelos y acerté.' },
  ];
  nuevaResena = { rating: 5, texto: '' };
  ratingHover = 0;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(p => {
      this.loading = true;
      this.http.get<any>(`${environment.apiUrl}/productos/${p['id']}`).subscribe({
        next: d => {
          this.producto = d;
          this.loading = false;
          this.miniMensajes = [{
            tipo: 'bot',
            texto: `Hola 👋 Estás viendo el ${d.nombre} (S/ ${this.formatPrice(d.precio)}). ¿En qué puedo ayudarte?`
          }];
          if (d.categoriaNombre) {
            this.http.get<any[]>(`${environment.apiUrl}/productos?q=${d.categoriaNombre}`)
              .subscribe(r => this.relacionados = r.filter(x => x.id !== d.id).slice(0, 4));
          }
        },
        error: () => { this.loading = false; this.router.navigate(['/catalogo']); }
      });
    });
  }

  agregarAlCarrito() {
    const carrito: any[] = JSON.parse(localStorage.getItem('carrito') || '[]');
    const existe = carrito.find((i: any) => i.id === this.producto.id);
    if (existe) {
      existe.cantidad += this.cantidad;
    } else {
      carrito.push({ ...this.producto, cantidad: this.cantidad });
    }
    localStorage.setItem('carrito', JSON.stringify(carrito));
    window.dispatchEvent(new Event('carritoUpdated'));
    alert(`✓ ${this.producto.nombre} agregado al carrito`);
  }

  preguntarShadowIA() {
    this.miniChatOpen = true;
    this.widgetOpen = false;
    if (this.miniMensajes.length === 1) {
      setTimeout(() => this.enviarMiniMensaje(`Tengo una consulta sobre el ${this.producto.nombre}`), 300);
    }
  }

  consultarWhatsApp() {
    const msg = encodeURIComponent(
      `Hola ShadowByte, me interesa el *${this.producto.nombre}* (S/ ${this.formatPrice(this.producto.precio)}). ¿Tienen disponibilidad?`
    );
    window.open(`https://api.whatsapp.com/send?phone=51999000001&text=${msg}`, '_blank');
  }

  enviarMiniMensaje(textoOverride?: string) {
    const texto = textoOverride || this.miniInput.trim();
    if (!texto || this.miniLoading) return;
    this.miniInput = '';
    this.miniMensajes.push({ tipo: 'you', texto });
    this.miniLoading = true;
    this.http.post<any>(`${environment.apiUrl}/chat/mensaje`, {
      contenido: texto, origen: 'WEB'
    }).subscribe({
      next: res => {
        this.miniMensajes.push({ tipo: 'bot', texto: res.contenido || 'Procesando...' });
        this.miniLoading = false;
      },
      error: () => {
        this.miniMensajes.push({ tipo: 'bot', texto: 'No pude conectarme. Intenta de nuevo.' });
        this.miniLoading = false;
      }
    });
  }

  enviarResena() {
    if (!this.nuevaResena.texto.trim()) return;
    this.resenas.unshift({
      usuario: 'Tú',
      rating: this.nuevaResena.rating,
      fecha: 'Ahora',
      texto: this.nuevaResena.texto
    });
    this.nuevaResena = { rating: 5, texto: '' };
  }

  promedioRating(): number {
    return Math.round(this.resenas.reduce((a, r) => a + r.rating, 0) / this.resenas.length * 10) / 10;
  }

  stars(n: number): string[] { return Array(5).fill(0).map((_, i) => i < n ? '★' : '☆'); }

  formatPrice(p: number): string {
    if (!p) return '0.00';
    return p.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}
