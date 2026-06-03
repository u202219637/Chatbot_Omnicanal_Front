import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial.html',
  styleUrl: './historial.css'
})
export class HistorialComponent implements OnInit {
  historial: any[] = [];
  loading = true;

  constructor(
    private router: Router,
    private http: HttpClient,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.http.get<any[]>(`${environment.apiUrl}/chat/historial`).subscribe({
      next: data => { this.historial = data; this.loading = false; },
      error: ()   => { this.loading = false; }
    });
  }

  volver()  { this.router.navigate(['/catalogo']); }
  logout()  { this.auth.logout(); }
}
