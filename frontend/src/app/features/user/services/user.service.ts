import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthStore } from '../../../core/services/auth.store.service';

export interface AuthResponse {
  token: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly authStore = inject(AuthStore);
  private readonly base = `${environment.apiUrl}/auth`;

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.base}/login`, { email, password })
      .pipe(tap((res) => this.authStore.set(res.token)));
  }

  register(email: string, password: string, passwordRepeat?: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.base}/register`, {
        email,
        password,
        password_repeat: passwordRepeat ?? password,
      })
      .pipe(tap((res) => this.authStore.set(res.token)));
  }

  logout(): void {
    this.authStore.clear();
  }
}
