import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';


/*
single source of truth for JWT token
persists to localStorage so the session survives a page refresh.
injected by the interceptor and auth service - not by components directly.
*/
@Injectable({ providedIn: 'root' })
export class AuthStore {
  private TOKEN_KEY = 'auth_token';
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private router = inject(Router)

  readonly token = signal<string | null>(this.isBrowser ? localStorage.getItem(this.TOKEN_KEY) : null);

  readonly isLoggedIn = () => this.token() !== null;


  setToken(token: string): void {
    this.token.set(token);
    if (this.isBrowser) localStorage.setItem(this.TOKEN_KEY, token);
  }

  clearToken(): void {
    this.token.set(null);
    if (this.isBrowser) localStorage.removeItem(this.TOKEN_KEY);
  }

  isTokenExpired(): boolean {
    const token = this.token();
    if (!token) {
      return true;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiryMs = payload.exp * 1000;
      return Date.now() >= expiryMs;
    } catch {
      return true
    }
  }

  logout(reason?: 'expired' | 'manual'): void {
    this.clearToken();
    this.router.navigate(['login'], {
      queryParams: reason ? { reason } : {}
    });
  }
}
