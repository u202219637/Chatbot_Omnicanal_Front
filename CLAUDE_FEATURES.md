# CLAUDE_FEATURES.md — 3 features nuevas
# Ejecutar después de CLAUDE_FIXES.md

---

## FEATURE 1 — Detalle producto: reseñas + botones inteligentes

### src/app/components/detalle/detalle.ts — REEMPLAZAR COMPLETO
```typescript
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

  // Reseñas de prueba
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
            texto: `Hola 👋 Estás viendo el **${d.nombre}** (S/ ${this.formatPrice(d.precio)}). ¿En qué puedo ayudarte?`
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
```

### src/app/components/detalle/detalle.html — REEMPLAZAR COMPLETO
```html
<app-navbar></app-navbar>

<div style="background:var(--soft);min-height:100vh" *ngIf="!loading && producto">

  <!-- BREADCRUMB -->
  <div style="background:var(--white);border-bottom:1px solid var(--line);padding:12px 32px">
    <div style="max-width:1300px;margin:0 auto;font-size:13px;color:var(--muted);font-weight:600">
      <a routerLink="/catalogo" style="color:var(--p);text-decoration:none">Catálogo</a>
      <span style="margin:0 8px">›</span>
      <span>{{ producto.categoriaNombre }}</span>
      <span style="margin:0 8px">›</span>
      <span style="color:var(--ink)">{{ producto.nombre }}</span>
    </div>
  </div>

  <div style="max-width:1300px;margin:0 auto;padding:28px 32px">

    <!-- PRODUCTO PRINCIPAL -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-bottom:48px">

      <!-- IMAGEN -->
      <div style="background:var(--white);border:1px solid var(--line);border-radius:20px;
                  padding:40px;display:flex;align-items:center;justify-content:center;min-height:400px">
        <img *ngIf="producto.urlImagen" [src]="producto.urlImagen" [alt]="producto.nombre"
             style="max-height:320px;max-width:100%;object-fit:contain">
        <span *ngIf="!producto.urlImagen" style="font-size:80px">💻</span>
      </div>

      <!-- INFO -->
      <div style="display:flex;flex-direction:column;gap:16px">

        <div>
          <div style="font-size:12px;font-weight:800;text-transform:uppercase;
                      letter-spacing:.08em;color:var(--muted);margin-bottom:8px">
            {{ producto.categoriaNombre }} · {{ producto.marcaNombre }}
          </div>
          <h1 style="font-size:28px;font-weight:900;letter-spacing:-.04em;
                      line-height:1.2;margin-bottom:10px">{{ producto.nombre }}</h1>
          <div style="font-size:15px;color:var(--muted);line-height:1.7">{{ producto.descripcion }}</div>
        </div>

        <!-- Rating resumen -->
        <div style="display:flex;align-items:center;gap:10px">
          <div style="color:#f59e0b;font-size:18px;letter-spacing:2px">
            {{ stars(promedioRating()).join('') }}
          </div>
          <span style="font-size:14px;font-weight:700;color:var(--ink)">{{ promedioRating() }}</span>
          <span style="font-size:13px;color:var(--muted)">({{ resenas.length }} reseñas)</span>
        </div>

        <!-- PRECIO -->
        <div style="font-size:40px;font-weight:900;color:var(--p);letter-spacing:-.04em">
          S/ {{ formatPrice(producto.precio) }}
        </div>

        <!-- STOCK -->
        <div style="display:flex;align-items:center;gap:10px">
          <span [class]="producto.stock > 0 ? 'badge badge-green' : 'badge badge-red'"
                style="font-size:13px;padding:7px 14px">
            {{ producto.stock > 0 ? '✓ ' + producto.stock + ' unidades en stock' : '✗ Sin stock' }}
          </span>
        </div>

        <!-- CANTIDAD + CARRITO -->
        <div style="display:flex;align-items:center;gap:12px;padding:16px;
                    background:var(--soft);border-radius:14px;border:1px solid var(--line)">
          <div style="font-size:13px;font-weight:700;color:var(--muted)">Cantidad:</div>
          <div style="display:flex;align-items:center;gap:0;border:1px solid var(--line);
                      border-radius:8px;overflow:hidden;background:var(--white)">
            <button (click)="cantidad=cantidad>1?cantidad-1:1"
              style="width:36px;height:36px;font-size:18px;font-weight:700;
                     border:none;cursor:pointer;background:none">−</button>
            <span style="width:40px;text-align:center;font-weight:800;font-size:15px">{{ cantidad }}</span>
            <button (click)="cantidad=cantidad+1"
              style="width:36px;height:36px;font-size:18px;font-weight:700;
                     border:none;cursor:pointer;background:none">+</button>
          </div>
          <button class="btn-primary" style="flex:1;justify-content:center;font-size:15px;padding:14px"
                  (click)="agregarAlCarrito()" [disabled]="producto.stock === 0">
            🛒 Agregar al carrito
          </button>
        </div>

        <!-- SPECS -->
        <div style="background:var(--soft);border-radius:14px;padding:18px;border:1px solid var(--line)">
          <div style="font-size:14px;font-weight:800;margin-bottom:10px">Especificaciones</div>
          <div style="font-size:14px;color:var(--muted);line-height:1.9">
            {{ producto.especificaciones }}
          </div>
        </div>

        <!-- BOTONES IA -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <button class="btn-primary" style="justify-content:center;padding:14px"
                  (click)="preguntarShadowIA()">
            🤖 Preguntar a Shadow IA
          </button>
          <button class="btn-outline" style="justify-content:center;padding:14px"
                  (click)="consultarWhatsApp()">
            📱 Consultar por WhatsApp
          </button>
        </div>
      </div>
    </div>

    <!-- RESEÑAS -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-bottom:40px">

      <!-- Lista reseñas -->
      <div>
        <div style="font-size:20px;font-weight:900;margin-bottom:4px">Reseñas de clientes</div>
        <div style="font-size:14px;color:var(--muted);margin-bottom:20px">
          {{ resenas.length }} reseñas · Promedio {{ promedioRating() }}/5
        </div>
        <div style="display:flex;flex-direction:column;gap:14px">
          <div *ngFor="let r of resenas"
            style="background:var(--white);border:1px solid var(--line);
                   border-radius:16px;padding:18px">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
              <div>
                <div style="font-weight:800;font-size:14px">{{ r.usuario }}</div>
                <div style="font-size:12px;color:var(--muted)">{{ r.fecha }}</div>
              </div>
              <div style="color:#f59e0b;letter-spacing:2px">{{ stars(r.rating).join('') }}</div>
            </div>
            <div style="font-size:14px;color:#475569;line-height:1.6">{{ r.texto }}</div>
          </div>
        </div>
      </div>

      <!-- Escribir reseña -->
      <div style="background:var(--white);border:1px solid var(--line);border-radius:20px;padding:24px;height:fit-content">
        <div style="font-size:18px;font-weight:900;margin-bottom:16px">Escribir una reseña</div>

        <div style="margin-bottom:16px">
          <label class="sb-label">Tu calificación</label>
          <div style="display:flex;gap:6px;margin-top:6px">
            <span *ngFor="let s of [1,2,3,4,5]"
              (click)="nuevaResena.rating=s"
              (mouseenter)="ratingHover=s"
              (mouseleave)="ratingHover=0"
              style="font-size:28px;cursor:pointer;transition:transform .1s"
              [style.transform]="(ratingHover||nuevaResena.rating)>=s?'scale(1.2)':'scale(1)'">
              {{ (ratingHover||nuevaResena.rating) >= s ? '★' : '☆' }}
            </span>
          </div>
        </div>

        <div style="margin-bottom:16px">
          <label class="sb-label">Tu opinión</label>
          <textarea [(ngModel)]="nuevaResena.texto"
            style="width:100%;min-height:100px;border:1.5px solid var(--line);border-radius:12px;
                   padding:12px 14px;font-family:inherit;font-size:14px;outline:none;resize:vertical"
            placeholder="¿Qué te pareció el producto?"></textarea>
        </div>

        <button class="btn-primary" style="width:100%;justify-content:center"
                (click)="enviarResena()">
          Publicar reseña
        </button>
      </div>
    </div>

    <!-- RELACIONADOS -->
    <div *ngIf="relacionados.length > 0">
      <div style="font-size:20px;font-weight:900;margin-bottom:4px">También te puede interesar</div>
      <div style="font-size:14px;color:var(--muted);margin-bottom:18px">Productos de la misma categoría</div>
      <div class="product-grid" style="grid-template-columns:repeat(4,1fr)">
        <div class="product-card" *ngFor="let p of relacionados" [routerLink]="['/detalle', p.id]">
          <div class="product-img">
            <img *ngIf="p.urlImagen" [src]="p.urlImagen" [alt]="p.nombre">
            <span *ngIf="!p.urlImagen">💻</span>
          </div>
          <div class="product-name">{{ p.nombre }}</div>
          <div class="product-price">S/ {{ formatPrice(p.precio) }}</div>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="loading-spinner" *ngIf="loading">⏳ Cargando producto...</div>

<!-- MINI CHAT SHADOW IA (tipo Chatwoot) -->
<div *ngIf="miniChatOpen"
  style="position:fixed;right:24px;bottom:24px;z-index:9999;
         width:340px;background:#fff;border-radius:20px;
         box-shadow:0 8px 40px rgba(15,23,42,.18);overflow:hidden;
         display:flex;flex-direction:column;height:480px">

  <!-- Header mini chat -->
  <div style="background:linear-gradient(135deg,#1e1b4b,#4f46e5);
              padding:16px 18px;display:flex;align-items:center;gap:12px;flex-shrink:0">
    <div style="width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.2);
                display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:900;color:#fff">S</div>
    <div style="flex:1">
      <div style="font-weight:800;font-size:14px;color:#fff">Shadow IA</div>
      <div style="font-size:11px;color:rgba(255,255,255,.7)">● En línea · Responde al instante</div>
    </div>
    <button (click)="miniChatOpen=false"
      style="background:rgba(255,255,255,.15);border:none;color:#fff;
             width:28px;height:28px;border-radius:50%;cursor:pointer;font-size:14px">✕</button>
  </div>

  <!-- Mensajes -->
  <div style="flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:8px;
              background:#f8fafc">
    <div *ngFor="let m of miniMensajes">
      <div [style.background]="m.tipo==='bot' ? '#fff' : 'linear-gradient(135deg,#4f46e5,#7c3aed)'"
           [style.color]="m.tipo==='bot' ? '#0f172a' : '#fff'"
           [style.margin-left]="m.tipo==='you' ? 'auto' : '0'"
           [style.border]="m.tipo==='bot' ? '1px solid #e2e8f0' : 'none'"
           style="padding:10px 14px;border-radius:12px;max-width:85%;
                  font-size:13px;line-height:1.55;width:fit-content">
        {{ m.texto }}
      </div>
    </div>
    <div *ngIf="miniLoading" style="display:flex;gap:4px;padding:8px">
      <div *ngFor="let d of [1,2,3]"
        style="width:7px;height:7px;border-radius:50%;background:#94a3b8;
               animation:typing 1.2s infinite"
        [style.animation-delay]="d===1?'0s':d===2?'.3s':'.6s'"></div>
    </div>
  </div>

  <!-- Input mini chat -->
  <div style="padding:12px;border-top:1px solid #e2e8f0;display:flex;gap:8px;background:#fff;flex-shrink:0">
    <input [(ngModel)]="miniInput"
      style="flex:1;height:38px;border:1px solid #e2e8f0;border-radius:10px;
             padding:0 12px;font-family:inherit;font-size:13px;outline:none"
      placeholder="Escribe tu consulta..."
      (keydown.enter)="enviarMiniMensaje()">
    <button (click)="enviarMiniMensaje()"
      style="width:38px;height:38px;border-radius:10px;border:none;cursor:pointer;
             background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;font-size:16px">➤</button>
  </div>
</div>

<!-- WIDGET FLOTANTE -->
<div style="position:fixed;right:24px;bottom:24px;z-index:9998" *ngIf="!miniChatOpen">
  <div *ngIf="widgetOpen"
    style="margin-bottom:12px;background:#fff;border-radius:20px;
           box-shadow:0 8px 40px rgba(15,23,42,.18);overflow:hidden;width:300px">
    <div style="background:linear-gradient(135deg,#1e1b4b,#312e81);padding:16px 20px;color:#fff">
      <div style="font-weight:900;font-size:15px">ShadowByte · Soporte</div>
      <div style="font-size:12px;opacity:.7;margin-top:2px">¿Cómo quieres contactarnos?</div>
    </div>
    <div (click)="preguntarShadowIA()"
       style="display:flex;align-items:center;gap:12px;padding:14px 20px;
              border-bottom:1px solid #f1f5f9;cursor:pointer;transition:background .15s"
       onmouseover="this.style.background='#f8faff'"
       onmouseout="this.style.background='#fff'">
      <div style="width:40px;height:40px;border-radius:10px;background:linear-gradient(135deg,#6d28d9,#7c3aed);
                  display:flex;align-items:center;justify-content:center;font-size:20px">🤖</div>
      <div>
        <div style="font-weight:800;font-size:13px;color:#0f172a">Shadow IA</div>
        <div style="font-size:11px;color:#64748b">Chat con IA · Respuesta inmediata</div>
      </div>
    </div>
    <div (click)="consultarWhatsApp()"
       style="display:flex;align-items:center;gap:12px;padding:14px 20px;cursor:pointer;transition:background .15s"
       onmouseover="this.style.background='#f0fdf4'"
       onmouseout="this.style.background='#fff'">
      <div style="width:40px;height:40px;border-radius:10px;background:#22c55e;
                  display:flex;align-items:center;justify-content:center;font-size:20px">📱</div>
      <div>
        <div style="font-weight:800;font-size:13px;color:#0f172a">WhatsApp</div>
        <div style="font-size:11px;color:#64748b">Mismo historial · Continúa siempre</div>
      </div>
    </div>
  </div>
  <button (click)="widgetOpen=!widgetOpen"
    style="width:60px;height:60px;border-radius:50%;border:none;cursor:pointer;
           background:linear-gradient(135deg,#4f46e5,#7c3aed);
           box-shadow:0 4px 24px rgba(79,70,229,.45);font-size:24px;color:#fff;
           display:flex;align-items:center;justify-content:center;
           transition:transform .2s;position:relative">
    {{ widgetOpen ? '✕' : '💬' }}
    <span style="position:absolute;top:2px;right:2px;width:14px;height:14px;
                 border-radius:50%;background:#22c55e;border:2px solid #fff"></span>
  </button>
</div>
```

---

## FEATURE 2 — Carrito de compras

### Crear src/app/components/carrito/carrito.ts
```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css'
})
export class CarritoComponent implements OnInit, OnDestroy {
  items: any[] = [];
  private listener = () => this.cargar();

  ngOnInit()    { this.cargar(); window.addEventListener('carritoUpdated', this.listener); }
  ngOnDestroy() { window.removeEventListener('carritoUpdated', this.listener); }

  cargar() {
    this.items = JSON.parse(localStorage.getItem('carrito') || '[]');
  }

  cambiarCantidad(id: number, delta: number) {
    const item = this.items.find(i => i.id === id);
    if (!item) return;
    item.cantidad = Math.max(1, item.cantidad + delta);
    this.guardar();
  }

  eliminar(id: number) {
    this.items = this.items.filter(i => i.id !== id);
    this.guardar();
  }

  guardar() {
    localStorage.setItem('carrito', JSON.stringify(this.items));
    window.dispatchEvent(new Event('carritoUpdated'));
  }

  vaciar() {
    if (confirm('¿Vaciar el carrito?')) {
      this.items = [];
      this.guardar();
    }
  }

  get subtotal(): number { return this.items.reduce((s, i) => s + i.precio * i.cantidad, 0); }
  get igv():      number { return this.subtotal * 0.18; }
  get total():    number { return this.subtotal; }
  get count():    number { return this.items.reduce((s, i) => s + i.cantidad, 0); }

  formatPrice(p: number): string {
    return p.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  consultarCarritoIA() {
    const resumen = this.items.map(i => `${i.nombre} x${i.cantidad}`).join(', ');
    localStorage.setItem('consultaIA', `Tengo en mi carrito: ${resumen}. ¿Me puedes ayudar a decidir si es la mejor opción para mí?`);
    window.location.href = '/chat';
  }
}
```

### Crear src/app/components/carrito/carrito.html
```html
<app-navbar></app-navbar>

<div style="background:var(--soft);min-height:100vh">
  <div style="max-width:1200px;margin:0 auto;padding:28px 32px">

    <div style="font-size:24px;font-weight:900;margin-bottom:4px">🛒 Tu carrito</div>
    <div style="font-size:14px;color:var(--muted);margin-bottom:24px">
      {{ count }} {{ count === 1 ? 'producto' : 'productos' }} en tu carrito
    </div>

    <!-- VACÍO -->
    <div *ngIf="items.length === 0" class="empty-state">
      <div class="empty-icon">🛒</div>
      Tu carrito está vacío.
      <br><br>
      <a routerLink="/catalogo" class="btn-primary">Ir al catálogo</a>
    </div>

    <!-- CON ITEMS -->
    <div *ngIf="items.length > 0" style="display:grid;grid-template-columns:1fr 360px;gap:24px">

      <!-- LISTA -->
      <div style="display:flex;flex-direction:column;gap:12px">
        <div *ngFor="let item of items"
          style="background:var(--white);border:1px solid var(--line);border-radius:18px;
                 padding:18px;display:flex;gap:16px;align-items:center">

          <!-- Imagen -->
          <div style="width:80px;height:80px;border-radius:12px;
                      background:var(--soft);display:flex;align-items:center;
                      justify-content:center;flex-shrink:0;overflow:hidden">
            <img *ngIf="item.urlImagen" [src]="item.urlImagen" [alt]="item.nombre"
                 style="width:100%;height:100%;object-fit:contain;padding:6px">
            <span *ngIf="!item.urlImagen" style="font-size:32px">💻</span>
          </div>

          <!-- Info -->
          <div style="flex:1">
            <div style="font-weight:800;font-size:15px;margin-bottom:4px">{{ item.nombre }}</div>
            <div style="font-size:12px;color:var(--muted)">{{ item.categoriaNombre }} · {{ item.marcaNombre }}</div>
            <div style="font-size:18px;font-weight:900;color:var(--p);margin-top:6px">
              S/ {{ formatPrice(item.precio * item.cantidad) }}
            </div>
          </div>

          <!-- Cantidad -->
          <div style="display:flex;align-items:center;gap:0;border:1px solid var(--line);
                      border-radius:8px;overflow:hidden">
            <button (click)="cambiarCantidad(item.id, -1)"
              style="width:34px;height:34px;border:none;cursor:pointer;
                     background:none;font-size:16px;font-weight:700">−</button>
            <span style="width:36px;text-align:center;font-weight:800;font-size:14px">{{ item.cantidad }}</span>
            <button (click)="cambiarCantidad(item.id, 1)"
              style="width:34px;height:34px;border:none;cursor:pointer;
                     background:none;font-size:16px;font-weight:700">+</button>
          </div>

          <!-- Eliminar -->
          <button (click)="eliminar(item.id)"
            style="width:32px;height:32px;border-radius:8px;border:1px solid #fee2e2;
                   background:#fff;color:#ef4444;cursor:pointer;font-size:16px">✕</button>
        </div>

        <!-- Consultar con IA -->
        <div style="background:linear-gradient(135deg,#f0f4ff,#e8edff);
                    border:1px solid #c4b5fd;border-radius:18px;padding:18px;
                    display:flex;align-items:center;gap:14px">
          <div style="font-size:28px">🤖</div>
          <div style="flex:1">
            <div style="font-weight:800;font-size:14px;margin-bottom:4px">¿No estás seguro?</div>
            <div style="font-size:13px;color:var(--muted)">Shadow IA puede ayudarte a confirmar si estos productos son los mejores para ti</div>
          </div>
          <button class="btn-primary" style="padding:10px 18px;font-size:13px;white-space:nowrap"
                  (click)="consultarCarritoIA()">
            Consultar con IA
          </button>
        </div>
      </div>

      <!-- RESUMEN -->
      <div>
        <div style="background:var(--white);border:1px solid var(--line);border-radius:20px;
                    padding:24px;position:sticky;top:84px">
          <div style="font-size:18px;font-weight:900;margin-bottom:18px">Resumen del pedido</div>

          <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:18px">
            <div *ngFor="let item of items"
              style="display:flex;justify-content:space-between;font-size:13px">
              <span style="color:var(--muted)">{{ item.nombre }} x{{ item.cantidad }}</span>
              <span style="font-weight:700">S/ {{ formatPrice(item.precio * item.cantidad) }}</span>
            </div>
          </div>

          <div style="border-top:1px solid var(--line);padding-top:16px;margin-bottom:16px">
            <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:8px">
              <span style="color:var(--muted)">Subtotal</span>
              <span style="font-weight:700">S/ {{ formatPrice(subtotal) }}</span>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:8px">
              <span style="color:var(--muted)">IGV (18%)</span>
              <span style="font-weight:700">S/ {{ formatPrice(igv) }}</span>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:16px;
                        font-weight:900;padding-top:8px;border-top:1px solid var(--line)">
              <span>Total</span>
              <span style="color:var(--p)">S/ {{ formatPrice(total) }}</span>
            </div>
          </div>

          <button class="btn-primary" style="width:100%;justify-content:center;
                  font-size:15px;padding:15px;margin-bottom:10px">
            Proceder al pago →
          </button>

          <a routerLink="/catalogo" class="btn-ghost"
             style="width:100%;justify-content:center;font-size:14px;display:flex">
            ← Seguir comprando
          </a>

          <button (click)="vaciar()"
            style="width:100%;margin-top:10px;padding:10px;border-radius:10px;
                   border:1px solid #fee2e2;background:#fff;color:#ef4444;
                   cursor:pointer;font-size:13px;font-weight:700;font-family:inherit">
            Vaciar carrito
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
```

### Crear src/app/components/carrito/carrito.css
```css
/* Empty */
```

---

## FEATURE 3 — Navbar con contador de carrito

### En navbar.ts, agregar dentro del template, antes del cierre del header:

Buscar la sección `<!-- USER -->` y ANTES del div de usuario agregar:

```html
<!-- CARRITO BADGE -->
<a routerLink="/carrito"
   style="position:relative;display:flex;align-items:center;justify-content:center;
          width:40px;height:40px;border-radius:10px;border:1px solid var(--line);
          background:var(--white);cursor:pointer;text-decoration:none;font-size:18px;
          margin-right:6px">
  🛒
  <span *ngIf="cartCount > 0"
    style="position:absolute;top:-6px;right:-6px;
           background:var(--red);color:#fff;
           font-size:10px;font-weight:900;min-width:18px;height:18px;
           border-radius:999px;display:flex;align-items:center;justify-content:center;
           border:2px solid #fff">{{ cartCount }}</span>
</a>
```

### En navbar.ts, agregar en la clase:
```typescript
cartCount = 0;
private cartListener = () => this.updateCart();

constructor(public auth: AuthService, private router: Router) {
  this.updateCart();
  window.addEventListener('carritoUpdated', this.cartListener);
}

updateCart() {
  const items = JSON.parse(localStorage.getItem('carrito') || '[]');
  this.cartCount = items.reduce((s: number, i: any) => s + (i.cantidad || 1), 0);
}
```

Agregar `OnInit, OnDestroy` al import de Angular y:
```typescript
ngOnDestroy() { window.removeEventListener('carritoUpdated', this.cartListener); }
```

---

## FEATURE 4 — Agregar ruta /carrito en app.routes.ts

Agregar dentro del array routes:
```typescript
{
  path: 'carrito',
  loadComponent: () => import('./components/carrito/carrito').then(m => m.CarritoComponent),
  canActivate: [authGuard]
},
```

---

## FEATURE 5 — Botón "Agregar al carrito" en cards del catálogo

En catalogo.html, dentro del product-card, reemplazar el botón final:

```html
<div style="display:grid;grid-template-columns:1fr auto;gap:8px;margin-top:12px">
  <button class="btn-primary" style="justify-content:center;font-size:12px;padding:9px"
          (click)="verDetalle(p.id);$event.stopPropagation()">
    Ver detalle
  </button>
  <button (click)="agregarCarrito(p);$event.stopPropagation()"
    style="width:38px;height:38px;border-radius:10px;border:1px solid var(--line);
           background:var(--white);cursor:pointer;font-size:18px;
           display:flex;align-items:center;justify-content:center;
           transition:background .15s"
    title="Agregar al carrito"
    onmouseover="this.style.background='#f0f4ff'"
    onmouseout="this.style.background='var(--white)'">
    🛒
  </button>
</div>
```

### En catalogo.ts agregar método:
```typescript
agregarCarrito(p: any) {
  const carrito: any[] = JSON.parse(localStorage.getItem('carrito') || '[]');
  const existe = carrito.find((i: any) => i.id === p.id);
  if (existe) { existe.cantidad++; }
  else { carrito.push({ ...p, cantidad: 1 }); }
  localStorage.setItem('carrito', JSON.stringify(carrito));
  window.dispatchEvent(new Event('carritoUpdated'));
}
```

---

## VERIFICACIÓN FINAL

```bash
ng build 2>&1 | grep -E "^ERROR" | head -10
```

Flujo completo a probar:
1. /catalogo → click 🛒 en una card → badge del navbar se actualiza
2. /detalle/1 → "Agregar al carrito" → badge actualizado
3. /carrito → ver items, cambiar cantidades, "Consultar con IA"
4. /detalle → click "Preguntar a Shadow IA" → mini chat se abre en la esquina
5. Mini chat → escribir pregunta → respuesta del bot
6. Widget flotante → 2 opciones → Shadow IA abre mini chat, WhatsApp abre externa

