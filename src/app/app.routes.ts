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
    canActivate: [authGuard],
    runGuardsAndResolvers: 'always'
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
  {
    path: 'carrito',
    loadComponent: () => import('./components/carrito/carrito').then(m => m.CarritoComponent),
    canActivate: [authGuard]
  },
  {
    path: 'perfil',
    loadComponent: () => import('./components/perfil/perfil').then(m => m.PerfilComponent),
    canActivate: [authGuard]
  },
  {
    path: 'atencion/:conversacionId',
    loadComponent: () => import('./components/atencion/atencion').then(m => m.AtencionComponent),
    canActivate: [authGuard]
  },
  {
  path: 'privacidad',
  loadComponent: () => import('./components/privacidad/privacidad').then(m => m.PrivacidadComponent)
  },
  { path: '**', redirectTo: 'landing' }
];
