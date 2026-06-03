import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../shared/navbar/navbar';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './historial.html',
  styleUrl: './historial.css'
})
export class HistorialComponent implements OnInit {
  conversaciones: any[] = [];
  loading    = true;
  widgetOpen = false;

  constructor(private http: HttpClient, private router: Router, public auth: AuthService) {}

  ngOnInit() {
    this.http.get<any[]>(`${environment.apiUrl}/chat/historial`).subscribe({
      next: d => { this.conversaciones = d; this.loading = false; },
      error: ()=> { this.loading = false; }
    });
  }

  verChat(id: number) { this.router.navigate(['/chat'], { queryParams: { id } }); }
  logout() { this.auth.logout(); }
  formatFecha(f: string) {
    return new Date(f).toLocaleDateString('es-PE', {
      day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit'
    });
  }
  stars(n: number) { return '★'.repeat(n || 0) + '☆'.repeat(5 - (n || 0)); }
}
