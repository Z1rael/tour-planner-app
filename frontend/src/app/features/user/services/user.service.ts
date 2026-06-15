import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface AuthPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends AuthPayload {
  passwordRepeat: string;
}

export interface AuthApiResponse {
  token: string;
}

export interface CurrentUser {
  id: number;
  email: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly TOKEN_KEY = 'token';

  constructor(private http: HttpClient) {}

  register(payload: RegisterPayload): Observable<AuthApiResponse> {
    return this.http
      .post<AuthApiResponse>('/api/auth/register', payload)
      .pipe(tap((res) => localStorage.setItem(this.TOKEN_KEY, res.token)));
  }

  login(email: string, password: string): Observable<AuthApiResponse> {
    return this.http
      .post<AuthApiResponse>('/api/auth/login', { email, password })
      .pipe(tap((res) => localStorage.setItem(this.TOKEN_KEY, res.token)));
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Decode the JWT payload to get basic user info without a backend round-trip.
  // The token is not verified here — that's the backend's job.
  getCurrentUser(): CurrentUser | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return { id: payload.sub, email: payload.sub, createdAt: '' };
    } catch {
      return null;
    }
  }
}
