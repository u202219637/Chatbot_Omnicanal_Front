import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private url = environment.apiUrl;
  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.url}/login`, { username, password }).pipe(
      tap(res => {
        localStorage.setItem('token',    res.jwttoken);
        localStorage.setItem('username', res.username);
        localStorage.setItem('rol',      res.rol);
      })
    );
  }

  registro(data: any): Observable<void> {
    return this.http.post<void>(`${this.url}/usuarios`, data);
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean { return !!localStorage.getItem('token'); }
  getRol():      string { return localStorage.getItem('rol')      || ''; }
  getUsername(): string { return localStorage.getItem('username') || ''; }
  isAdmin():     boolean { return this.getRol() === 'ADMINISTRADOR'; }
}
