import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';

export interface User {
  id: number;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface AuthResponse {
  user: Omit<User, 'passwordHash'>;
  token: string;
}

const MOCK_DELAY = 300;
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

//TODO: some sort of local Storage
const mockUsers: User[] = [
  {
    id: 1,
    email: 'dino@example.com',
    passwordHash: 'pwd123',
    createdAt: new Date('2026-01-01').toISOString(),
  },
  {
    id: 2,
    email: 'bronto@example.com',
    passwordHash: 'pwd123',
    createdAt: new Date('2026-01-02').toISOString(),
  },
];

@Injectable({
  providedIn: 'root',
})
export class MockUserService {
  private _users: User[] = structuredClone(mockUsers);
  private _currentUser: Omit<User, 'passwordHash'> | null = null;
  private nextUserId = Math.max(...this._users.map((u) => u.id)) + 1;

  constructor() {
    console.log('Mock User API service instantiated');
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return from(this.mockLogin(email, password));
  }

  register(email: string, password: string): Observable<AuthResponse> {
    return from(this.mockRegister(email, password));
  }

  logout(): Observable<void> {
    return from(this.mockLogout());
  }

  getCurrentUser(): Observable<Omit<User, 'passwordHash'> | null> {
    return from(this.mockGetCurrentUser());
  }

  private async mockLogin(email: string, password: string): Promise<AuthResponse> {
    await delay(MOCK_DELAY);
    const user = this._users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === password,
    );
    if (!user) throw new Error('Invalid email or password');
    const { passwordHash, ...safeUser } = user;
    this._currentUser = safeUser;
    return { user: structuredClone(safeUser), token: this.generateMockToken(user.id) };
  }

  private async mockRegister(email: string, password: string): Promise<AuthResponse> {
    await delay(MOCK_DELAY);
    const exists = this._users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) throw new Error(`An account with email ${email} already exists`);
    const newUser: User = {
      id: this.nextUserId++,
      email,
      passwordHash: password,
      createdAt: new Date().toISOString(),
    };
    this._users.push(newUser);
    const { passwordHash, ...safeUser } = newUser;
    this._currentUser = safeUser;
    return { user: structuredClone(safeUser), token: this.generateMockToken(newUser.id) };
  }

  private async mockLogout(): Promise<void> {
    await delay(MOCK_DELAY);
    this._currentUser = null;
  }

  private async mockGetCurrentUser(): Promise<Omit<User, 'passwordHash'> | null> {
    await delay(MOCK_DELAY);
    return this._currentUser ? structuredClone(this._currentUser) : null;
  }

  private generateMockToken(userId: number): string {
    return `mock-jwt-token-${userId}-${Date.now()}`;
  }

  resetMockData(): void {
    this._users = structuredClone(mockUsers);
    this._currentUser = null;
    this.nextUserId = Math.max(...this._users.map((u) => u.id)) + 1;
  }
}
