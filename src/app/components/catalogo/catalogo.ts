import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../shared/navbar/navbar';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css'
})
export class CatalogoComponent implements OnInit {
  productos: any[]   = [];
  filtrados: any[]   = [];
  categorias: any[]  = [];
  marcas: any[]      = [];
  loading = true;
  widgetOpen = false;

  q            = '';
  categoriasSel: number[] = [];
  marcasSel:     number[] = [];
  precioMax    = 10000;
  orden        = 'relevancia';

  constructor(
    private http: HttpClient,
    private router: Router,
    public  auth:  AuthService
  ) {}

  ngOnInit() {
    this.http.get<any[]>(`${environment.apiUrl}/categorias`).subscribe(d => this.categorias = d);
    this.http.get<any[]>(`${environment.apiUrl}/marcas`).subscribe(d => this.marcas = d);
    this.cargar();
  }

  cargar() {
    this.loading = true;
    const q = this.q ? `?q=${encodeURIComponent(this.q)}` : '';
    this.http.get<any[]>(`${environment.apiUrl}/productos${q}`).subscribe({
      next: d => { this.productos = d; this.aplicarFiltros(); this.loading = false; },
      error: ()=> this.loading = false
    });
  }

  aplicarFiltros() {
    let lista = [...this.productos];
    if (this.categoriasSel.length)
      lista = lista.filter(p => this.categoriasSel.includes(p.categoriaId || this.getCatId(p.categoriaNombre)));
    if (this.marcasSel.length)
      lista = lista.filter(p => this.marcasSel.includes(p.marcaId || this.getMarcaId(p.marcaNombre)));
    lista = lista.filter(p => p.precio <= this.precioMax);
    if (this.orden === 'precio_asc')  lista.sort((a,b) => a.precio - b.precio);
    if (this.orden === 'precio_desc') lista.sort((a,b) => b.precio - a.precio);
    if (this.orden === 'nombre')      lista.sort((a,b) => a.nombre.localeCompare(b.nombre));
    this.filtrados = lista;
  }

  toggleCategoria(id: number) {
    const i = this.categoriasSel.indexOf(id);
    i >= 0 ? this.categoriasSel.splice(i,1) : this.categoriasSel.push(id);
    this.aplicarFiltros();
  }

  toggleMarca(id: number) {
    const i = this.marcasSel.indexOf(id);
    i >= 0 ? this.marcasSel.splice(i,1) : this.marcasSel.push(id);
    this.aplicarFiltros();
  }

  limpiar() {
    this.q=''; this.categoriasSel=[]; this.marcasSel=[];
    this.precioMax=10000; this.orden='relevancia'; this.cargar();
  }

  verDetalle(id: number) { this.router.navigate(['/detalle', id]); }

  countCat(nombre: string)  { return this.productos.filter(p => p.categoriaNombre === nombre).length; }
  countMarca(nombre: string){ return this.productos.filter(p => p.marcaNombre === nombre).length; }
  getCatId(nombre: string)  { return this.categorias.find(c => c.nombre === nombre)?.id; }
  getMarcaId(nombre: string){ return this.marcas.find(m => m.nombre === nombre)?.id; }

  emoji(cat: string): string {
    const m: any = { Laptops:'💻', Periféricos:'🖱️', Monitores:'🖥️', Almacenamiento:'💾', Accesorios:'🎒' };
    return m[cat] || '📦';
  }

  formatPrice(p: number): string {
    if (!p) return 'S/ 0.00';
    return 'S/ ' + p.toLocaleString('es-PE', { minimumFractionDigits:2, maximumFractionDigits:2 });
  }

  agregarCarrito(p: any) {
    const carrito: any[] = JSON.parse(localStorage.getItem('carrito') || '[]');
    const existe = carrito.find((i: any) => i.id === p.id);
    if (existe) { existe.cantidad++; }
    else { carrito.push({ ...p, cantidad: 1 }); }
    localStorage.setItem('carrito', JSON.stringify(carrito));
    window.dispatchEvent(new Event('carritoUpdated'));
  }
}
