import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const rolEsperado = route.data?.['rol'];
  const rolActual = authService.obtenerRol();

  if (authService.estaAutenticado() && rolActual === rolEsperado) {
    return true;
  }

  router.navigate(['/']);
  return false;
};
