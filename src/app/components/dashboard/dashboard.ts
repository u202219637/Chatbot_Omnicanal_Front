import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  kpis: any = null;
  loading = true;

  constructor(
    private router: Router,
    private http: HttpClient,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.http.get<any>(`${environment.apiUrl}/admin/dashboard/kpis`).subscribe({
      next: data => { this.kpis = data; this.loading = false; },
      error: ()   => { this.loading = false; }
    });
  }

  irCatalogo()    { this.router.navigate(['/catalogo']); }
  irRag()         { this.router.navigate(['/rag']); }
  irEscalaciones(){ this.router.navigate(['/escalaciones']); }
  logout()        { this.auth.logout(); }
}
