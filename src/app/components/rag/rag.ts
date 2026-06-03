import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../shared/navbar/navbar';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-rag',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './rag.html',
  styleUrl: './rag.css'
})
export class RagComponent implements OnInit {
  documentos: any[] = [];
  loading = true;

  constructor(private http: HttpClient, public auth: AuthService) {}

  ngOnInit() {
    this.http.get<any[]>(`${environment.apiUrl}/admin/documentos`).subscribe({
      next: d => { this.documentos = d; this.loading = false; },
      error: ()=> { this.loading = false; }
    });
  }
}
