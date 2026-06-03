import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../shared/navbar/navbar';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-escalaciones',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './escalaciones.html',
  styleUrl: './escalaciones.css'
})
export class EscalacionesComponent implements OnInit {
  escalaciones: any[] = [];
  loading = true;

  constructor(private http: HttpClient, public auth: AuthService) {}

  ngOnInit() {
    this.http.get<any[]>(`${environment.apiUrl}/escalaciones`).subscribe({
      next: d => { this.escalaciones = d; this.loading = false; },
      error: ()=> { this.loading = false; }
    });
  }
}
