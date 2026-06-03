# ShadowchatFront — README para Claude Code v2

## ESTADO ACTUAL DEL PROBLEMA
El frontend está hardcodeado, no navega, no conecta con el backend.
Este README repara TODO desde cero. Leer completo antes de ejecutar.

## TECH STACK
- Angular 19 standalone components
- Angular Material 21
- @auth0/angular-jwt
- ng2-charts + chart.js
- Backend: Spring Boot en http://localhost:8080
- Auth: JWT en localStorage key='token'

---

## PASO 1 — LIMPIAR ESTADO ACTUAL

Borrar TODOS los archivos dentro de src/app/components/ y recrearlos.
Mantener: models/, services/, guards/, interceptors/, environments/.

---

## PASO 2 — DESIGN TOKENS (copiar en styles.css)

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

:root {
  --p:     #2f28a8;
  --p2:    #5b50e8;
  --ink:   #0f172a;
  --muted: #64748b;
  --line:  #e6eaf2;
  --soft:  #f8f9fc;
  --softp: #f0efff;
  --green: #16a34a;
  --orange:#f59e0b;
  --red:   #ef4444;
  --blue:  #2563eb;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  font-family: Inter, system-ui, -apple-system, sans-serif;
  background: #fff;
  color: var(--ink);
}

/* HEADER */
.sb-header {
  height: 72px;
  display: flex;
  align-items: center;
  padding: 0 28px;
  border-bottom: 1px solid var(--line);
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 100;
}
.sb-brand {
  display: flex;
  align-items: center;
  gap: 13px;
  font-weight: 900;
  font-size: 24px;
  color: var(--p);
  text-decoration: none;
}
.sb-logo {
  width: 42px; height: 42px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--p), var(--p2));
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 20px;
}
.sb-spacer { flex: 1; }
.sb-user { display: flex; gap: 12px; align-items: center; color: #475569; font-weight: 700; }
.sb-avatar {
  width: 40px; height: 40px;
  border-radius: 50%;
  border: 2px solid var(--ink);
  display: flex; align-items: center; justify-content: center;
  font-weight: 900; font-size: 14px;
}

/* BUTTONS */
.btn-primary {
  display: inline-flex; align-items: center; gap: 9px;
  padding: 13px 22px;
  border-radius: 12px;
  font-weight: 900; font-size: 15px;
  background: linear-gradient(135deg, var(--p), var(--p2));
  color: #fff;
  border: none; cursor: pointer;
  transition: opacity .2s;
}
.btn-primary:hover { opacity: .88; }
.btn-outline {
  display: inline-flex; align-items: center; gap: 9px;
  padding: 13px 22px;
  border-radius: 12px;
  font-weight: 900; font-size: 15px;
  background: #fff;
  color: var(--p);
  border: 1.5px solid #c8c4ff;
  cursor: pointer;
}

/* CARDS */
.sb-card {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 22px;
  box-shadow: 0 10px 28px rgba(15,23,42,.04);
  padding: 24px;
}

/* PRODUCT GRID */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 18px;
}
.product-card {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 22px;
  padding: 16px;
  cursor: pointer;
  transition: box-shadow .2s, transform .2s;
}
.product-card:hover {
  box-shadow: 0 16px 40px rgba(47,40,168,.12);
  transform: translateY(-3px);
}
.product-img {
  height: 140px;
  border-radius: 16px;
  background: linear-gradient(135deg, #eef2ff, #e0e7ff);
  display: flex; align-items: center; justify-content: center;
  font-size: 52px;
  margin-bottom: 14px;
  overflow: hidden;
}
.product-img img { width: 100%; height: 100%; object-fit: contain; padding: 8px; }
.product-price { font-size: 21px; font-weight: 900; color: var(--p); margin: 8px 0; }
.product-name  { font-size: 14px; font-weight: 700; color: var(--ink); margin-bottom: 4px; }
.product-spec  { font-size: 12px; color: var(--muted); }

/* CHAT BUBBLES */
.bubble-bot {
  background: #f5f7fb;
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 14px 16px;
  max-width: 78%;
  font-size: 14px;
  line-height: 1.55;
  margin: 8px 0;
}
.bubble-you {
  background: var(--p);
  color: #fff;
  border-radius: 16px;
  padding: 14px 16px;
  max-width: 78%;
  margin: 8px 0 8px auto;
  font-size: 14px;
  line-height: 1.55;
}

/* TABLE */
.sb-table { border: 1px solid var(--line); border-radius: 18px; overflow: hidden; }
.sb-table-head { background: #fbfcff; padding: 14px 20px; font-size: 12px; font-weight: 900; text-transform: uppercase; color: #475569; }
.sb-table-row { padding: 16px 20px; border-top: 1px solid var(--line); font-size: 14px; display: flex; align-items: center; gap: 16px; }

/* BADGES */
.badge-green  { background: #dcfce7; color: #15803d; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 700; }
.badge-orange { background: #fef3c7; color: #b45309; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 700; }
.badge-red    { background: #fee2e2; color: #be123c; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 700; }
.badge-blue   { background: #dbeafe; color: #1d4ed8; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 700; }

/* FLOATING CHAT BUTTON */
.float-chat {
  position: fixed; right: 32px; bottom: 28px;
  width: 64px; height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--p), var(--p2));
  border: none; cursor: pointer;
  box-shadow: 0 18px 44px rgba(47,40,168,.30);
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 28px;
  z-index: 999;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .product-grid { grid-template-columns: repeat(2, 1fr); }
  .sb-header { padding: 0 16px; }
}
```

---

## PASO 3 — ENVIRONMENTS

### src/environments/environment.ts
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080'
};
```

### src/environments/environment.prod.ts
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://shadowchat-api.azurewebsites.net'
};
```

---

## PASO 4 — app.config.ts

```typescript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { routes } from './app.routes';
import { JwtInterceptor } from './interceptors/jwt.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ]
};
```

---

## PASO 5 — app.routes.ts

```typescript
import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  {
    path: 'landing',
    loadComponent: () => import('./components/landing/landing').then(m => m.LandingComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'registro',
    loadComponent: () => import('./components/registro/registro').then(m => m.RegistroComponent)
  },
  {
    path: 'catalogo',
    loadComponent: () => import('./components/catalogo/catalogo').then(m => m.CatalogoComponent),
    canActivate: [authGuard]
  },
  {
    path: 'detalle/:id',
    loadComponent: () => import('./components/detalle/detalle').then(m => m.DetalleComponent),
    canActivate: [authGuard]
  },
  {
    path: 'chat',
    loadComponent: () => import('./components/chat/chat').then(m => m.ChatComponent),
    canActivate: [authGuard]
  },
  {
    path: 'historial',
    loadComponent: () => import('./components/historial/historial').then(m => m.HistorialComponent),
    canActivate: [authGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard').then(m => m.DashboardComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'rag',
    loadComponent: () => import('./components/rag/rag').then(m => m.RagComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'escalaciones',
    loadComponent: () => import('./components/escalaciones/escalaciones').then(m => m.EscalacionesComponent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: 'landing' }
];
```

---

## PASO 6 — app.html

```html
<router-outlet />
```

---

## PASO 7 — INTERCEPTOR JWT

### src/app/interceptors/jwt.interceptor.ts
```typescript
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    if (token) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }
    return next.handle(req);
  }
}
```

---

## PASO 8 — GUARD

### src/app/guards/auth.guard.ts
```typescript
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  if (localStorage.getItem('token')) return true;
  router.navigate(['/login']);
  return false;
};

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  if (localStorage.getItem('rol') === 'ADMINISTRADOR') return true;
  router.navigate(['/catalogo']);
  return false;
};
```

---

## PASO 9 — AUTH SERVICE

### src/app/services/auth.service.ts
```typescript
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
```

---

## PASO 10 — COMPONENTE LANDING

### src/app/components/landing/landing.ts
```typescript
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})
export class LandingComponent {
  constructor(private router: Router) {}
  goLogin()   { this.router.navigate(['/login']); }
  goRegistro(){ this.router.navigate(['/registro']); }
}
```

### src/app/components/landing/landing.html
```html
<!-- HEADER -->
<header class="sb-header">
  <a class="sb-brand" routerLink="/landing">
    <div class="sb-logo">S</div>
    ShadowByte
  </a>
  <div class="sb-spacer"></div>
  <button class="btn-outline" style="margin-right:12px" (click)="goLogin()">Iniciar sesión</button>
  <button class="btn-primary" (click)="goLogin()">Abrir chat</button>
</header>

<!-- HERO -->
<section style="display:grid;grid-template-columns:1fr 1fr;gap:48px;padding:80px 60px;max-width:1400px;margin:0 auto;align-items:center">
  <div>
    <div style="display:inline-flex;align-items:center;gap:8px;background:#f0efff;color:#2f28a8;padding:7px 14px;border-radius:999px;font-size:13px;font-weight:700;margin-bottom:24px">
      Asistente con IA · Shadowchat
    </div>
    <h1 style="font-size:58px;line-height:1.05;letter-spacing:-.055em;color:#0f172a;margin-bottom:20px">
      Tu asistente inteligente para compras tecnológicas
    </h1>
    <p style="color:#64748b;font-size:18px;line-height:1.6;margin-bottom:36px">
      Resuelve tus dudas, compara productos y recibe recomendaciones personalizadas en segundos.
    </p>
    <div style="display:flex;gap:16px;flex-wrap:wrap">
      <button class="btn-primary" (click)="goLogin()">
        ▣ Abrir chat ahora
      </button>
      <button class="btn-outline">
        Continuar por WhatsApp
      </button>
    </div>
  </div>

  <!-- CHAT PREVIEW -->
  <div class="sb-card" style="max-width:480px">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px">
      <div style="width:46px;height:46px;border-radius:50%;background:#2f28a8;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:900">S</div>
      <div>
        <div style="font-weight:800">Shadow IA●</div>
        <div style="font-size:13px;color:#64748b">Asistente virtual para compras tecnológicas</div>
      </div>
    </div>
    <div class="bubble-bot">Hola, soy Shadow IA.<br>¿En qué puedo ayudarte hoy?</div>
    <div class="bubble-you">Necesito una laptop para diseño gráfico con buen rendimiento.</div>
    <div style="display:flex;gap:6px;padding:12px 0">
      <div style="width:8px;height:8px;border-radius:50%;background:#94a3b8"></div>
      <div style="width:8px;height:8px;border-radius:50%;background:#94a3b8"></div>
      <div style="width:8px;height:8px;border-radius:50%;background:#94a3b8"></div>
    </div>
    <div style="display:flex;align-items:center;gap:10px;border-top:1px solid #e6eaf2;padding-top:16px">
      <input style="flex:1;border:1px solid #e6eaf2;border-radius:12px;padding:12px 16px;font-family:inherit;font-size:14px;outline:none"
             placeholder="Escribe tu consulta..." (keydown.enter)="goLogin()">
      <button class="btn-primary" style="padding:12px 16px" (click)="goLogin()">➤</button>
    </div>
  </div>
</section>

<!-- FEATURES -->
<section style="padding:0 60px 80px;max-width:1400px;margin:0 auto">
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:18px">
    <div class="sb-card">
      <div style="width:58px;height:58px;border-radius:17px;background:#f0efff;color:#2f28a8;display:flex;align-items:center;justify-content:center;font-size:26px;margin-bottom:16px">▣</div>
      <div style="font-weight:800;margin-bottom:8px">Consultas inteligentes</div>
      <div style="color:#64748b;font-size:14px;line-height:1.6">Respuestas precisas sobre laptops y periféricos.</div>
    </div>
    <div class="sb-card">
      <div style="width:58px;height:58px;border-radius:17px;background:#f0efff;color:#2f28a8;display:flex;align-items:center;justify-content:center;font-size:26px;margin-bottom:16px">◎</div>
      <div style="font-weight:800;margin-bottom:8px">Recomendaciones personalizadas</div>
      <div style="color:#64748b;font-size:14px;line-height:1.6">Según tus necesidades y presupuesto.</div>
    </div>
    <div class="sb-card">
      <div style="width:58px;height:58px;border-radius:17px;background:#f0efff;color:#2f28a8;display:flex;align-items:center;justify-content:center;font-size:26px;margin-bottom:16px">✓</div>
      <div style="font-weight:800;margin-bottom:8px">Información confiable</div>
      <div style="color:#64748b;font-size:14px;line-height:1.6">Catálogo, garantías y políticas actualizadas.</div>
    </div>
  </div>
</section>

<!-- FOOTER -->
<footer style="border-top:1px solid #e6eaf2;padding:24px 60px;display:flex;align-items:center;gap:12px;color:#64748b;font-size:14px">
  <div class="sb-logo" style="width:28px;height:28px;font-size:13px;border-radius:8px">S</div>
  ShadowByte © 2025 · Lima, Perú
</footer>

<!-- FLOATING CHAT BUTTON -->
<button class="float-chat" (click)="goLogin()">💬</button>
```

---

## PASO 11 — COMPONENTE LOGIN

### src/app/components/login/login.ts
```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  username = '';
  password = '';
  loading  = false;
  error    = '';

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    if (!this.username || !this.password) {
      this.error = 'Completa todos los campos'; return;
    }
    this.loading = true; this.error = '';
    this.auth.login(this.username, this.password).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.rol === 'ADMINISTRADOR') this.router.navigate(['/dashboard']);
        else this.router.navigate(['/catalogo']);
      },
      error: () => {
        this.loading = false;
        this.error = 'Usuario o contraseña incorrectos';
      }
    });
  }
}
```

### src/app/components/login/login.html
```html
<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f8f9fc">
  <div class="sb-card" style="width:100%;max-width:420px">

    <!-- Brand -->
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:32px">
      <div class="sb-logo">S</div>
      <div>
        <div style="font-weight:900;font-size:20px;color:#2f28a8">ShadowByte</div>
        <div style="font-size:13px;color:#64748b">Ingresa a tu cuenta</div>
      </div>
    </div>

    <!-- Error -->
    <div *ngIf="error" style="background:#fee2e2;color:#be123c;padding:12px 16px;border-radius:12px;font-size:14px;margin-bottom:20px">
      {{ error }}
    </div>

    <!-- Form -->
    <div style="margin-bottom:16px">
      <label style="font-size:13px;font-weight:700;color:#475569;display:block;margin-bottom:6px">Usuario</label>
      <input [(ngModel)]="username" type="text" placeholder="Tu username"
        style="width:100%;height:48px;border:1px solid #e6eaf2;border-radius:13px;padding:0 14px;font-family:inherit;font-size:14px;outline:none"
        (keydown.enter)="login()">
    </div>

    <div style="margin-bottom:24px">
      <label style="font-size:13px;font-weight:700;color:#475569;display:block;margin-bottom:6px">Contraseña</label>
      <input [(ngModel)]="password" type="password" placeholder="Tu contraseña"
        style="width:100%;height:48px;border:1px solid #e6eaf2;border-radius:13px;padding:0 14px;font-family:inherit;font-size:14px;outline:none"
        (keydown.enter)="login()">
    </div>

    <button class="btn-primary" style="width:100%;justify-content:center;margin-bottom:16px"
      (click)="login()" [disabled]="loading">
      {{ loading ? 'Ingresando...' : 'Ingresar' }}
    </button>

    <div style="text-align:center;font-size:14px;color:#64748b">
      ¿No tienes cuenta?
      <a routerLink="/registro" style="color:#2f28a8;font-weight:700;text-decoration:none"> Regístrate</a>
    </div>
  </div>
</div>
```

---

## PASO 12 — COMPONENTE REGISTRO

### src/app/components/registro/registro.ts
```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class RegistroComponent {
  form = { nombres:'', apellidos:'', correo:'', telefono:'', username:'', password:'' };
  loading = false;
  error   = '';
  success = '';

  constructor(private auth: AuthService, private router: Router) {}

  registrar() {
    this.loading = true; this.error = '';
    this.auth.registro(this.form).subscribe({
      next: () => {
        this.loading = false;
        this.success = '¡Cuenta creada! Redirigiendo...';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: () => { this.loading = false; this.error = 'Error al crear la cuenta. El usuario o correo ya existe.'; }
    });
  }
}
```

### src/app/components/registro/registro.html
```html
<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f8f9fc;padding:40px 20px">
  <div class="sb-card" style="width:100%;max-width:480px">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:28px">
      <div class="sb-logo">S</div>
      <div>
        <div style="font-weight:900;font-size:20px;color:#2f28a8">Crear cuenta</div>
        <div style="font-size:13px;color:#64748b">ShadowByte</div>
      </div>
    </div>

    <div *ngIf="error"   style="background:#fee2e2;color:#be123c;padding:12px;border-radius:12px;font-size:14px;margin-bottom:16px">{{ error }}</div>
    <div *ngIf="success" style="background:#dcfce7;color:#15803d;padding:12px;border-radius:12px;font-size:14px;margin-bottom:16px">{{ success }}</div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px">
      <div>
        <label style="font-size:13px;font-weight:700;color:#475569;display:block;margin-bottom:6px">Nombres</label>
        <input [(ngModel)]="form.nombres" style="width:100%;height:44px;border:1px solid #e6eaf2;border-radius:12px;padding:0 12px;font-family:inherit;font-size:14px;outline:none">
      </div>
      <div>
        <label style="font-size:13px;font-weight:700;color:#475569;display:block;margin-bottom:6px">Apellidos</label>
        <input [(ngModel)]="form.apellidos" style="width:100%;height:44px;border:1px solid #e6eaf2;border-radius:12px;padding:0 12px;font-family:inherit;font-size:14px;outline:none">
      </div>
    </div>

    <div style="margin-bottom:14px">
      <label style="font-size:13px;font-weight:700;color:#475569;display:block;margin-bottom:6px">Correo</label>
      <input [(ngModel)]="form.correo" type="email" style="width:100%;height:44px;border:1px solid #e6eaf2;border-radius:12px;padding:0 12px;font-family:inherit;font-size:14px;outline:none">
    </div>

    <div style="margin-bottom:14px">
      <label style="font-size:13px;font-weight:700;color:#475569;display:block;margin-bottom:6px">Teléfono</label>
      <input [(ngModel)]="form.telefono" style="width:100%;height:44px;border:1px solid #e6eaf2;border-radius:12px;padding:0 12px;font-family:inherit;font-size:14px;outline:none">
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:24px">
      <div>
        <label style="font-size:13px;font-weight:700;color:#475569;display:block;margin-bottom:6px">Username</label>
        <input [(ngModel)]="form.username" style="width:100%;height:44px;border:1px solid #e6eaf2;border-radius:12px;padding:0 12px;font-family:inherit;font-size:14px;outline:none">
      </div>
      <div>
        <label style="font-size:13px;font-weight:700;color:#475569;display:block;margin-bottom:6px">Contraseña</label>
        <input [(ngModel)]="form.password" type="password" style="width:100%;height:44px;border:1px solid #e6eaf2;border-radius:12px;padding:0 12px;font-family:inherit;font-size:14px;outline:none">
      </div>
    </div>

    <button class="btn-primary" style="width:100%;justify-content:center;margin-bottom:16px" (click)="registrar()" [disabled]="loading">
      {{ loading ? 'Creando...' : 'Crear cuenta' }}
    </button>
    <div style="text-align:center;font-size:14px;color:#64748b">
      ¿Ya tienes cuenta? <a routerLink="/login" style="color:#2f28a8;font-weight:700;text-decoration:none">Inicia sesión</a>
    </div>
  </div>
</div>
```

---

## PASO 13 — COMPONENTE CATALOGO

### src/app/components/catalogo/catalogo.ts
```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css'
})
export class CatalogoComponent implements OnInit {
  productos: any[] = [];
  loading = true;
  q = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    public auth: AuthService
  ) {}

  ngOnInit() { this.cargar(); }

  cargar() {
    this.loading = true;
    const params = this.q ? `?q=${this.q}` : '';
    this.http.get<any[]>(`${environment.apiUrl}/productos${params}`)
      .subscribe({
        next: data => { this.productos = data; this.loading = false; },
        error: ()   => { this.loading = false; }
      });
  }

  buscar() { this.cargar(); }
  verDetalle(id: number) { this.router.navigate(['/detalle', id]); }
  irChat()   { this.router.navigate(['/chat']); }
  logout()   { this.auth.logout(); }

  emoji(categoria: string): string {
    const map: any = { 'Laptops':'💻', 'Periféricos':'🖱️', 'Monitores':'🖥️', 'Accesorios':'🎒' };
    return map[categoria] || '📦';
  }
}
```

### src/app/components/catalogo/catalogo.html
```html
<!-- HEADER -->
<header class="sb-header">
  <a class="sb-brand" [routerLink]="['/catalogo']">
    <div class="sb-logo">S</div>ShadowByte
  </a>
  <div class="sb-spacer"></div>
  <div style="display:flex;gap:10px;align-items:center">
    <button class="btn-outline" (click)="irChat()">💬 Chat IA</button>
    <div class="sb-user">
      <span>{{ auth.getUsername() }}</span>
      <div class="sb-avatar">{{ auth.getUsername().substring(0,2).toUpperCase() }}</div>
    </div>
    <button class="btn-outline" (click)="logout()">Salir</button>
  </div>
</header>

<!-- SEARCH BAR -->
<div style="padding:28px 60px 0;max-width:1400px;margin:0 auto">
  <div style="display:flex;gap:12px;margin-bottom:28px">
    <input [(ngModel)]="q" placeholder="Buscar laptops, periféricos..."
      style="flex:1;height:48px;border:1px solid #e6eaf2;border-radius:13px;padding:0 16px;font-family:inherit;font-size:14px;outline:none"
      (keydown.enter)="buscar()">
    <button class="btn-primary" (click)="buscar()">Buscar</button>
  </div>
</div>

<!-- PRODUCTOS -->
<div style="padding:0 60px 60px;max-width:1400px;margin:0 auto">

  <div *ngIf="loading" style="text-align:center;padding:80px;color:#64748b">
    Cargando productos...
  </div>

  <div *ngIf="!loading && productos.length === 0" style="text-align:center;padding:80px;color:#64748b">
    No se encontraron productos.
  </div>

  <div class="product-grid" *ngIf="!loading">
    <div class="product-card" *ngFor="let p of productos" (click)="verDetalle(p.id)">
      <div class="product-img">
        <img *ngIf="p.urlImagen" [src]="p.urlImagen" [alt]="p.nombre">
        <span *ngIf="!p.urlImagen">{{ emoji(p.categoriaNombre) }}</span>
      </div>
      <div style="font-size:11px;color:#64748b;font-weight:700;text-transform:uppercase;margin-bottom:4px">
        {{ p.categoriaNombre }} · {{ p.marcaNombre }}
      </div>
      <div class="product-name">{{ p.nombre }}</div>
      <div class="product-spec">{{ p.especResumen }}</div>
      <div class="product-price">S/ {{ p.precio | number:'1.0-0' }}</div>
      <div style="font-size:12px;color:#16a34a;font-weight:700">
        {{ p.stock > 0 ? p.stock + ' en stock' : 'Sin stock' }}
      </div>
      <button class="btn-primary" style="width:100%;justify-content:center;margin-top:12px;font-size:13px;padding:10px">
        Ver detalle
      </button>
    </div>
  </div>
</div>

<!-- FLOATING CHAT -->
<button class="float-chat" (click)="irChat()">💬</button>
```

---

## PASO 14 — COMPONENTE CHAT

### src/app/components/chat/chat.ts
```typescript
import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

interface Mensaje {
  tipo: 'bot' | 'you';
  texto: string;
  fuentes?: any[];
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})
export class ChatComponent implements AfterViewChecked {
  @ViewChild('chatBox') chatBox!: ElementRef;

  mensajes: Mensaje[] = [
    { tipo: 'bot', texto: 'Hola, soy Shadow IA 👋\n¿En qué puedo ayudarte hoy? Puedo recomendarte laptops, comparar productos e informarte sobre garantías.' }
  ];
  input   = '';
  loading = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    public auth: AuthService
  ) {}

  ngAfterViewChecked() {
    if (this.chatBox) {
      this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
    }
  }

  enviar() {
    const texto = this.input.trim();
    if (!texto || this.loading) return;
    this.input = '';
    this.mensajes.push({ tipo: 'you', texto });
    this.loading = true;
    this.mensajes.push({ tipo: 'bot', texto: '● ● ●' });

    this.http.post<any>(`${environment.apiUrl}/chat/mensaje`, {
      contenido: texto,
      origen: 'WEB'
    }).subscribe({
      next: res => {
        this.mensajes.pop();
        this.mensajes.push({
          tipo: 'bot',
          texto: res.contenido || 'Procesando tu consulta...',
          fuentes: res.fuentes || []
        });
        this.loading = false;
      },
      error: () => {
        this.mensajes.pop();
        this.mensajes.push({ tipo: 'bot', texto: 'Ocurrió un error. Por favor intenta nuevamente.' });
        this.loading = false;
      }
    });
  }

  nuevo() {
    this.mensajes = [{ tipo: 'bot', texto: 'Chat nuevo iniciado. ¿En qué puedo ayudarte?' }];
  }

  irCatalogo() { this.router.navigate(['/catalogo']); }
  logout()     { this.auth.logout(); }
}
```

### src/app/components/chat/chat.html
```html
<div style="height:100vh;display:flex;flex-direction:column;background:#f8f9fc">

  <!-- HEADER -->
  <header class="sb-header">
    <a class="sb-brand" (click)="irCatalogo()" style="cursor:pointer">
      <div class="sb-logo">S</div>ShadowByte
    </a>
    <div class="sb-spacer"></div>
    <div class="sb-user">
      <span>{{ auth.getUsername() }}</span>
      <div class="sb-avatar">{{ auth.getUsername().substring(0,2).toUpperCase() }}</div>
      <button class="btn-outline" (click)="logout()">Salir</button>
    </div>
  </header>

  <!-- CHAT LAYOUT -->
  <div style="flex:1;display:grid;grid-template-columns:260px 1fr;max-width:1400px;width:100%;margin:0 auto;height:calc(100vh - 72px)">

    <!-- SIDEBAR -->
    <aside style="border-right:1px solid #e6eaf2;padding:24px;background:#fff;overflow-y:auto">
      <div style="font-size:18px;font-weight:800;margin-bottom:16px">Consultas</div>
      <div (click)="input='¿Qué laptop me recomiendas para trabajo y estudio?'"
        style="padding:12px 14px;border-radius:13px;font-size:14px;font-weight:700;color:#475569;cursor:pointer;margin-bottom:8px;border:1px solid #e6eaf2">
        ▣ ¿Qué laptop me recomiendas?
      </div>
      <div (click)="input='Tengo un presupuesto de S/ 3,500. ¿Qué opciones me recomiendas?'"
        style="padding:12px 14px;border-radius:13px;font-size:14px;font-weight:700;color:#475569;cursor:pointer;margin-bottom:8px;border:1px solid #e6eaf2">
        ▣ Tengo S/ 3,500 de presupuesto
      </div>
      <div (click)="input='¿Cuál es la política de garantía de ShadowByte?'"
        style="padding:12px 14px;border-radius:13px;font-size:14px;font-weight:700;color:#475569;cursor:pointer;margin-bottom:8px;border:1px solid #e6eaf2">
        ▣ ¿Cuál es la garantía?
      </div>
      <div (click)="input='¿Cómo puedo continuar esta conversación por WhatsApp?'"
        style="padding:12px 14px;border-radius:13px;font-size:14px;font-weight:700;color:#475569;cursor:pointer;margin-bottom:8px;border:1px solid #e6eaf2">
        ▣ Continuar por WhatsApp
      </div>
      <button class="btn-outline" style="width:100%;justify-content:center;margin-top:16px" (click)="nuevo()">
        Nuevo chat
      </button>
    </aside>

    <!-- CHAT AREA -->
    <div style="display:flex;flex-direction:column;background:#fff">

      <!-- BOT HEADER -->
      <div style="height:72px;display:flex;align-items:center;gap:12px;padding:0 24px;border-bottom:1px solid #e6eaf2">
        <div style="width:46px;height:46px;border-radius:50%;background:#2f28a8;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:900">S</div>
        <div>
          <div style="font-weight:800">Shadow IA●</div>
          <div style="font-size:13px;color:#64748b">Asistente virtual para compras tecnológicas</div>
        </div>
      </div>

      <!-- MENSAJES -->
      <div #chatBox style="flex:1;overflow-y:auto;padding:24px;display:flex;flex-direction:column;gap:4px">
        <ng-container *ngFor="let m of mensajes">
          <div [class]="m.tipo === 'bot' ? 'bubble-bot' : 'bubble-you'"
               [innerHTML]="m.texto.replace('\n','<br>')">
          </div>
          <!-- FUENTES RAG -->
          <div *ngIf="m.fuentes && m.fuentes.length > 0" style="display:flex;gap:8px;flex-wrap:wrap;margin-top:4px">
            <span *ngFor="let f of m.fuentes"
              style="background:#f0efff;color:#2f28a8;padding:4px 10px;border-radius:999px;font-size:11px;font-weight:700">
              📄 {{ f.tituloDocumento }} ({{ f.scoreRelevancia | number:'1.0-2' }})
            </span>
          </div>
        </ng-container>
      </div>

      <!-- INPUT -->
      <div style="padding:18px 24px;border-top:1px solid #e6eaf2;display:flex;gap:12px">
        <input [(ngModel)]="input"
          style="flex:1;height:48px;border:1px solid #e6eaf2;border-radius:13px;padding:0 16px;font-family:inherit;font-size:14px;outline:none"
          placeholder="Escribe tu consulta..."
          (keydown.enter)="enviar()">
        <button class="btn-primary" (click)="enviar()" [disabled]="loading" style="padding:0 20px">
          {{ loading ? '...' : '➤' }}
        </button>
      </div>
    </div>
  </div>
</div>
```

---

## PASO 15 — COMPONENTES RESTANTES (esqueleto navegable)

Generar estos con contenido básico que permita navegar:

### detalle, historial, dashboard, rag, escalaciones
Cada uno debe tener:
1. Header con logo ShadowByte + nombre usuario + botón salir
2. Un título `<h2>` con el nombre de la sección
3. Un `<p>` con "Cargando datos..."
4. Botón "← Volver" que navega a la ruta anterior

---

## PASO 16 — VERIFICAR QUE TODO COMPILE

```bash
cd ShadowchatFront
ng build
```

Si hay errores, mostrarlos y corregirlos.

Luego:
```bash
ng serve
```

Verificar:
- localhost:4200 → muestra Landing
- localhost:4200/login → muestra Login
- Login con admin/admin123 → redirige a /dashboard
- Login con cliente → redirige a /catalogo
- /catalogo → lista productos del backend
- /chat → chatbot funcional conectado al backend

---

## RESUMEN DE ENDPOINTS BACKEND

| Pantalla | Método | URL | Auth |
|----------|--------|-----|------|
| Login | POST | /login | No |
| Registro | POST | /usuarios | No |
| Catálogo | GET | /productos?q=texto | JWT |
| Detalle | GET | /productos/{id} | JWT |
| Chat | POST | /chat/mensaje | JWT CLIENTE |
| Historial | GET | /chat/historial | JWT CLIENTE |
| Dashboard KPIs | GET | /admin/dashboard/kpis | JWT ADMIN |
| Dashboard tokens | GET | /admin/dashboard/tokens | JWT ADMIN |
| Dashboard intenciones | GET | /admin/dashboard/intenciones | JWT ADMIN |
| Escalaciones | GET | /escalaciones | JWT ASESOR/ADMIN |
| RAG lista | GET | /admin/documentos | JWT ADMIN |
| RAG upload | POST | /admin/documentos/upload | JWT ADMIN |

IMPORTANTE: El backend corre en http://localhost:8080
El frontend corre en http://localhost:4200
CORS ya está configurado en el backend para aceptar cualquier origen.
