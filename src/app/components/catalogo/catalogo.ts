import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css'
})
export class CatalogoComponent implements OnInit {
  productos: any[] = [];
  loading = true;
  q = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    public auth: AuthService
  ) {}

  ngOnInit() { this.cargar(); }

  cargar() {
    this.loading = true;
    const params = this.q ? `?q=${this.q}` : '';
    this.http.get<any[]>(`${environment.apiUrl}/productos${params}`)
      .subscribe({
        next: data => { this.productos = data; this.loading = false; },
        error: ()   => { this.loading = false; }
      });
  }

  buscar() { this.cargar(); }
  verDetalle(id: number) { this.router.navigate(['/detalle', id]); }
  irChat()   { this.router.navigate(['/chat']); }
  logout()   { this.auth.logout(); }

  emoji(categoria: string): string {
    const map: any = { 'Laptops':'💻', 'Periféricos':'🖱️', 'Monitores':'🖥️', 'Accesorios':'🎒' };
    return map[categoria] || '📦';
  }
}
