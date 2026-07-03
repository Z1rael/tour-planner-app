import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStore } from '../services/auth.store.service';

/*
 attaches JWT token from AuthStore to every outgoing HTTP request
 public endpoints (/auth/register, /auth/login, /geocode) work without token
 bc backend permits them -> header ignored there
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);
  const token = authStore.token();

  // Don't attach token to auth endpoints
  if (req.url.includes('/auth/') || req.url.includes('/geocode')) {
    return next(req);
  }

  if (!token) {
    return next(req);
  }

  const authedReq = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });

  return next(authedReq);
};
