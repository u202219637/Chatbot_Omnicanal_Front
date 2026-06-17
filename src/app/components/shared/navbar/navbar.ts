import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
<header style="
  position:fixed;top:0;left:0;right:0;z-index:500;
  height:64px;background:rgba(255,255,255,.96);
  backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);
  border-bottom:1px solid var(--line);
  display:flex;align-items:center;padding:0 28px;gap:0;
  box-shadow:0 1px 12px rgba(15,23,42,.06)">

  <!-- BRAND -->
  <a routerLink="/landing" style="display:flex;align-items:center;gap:10px;
     font-weight:900;font-size:19px;color:var(--p);margin-right:8px;flex-shrink:0;
     text-decoration:none">
    <div style="width:36px;height:36px;border-radius:10px;font-size:17px;font-weight:900;
                background:linear-gradient(135deg,var(--p),var(--p2));color:#fff;
                display:flex;align-items:center;justify-content:center">S</div>
    ShadowByte
  </a>

  <nav style="display:flex;gap:0;flex:1;height:64px;align-items:center;margin-left:8px">

    <!-- CATÁLOGO con megamenú — solo CLIENTE y ADMIN -->
    <div *ngIf="!isAsesor()"
         class="nav-dropdown" style="position:relative;height:64px;display:flex;align-items:center">
      <a routerLink="/catalogo" routerLinkActive="nav-active"
         class="nav-item" style="display:flex;align-items:center;gap:4px;height:64px">
        Catálogo
        <span style="font-size:10px;opacity:.6">▾</span>
      </a>
      <div class="mega-menu" style="
        display:none;position:absolute;top:64px;left:-20px;
        background:#fff;border:1px solid var(--line);border-radius:0 0 18px 18px;
        box-shadow:0 12px 40px rgba(15,23,42,.12);
        padding:28px;width:680px;z-index:600;
        grid-template-columns:repeat(4,1fr);gap:24px">
        <div>
          <div style="font-size:11px;font-weight:900;text-transform:uppercase;
                      letter-spacing:.08em;color:var(--muted);margin-bottom:12px">Cómputo</div>
          <a routerLink="/catalogo" [queryParams]="{categoria:'Laptops'}" class="mega-link">Laptops</a>
          <a routerLink="/catalogo" [queryParams]="{categoria:'Laptops'}" class="mega-link">Laptops Gaming</a>
          <a routerLink="/catalogo" [queryParams]="{categoria:'Laptops'}" class="mega-link">Laptops Empresariales</a>
          <a routerLink="/catalogo" class="mega-link">Ver todo →</a>
        </div>
        <div>
          <div style="font-size:11px;font-weight:900;text-transform:uppercase;
                      letter-spacing:.08em;color:var(--muted);margin-bottom:12px">Periféricos</div>
          <a routerLink="/catalogo" [queryParams]="{categoria:'Periféricos'}" class="mega-link">Mouse</a>
          <a routerLink="/catalogo" [queryParams]="{categoria:'Periféricos'}" class="mega-link">Teclados</a>
          <a routerLink="/catalogo" [queryParams]="{categoria:'Periféricos'}" class="mega-link">Webcams</a>
          <a routerLink="/catalogo" [queryParams]="{categoria:'Periféricos'}" class="mega-link">Headsets</a>
          <a routerLink="/catalogo" class="mega-link">Ver todo →</a>
        </div>
        <div>
          <div style="font-size:11px;font-weight:900;text-transform:uppercase;
                      letter-spacing:.08em;color:var(--muted);margin-bottom:12px">Monitores</div>
          <a routerLink="/catalogo" [queryParams]="{categoria:'Monitores'}" class="mega-link">Monitores FHD</a>
          <a routerLink="/catalogo" [queryParams]="{categoria:'Monitores'}" class="mega-link">Monitores QHD/4K</a>
          <a routerLink="/catalogo" [queryParams]="{categoria:'Monitores'}" class="mega-link">Monitores Gaming</a>
          <a routerLink="/catalogo" class="mega-link">Ver todo →</a>
        </div>
        <div>
          <div style="font-size:11px;font-weight:900;text-transform:uppercase;
                      letter-spacing:.08em;color:var(--muted);margin-bottom:12px">Almacenamiento</div>
          <a routerLink="/catalogo" [queryParams]="{categoria:'Almacenamiento'}" class="mega-link">SSD NVMe</a>
          <a routerLink="/catalogo" [queryParams]="{categoria:'Almacenamiento'}" class="mega-link">SSD SATA</a>
          <a routerLink="/catalogo" [queryParams]="{categoria:'Almacenamiento'}" class="mega-link">Memorias RAM</a>
          <a routerLink="/catalogo" class="mega-link">Ver todo →</a>
        </div>
        <div style="grid-column:1/-1;border-top:1px solid var(--line);padding-top:16px;margin-top:4px">
          <div style="font-size:11px;font-weight:900;text-transform:uppercase;
                      letter-spacing:.08em;color:var(--muted);margin-bottom:10px">Marcas destacadas</div>
          <div style="display:flex;gap:16px;flex-wrap:wrap">
            <span *ngFor="let m of ['Dell','HP','Lenovo','ASUS','Apple','Logitech','Kingston']"
              style="font-size:14px;font-weight:800;color:#475569;cursor:pointer;
                     padding:4px 10px;border-radius:6px;border:1px solid var(--line)"
              (click)="irCatalogo(m)">{{ m }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- CHAT IA — solo CLIENTE -->
    <a *ngIf="isCliente()"
       routerLink="/chat" routerLinkActive="nav-active" class="nav-item">Chat IA</a>

    <!-- HISTORIAL — solo CLIENTE -->
    <a *ngIf="isCliente()"
       routerLink="/historial" routerLinkActive="nav-active" class="nav-item">Historial</a>

    <!-- ASESOR: Catálogo + Panel de Atención + Mis Métricas -->
    <ng-container *ngIf="isAsesor()">
      <a routerLink="/catalogo" routerLinkActive="nav-active" class="nav-item">Catálogo</a>
      <a routerLink="/escalaciones" routerLinkActive="nav-active" class="nav-item nav-item--destacado">
        🧑‍💼 Panel de Atención
      </a>
      <a routerLink="/mis-metricas" routerLinkActive="nav-active" class="nav-item">
        📊 Mis Métricas
      </a>
    </ng-container>
    <!-- ADMIN links -->
    <ng-container *ngIf="auth.isAdmin()">
      <span style="width:1px;height:20px;background:var(--line);margin:0 6px"></span>
      <a routerLink="/dashboard"    routerLinkActive="nav-active" class="nav-item">Dashboard</a>
      <a routerLink="/rag"          routerLinkActive="nav-active" class="nav-item">Base RAG</a>
      <a routerLink="/escalaciones" routerLinkActive="nav-active" class="nav-item">Escalaciones</a>
    </ng-container>

  </nav>

  <!-- CARRITO — solo CLIENTE y ADMIN -->
  <a *ngIf="!isAsesor()" routerLink="/carrito"
     style="position:relative;display:flex;align-items:center;justify-content:center;
            width:40px;height:40px;border-radius:10px;border:1px solid var(--line);
            background:var(--white);cursor:pointer;text-decoration:none;font-size:18px;
            margin-right:6px">
    🛒
    <span *ngIf="cartCount > 0"
      style="position:absolute;top:-6px;right:-6px;
             background:var(--red);color:#fff;
             font-size:10px;font-weight:900;min-width:18px;height:18px;
             border-radius:999px;display:flex;align-items:center;justify-content:center;
             border:2px solid #fff">{{ cartCount }}</span>
  </a>

  <!-- USER MENU -->
  <div style="display:flex;align-items:center;gap:10px;flex-shrink:0;position:relative">
    <button style="display:flex;align-items:center;gap:8px;padding:8px 14px;
                   border-radius:10px;border:1px solid var(--line);background:var(--white);
                   cursor:pointer;font-family:inherit" (click)="toggleMenu()">
      <div style="width:32px;height:32px;border-radius:50%;font-size:13px;font-weight:900;
                  background:linear-gradient(135deg,var(--p),var(--p2));color:#fff;
                  display:flex;align-items:center;justify-content:center">
        {{ auth.getUsername().substring(0,2).toUpperCase() }}
      </div>
      <span style="font-size:13px;font-weight:700">{{ auth.getUsername() }}</span>
      <span style="font-size:11px;color:var(--muted)">▾</span>
    </button>

    <div *ngIf="menuOpen" style="position:absolute;top:52px;right:0;
         background:#fff;border:1px solid var(--line);border-radius:14px;
         box-shadow:0 8px 32px rgba(15,23,42,.12);padding:8px;min-width:180px;z-index:600">

      <div style="padding:10px 14px;font-size:12px;color:var(--muted);font-weight:700;
                  border-bottom:1px solid var(--line);margin-bottom:6px;text-transform:uppercase;
                  letter-spacing:.06em">
        {{ auth.getRol() }}
      </div>

      <!-- Mi perfil — todos -->
      <a routerLink="/perfil" (click)="menuOpen=false"
         style="display:flex;align-items:center;gap:10px;padding:10px 14px;
                border-radius:10px;font-size:14px;font-weight:700;color:var(--ink);
                cursor:pointer;text-decoration:none">
        👤 Mi perfil
      </a>

      <!-- Panel de Atención — solo ASESOR -->
      <a *ngIf="isAsesor()" routerLink="/escalaciones" (click)="menuOpen=false"
         style="display:flex;align-items:center;gap:10px;padding:10px 14px;
                border-radius:10px;font-size:14px;font-weight:700;color:var(--p);
                cursor:pointer;text-decoration:none">
        🧑‍💼 Panel de Atención
      </a>
        <a routerLink="/mis-metricas" *ngIf="isAsesor()" (click)="menuOpen=false"
          style="display:flex;align-items:center;gap:10px;padding:10px 14px;
                  border-radius:10px;font-size:14px;font-weight:700;color:var(--ink);
                  cursor:pointer;text-decoration:none">
          📊 Mis Métricas
        </a>

      <!-- Mis conversaciones — solo CLIENTE -->
      <a *ngIf="isCliente()" routerLink="/historial" (click)="menuOpen=false"
         style="display:flex;align-items:center;gap:10px;padding:10px 14px;
                border-radius:10px;font-size:14px;font-weight:700;color:var(--ink);
                cursor:pointer;text-decoration:none">
        💬 Mis conversaciones
      </a>

      <!-- Carrito — CLIENTE y ADMIN -->
      <a *ngIf="!isAsesor()" routerLink="/carrito" (click)="menuOpen=false"
         style="display:flex;align-items:center;gap:10px;padding:10px 14px;
                border-radius:10px;font-size:14px;font-weight:700;color:var(--ink);
                cursor:pointer;text-decoration:none">
        🛒 Mi carrito
        <span *ngIf="cartCount > 0"
          style="margin-left:auto;background:var(--red);color:#fff;
                 font-size:10px;font-weight:900;min-width:18px;height:18px;
                 border-radius:999px;display:flex;align-items:center;justify-content:center;padding:0 4px">
          {{ cartCount }}
        </span>
      </a>

      <div style="border-top:1px solid var(--line);margin:6px 0;padding-top:6px">
        <button (click)="logout()"
          style="width:100%;display:flex;align-items:center;gap:10px;padding:10px 14px;
                 border-radius:10px;font-size:14px;font-weight:700;color:var(--red);
                 background:none;border:none;cursor:pointer;font-family:inherit;text-align:left">
          Cerrar sesión
        </button>
      </div>
    </div>
  </div>
</header>
<div style="height:64px"></div>
  `,
  styles: [`
    .nav-item {
      padding:0 16px;height:64px;
      display:inline-flex;align-items:center;
      font-size:14px;font-weight:700;color:var(--muted);
      cursor:pointer;transition:color .15s;
      text-decoration:none;white-space:nowrap;
    }
    .nav-item:hover { color:var(--p); }
    .nav-active     { color:var(--p) !important; box-shadow:inset 0 -2px 0 var(--p); }

    .nav-item--destacado {
      color:var(--p) !important;
      background:var(--p3);
      border-radius:10px;
      margin:0 4px;
      height:40px !important;
      padding:0 16px;
    }

    .nav-dropdown:hover .mega-menu { display:grid !important; }
    .nav-dropdown:hover > .nav-item { color:var(--p); }

    .mega-link {
      display:block;font-size:13px;font-weight:600;
      color:#475569;padding:6px 0;cursor:pointer;
      text-decoration:none;transition:color .15s;
    }
    .mega-link:hover { color:var(--p); }
  `]
})
export class NavbarComponent implements OnDestroy {
  menuOpen  = false;
  cartCount = 0;
  private cartListener = () => this.updateCart();

  constructor(public auth: AuthService, private router: Router) {
    this.updateCart();
    window.addEventListener('carritoUpdated', this.cartListener);
  }

  ngOnDestroy() { window.removeEventListener('carritoUpdated', this.cartListener); }

  updateCart() {
    const items = JSON.parse(localStorage.getItem('carrito') || '[]');
    this.cartCount = items.reduce((s: number, i: any) => s + (i.cantidad || 1), 0);
  }

  toggleMenu() { this.menuOpen = !this.menuOpen; }
  logout()     { this.menuOpen = false; this.auth.logout(); }
  irCatalogo(marca: string) { this.router.navigate(['/catalogo'], { queryParams: { marca } }); }

  isCliente(): boolean { return this.auth.getRol() === 'CLIENTE'; }
  isAsesor():  boolean { return this.auth.getRol() === 'ASESOR'; }
}