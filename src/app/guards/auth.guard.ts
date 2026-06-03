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
