import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const jwtInterceptor: HttpInterceptorFn = (peticion, siguiente) => {
  const authService = inject(AuthService);
  const token = authService.obtenerToken();

  if (token) {
    const peticionAutorizada = peticion.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return siguiente(peticionAutorizada);
  }

  return siguiente(peticion);
};
