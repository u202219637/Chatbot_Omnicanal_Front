import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../shared/navbar/navbar';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  kpis: any = null;
  intenciones: any[] = [];
  tokens: any[] = [];
  loading = true;

  constructor(private http: HttpClient, public auth: AuthService) {}

  ngOnInit() {
    this.http.get<any>(`${environment.apiUrl}/admin/dashboard/kpis`).subscribe({
      next: d => { this.kpis = d; this.loading = false; },
      error: ()=> { this.kpis = {}; this.loading = false; }
    });
    this.http.get<any[]>(`${environment.apiUrl}/admin/dashboard/intenciones`)
      .subscribe({ next: d => this.intenciones = d, error: ()=> {} });
    this.http.get<any[]>(`${environment.apiUrl}/admin/dashboard/tokens`)
      .subscribe({ next: d => this.tokens = d, error: ()=> {} });
  }
  logout() { this.auth.logout(); }
}
