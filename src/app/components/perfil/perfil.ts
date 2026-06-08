import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavbarComponent } from '../shared/navbar/navbar';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class PerfilComponent implements OnInit {

  nombres   = '';
  apellidos = '';
  telefono  = '';
  correo    = '';
  username  = '';

  cargando  = true;
  guardando = false;
  exito     = false;
  error     = '';
  usuarioId: number | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() { this.cargarPerfil(); }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  cargarPerfil() {
    this.cargando = true;
    this.error    = '';

    this.http.get<any>(`${environment.apiUrl}/usuarios/miperfil`,
      { headers: this.getHeaders() }
    ).subscribe({
      next: (u) => {
        this.usuarioId = u.id;
        this.nombres   = u.nombres   || '';
        this.apellidos = u.apellidos || '';
        this.telefono  = u.telefono  || '';
        this.correo    = u.correo    || '';
        this.username  = u.username  || localStorage.getItem('username') || '';
        this.cargando  = false;
      },
      error: () => this.cargarPerfilPorUsername()
    });
  }

  private cargarPerfilPorUsername() {
    const uname = localStorage.getItem('username') || '';
    this.http.get<any[]>(`${environment.apiUrl}/usuarios`,
      { headers: this.getHeaders() }
    ).subscribe({
      next: (lista) => {
        const yo = lista.find(u => u.username === uname);
        if (yo) {
          this.usuarioId = yo.id;
          this.nombres   = yo.nombres   || '';
          this.apellidos = yo.apellidos || '';
          this.telefono  = yo.telefono  || '';
          this.correo    = yo.correo    || '';
          this.username  = yo.username  || uname;
        } else {
          this.username = uname;
          this.error = 'No se encontró tu perfil. Intenta cerrar sesión y volver a entrar.';
        }
        this.cargando = false;
      },
      error: () => {
        this.username = uname;
        this.error    = 'No se pudo cargar el perfil.';
        this.cargando = false;
      }
    });
  }

  guardarCambios() {
    if (!this.nombres.trim() || !this.apellidos.trim()) {
      this.error = 'Nombre y apellidos son obligatorios.';
      return;
    }
    this.guardando = true;
    this.error     = '';
    this.exito     = false;

    const body = {
      nombres:   this.nombres.trim(),
      apellidos: this.apellidos.trim(),
      telefono:  this.telefono.trim(),
      correo:    this.correo.trim()
    };

    this.http.put<any>(`${environment.apiUrl}/usuarios/miperfil`, body,
      { headers: this.getHeaders() }
    ).subscribe({
      next: () => { this.guardando = false; this.exito = true; setTimeout(() => this.exito = false, 3000); },
      error: (err) => {
        console.error('PUT /me falló:', err);
        if (this.usuarioId) {
          this.guardarConId(body);
        } else {
          this.error    = 'No se pudo guardar. Intenta recargar la página.';
          this.guardando = false;
        }
      }
    });
  }

  private guardarConId(body: any) {
    this.http.put<any>(`${environment.apiUrl}/usuarios/${this.usuarioId}`, body,
      { headers: this.getHeaders() }
    ).subscribe({
      next: () => { this.guardando = false; this.exito = true; setTimeout(() => this.exito = false, 3000); },
      error: (err) => {
        this.error    = `Error al guardar (${err.status}). Verifica que el endpoint existe en el backend.`;
        this.guardando = false;
      }
    });
  }
}
