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
