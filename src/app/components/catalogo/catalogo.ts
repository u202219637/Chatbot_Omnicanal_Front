import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { forkJoin } from 'rxjs';
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
  productos: any[]  = [];
  filtrados: any[]  = [];
  categorias: any[] = [];
  marcas: any[]     = [];
  loading = true;
  widgetOpen = false;

  q                        = '';
  categoriaSeleccionada: string | null = null;
  marcaSeleccionada:     string | null = null;
  precioMin: number | null = null;
  precioMax: number | null = null;
  orden = 'recomendados';

  esAdmin = localStorage.getItem('rol') === 'ADMINISTRADOR';
  productoEditando: any = null;
  mostrarModalEdicion   = false;
  whatsappUrl = `https://api.whatsapp.com/send?phone=${environment.whatsappNumber}`;

  private httpPublic: HttpClient;

  constructor(
    private http: HttpClient,
    private backend: HttpBackend,
    private route: ActivatedRoute,
    private router: Router,
    public  auth: AuthService
  ) {
    this.httpPublic = new HttpClient(this.backend);
  }

  ngOnInit() {
    this.loading   = true;
    this.filtrados = [];
    this.productos = [];

    forkJoin({
      categorias: this.httpPublic.get<any[]>(`${environment.apiUrl}/categorias`),
      marcas:     this.httpPublic.get<any[]>(`${environment.apiUrl}/marcas`),
      productos:  this.http.get<any[]>(`${environment.apiUrl}/productos`)
    }).subscribe({
      next: ({ categorias, marcas, productos }) => {
        this.categorias = categorias;
        this.marcas     = marcas;
        this.productos  = productos;
        this.sincronizarQueryParams();
        this.loading = false;
        this.aplicarFiltros();
      },
      error: () => { this.loading = false; }
    });

    this.route.queryParams.subscribe(() => {
      if (this.productos.length > 0) {
        this.sincronizarQueryParams();
        this.aplicarFiltros();
      }
    });
  }

  cargar() {
    this.loading = true;
    const q = this.q ? `?q=${encodeURIComponent(this.q)}` : '';
    this.http.get<any[]>(`${environment.apiUrl}/productos${q}`).subscribe({
      next: d => { this.productos = d; this.aplicarFiltros(); this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  aplicarFiltros() {
    let lista = [...this.productos];

    if (this.categoriaSeleccionada) {
      const cat = this.categoriaSeleccionada;
      lista = lista.filter(p => this.normalizar(p.categoriaNombre) === this.normalizar(cat));
    }

    if (this.marcaSeleccionada) {
      const marca = this.marcaSeleccionada;
      lista = lista.filter(p => this.normalizar(p.marcaNombre) === this.normalizar(marca));
    }

    if (this.precioMin !== null) lista = lista.filter(p => p.precio >= this.precioMin!);
    if (this.precioMax !== null) lista = lista.filter(p => p.precio <= this.precioMax!);

    if (this.q?.trim()) {
      const t = this.normalizar(this.q);
      lista = lista.filter(p =>
        this.normalizar(p.nombre       || '').includes(t) ||
        this.normalizar(p.descripcion  || '').includes(t) ||
        this.normalizar(p.marcaNombre  || '').includes(t)
      );
    }

    switch (this.orden) {
      case 'precio_asc':  lista.sort((a, b) => a.precio - b.precio); break;
      case 'precio_desc': lista.sort((a, b) => b.precio - a.precio); break;
      case 'nombre':      lista.sort((a, b) => a.nombre.localeCompare(b.nombre)); break;
    }

    this.filtrados = lista;
  }

  toggleCategoria(nombre: string) {
    this.categoriaSeleccionada = this.categoriaSeleccionada === nombre ? null : nombre;
    this.aplicarFiltros();
  }

  limpiar() {
    this.q                     = '';
    this.categoriaSeleccionada = null;
    this.marcaSeleccionada     = null;
    this.precioMin             = null;
    this.precioMax             = null;
    this.orden                 = 'recomendados';
    this.router.navigate(['/catalogo']);
    this.http.get<any[]>(`${environment.apiUrl}/productos`).subscribe({
      next: prods => { this.productos = prods; this.aplicarFiltros(); }
    });
  }

  editarProducto(producto: any) {
    this.productoEditando    = { ...producto };
    this.mostrarModalEdicion = true;
  }

  guardarEdicion() {
    const id = this.productoEditando.id;
    this.http.put(`${environment.apiUrl}/productos/${id}`, this.productoEditando).subscribe({
      next: () => { this.mostrarModalEdicion = false; this.cargar(); },
      error: (err) => console.error('Error al actualizar producto', err)
    });
  }

  verDetalle(id: number) { this.router.navigate(['/detalle', id]); }

  countCat(nombre: string)  { return this.productos.filter(p => p.categoriaNombre === nombre).length; }
  countMarca(nombre: string){ return this.productos.filter(p => p.marcaNombre === nombre).length; }

  private sincronizarQueryParams() {
    const params = this.route.snapshot.queryParamMap;
    const cat    = params.get('categoria');
    const marca  = params.get('marca');
    this.categoriaSeleccionada = cat   || null;
    this.marcaSeleccionada     = marca || null;
  }

  private normalizar(v = ''): string {
    return v.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  }

  emoji(cat: string): string {
    const m: any = { Laptops: '💻', 'Periféricos': '🖱️', Monitores: '🖥️', Almacenamiento: '💾', Accesorios: '🎒' };
    return m[cat] || '📦';
  }

  formatPrice(p: number): string {
    if (!p) return 'S/ 0.00';
    return 'S/ ' + p.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
