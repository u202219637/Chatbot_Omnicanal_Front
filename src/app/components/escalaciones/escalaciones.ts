import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-escalaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './escalaciones.html',
  styleUrl: './escalaciones.css'
})
export class EscalacionesComponent implements OnInit {
  escalaciones: any[] = [];
  loading = true;

  constructor(
    private router: Router,
    private http: HttpClient,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.http.get<any[]>(`${environment.apiUrl}/escalaciones`).subscribe({
      next: data => { this.escalaciones = data; this.loading = false; },
      error: ()   => { this.loading = false; }
    });
  }

  volver()  { this.router.navigate(['/catalogo']); }
  logout()  { this.auth.logout(); }
}
