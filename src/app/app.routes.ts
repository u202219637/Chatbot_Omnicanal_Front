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
