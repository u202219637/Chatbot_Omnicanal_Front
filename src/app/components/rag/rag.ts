import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-rag',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rag.html',
  styleUrl: './rag.css'
})
export class RagComponent implements OnInit {
  documentos: any[] = [];
  loading = true;

  constructor(
    private router: Router,
    private http: HttpClient,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.http.get<any[]>(`${environment.apiUrl}/admin/documentos`).subscribe({
      next: data => { this.documentos = data; this.loading = false; },
      error: ()   => { this.loading = false; }
    });
  }

  volver()  { this.router.navigate(['/dashboard']); }
  logout()  { this.auth.logout(); }
}
