import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const TOKEN_KEY = 'auth_token';

/*
 single source of truth for JWT token
 persists to localStorage so the session survives a page refresh.
 injected by the interceptor and auth service - not by components directly.
 */
@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly token = signal<string | null>(this.isBrowser ? localStorage.getItem(TOKEN_KEY) : null);

  readonly isLoggedIn = () => this.token() !== null;

  set(token: string): void {
    this.token.set(token);
    if (this.isBrowser) localStorage.setItem(TOKEN_KEY, token);
  }

  clear(): void {
    this.token.set(null);
    if (this.isBrowser) localStorage.removeItem(TOKEN_KEY);
  }
}
