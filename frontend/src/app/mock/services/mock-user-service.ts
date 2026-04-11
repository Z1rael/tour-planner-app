import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import { from, Observable } from 'rxjs';
import {isPlatformBrowser} from '@angular/common';

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
const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const STORAGE_KEYS = {
  users: 'mock_users',
  currentUser: 'mock_current_user',
  token: 'mock_token',
} as const;

const defaultUsers: User[] = [
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
  private readonly isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser && !localStorage.getItem(STORAGE_KEYS.users)) {
      localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(structuredClone(defaultUsers)));
    }
    console.log('Mock User API service instantiated');
  }

  private storageGet(key: string): string | null {
    return this.isBrowser ? localStorage.getItem(key) : null;
  }

  private storageSet(key: string, value: string): void {
    if (this.isBrowser) localStorage.setItem(key, value);
  }

  private storageRemove(key: string): void {
    if (this.isBrowser) localStorage.removeItem(key);
  }

  private getUsers(): User[] {
    const stored = this.storageGet(STORAGE_KEYS.users);
    return stored ? JSON.parse(stored) : structuredClone(defaultUsers);
  }

  private saveUsers(users: User[]): void {
    this.storageSet(STORAGE_KEYS.users, JSON.stringify(users));
  }

  private getStoredCurrentUser(): Omit<User, 'passwordHash'> | null {
    const stored = this.storageGet(STORAGE_KEYS.currentUser);
    return stored ? JSON.parse(stored) : null;
  }

  private saveCurrentUser(user: Omit<User, 'passwordHash'> | null): void {
    if (user === null) {
      this.storageRemove(STORAGE_KEYS.currentUser);
      this.storageRemove(STORAGE_KEYS.token);
    } else {
      this.storageSet(STORAGE_KEYS.currentUser, JSON.stringify(user));
    }
  }

  resetMockData(): void {
    this.storageRemove(STORAGE_KEYS.users);
    this.storageRemove(STORAGE_KEYS.currentUser);
    this.storageRemove(STORAGE_KEYS.token);
    this.storageSet(STORAGE_KEYS.users, JSON.stringify(structuredClone(defaultUsers)));
    console.log('Mock data reset to defaults');
  }

  private getNextUserId(): number {
    const users = this.getUsers();
    return users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
  }

  private generateMockToken(userId: number): string {
    return `mock-jwt-token-${userId}-${Date.now()}`;
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return from(
      (async (): Promise<AuthResponse> => {
        await delay(MOCK_DELAY);
        const users = this.getUsers();
        const user = users.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === password,
        );
        if (!user) throw new Error('Invalid email or password');
        const { passwordHash: _, ...safeUser } = user;
        this.saveCurrentUser(safeUser);
        const token = this.generateMockToken(user.id);
        localStorage.setItem(STORAGE_KEYS.token, token);
        return { user: structuredClone(safeUser), token };
      })(),
    );
  }

  register(email: string, password: string): Observable<AuthResponse> {
    return from(
      (async (): Promise<AuthResponse> => {
        await delay(MOCK_DELAY);
        const users = this.getUsers();
        const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
        if (exists) throw new Error(`An account with email ${email} already exists`);
        const newUser: User = {
          id: this.getNextUserId(),
          email,
          passwordHash: password,
          createdAt: new Date().toISOString(),
        };
        this.saveUsers([...users, newUser]);
        const { passwordHash: _, ...safeUser } = newUser;
        this.saveCurrentUser(safeUser);
        const token = this.generateMockToken(newUser.id);
        localStorage.setItem(STORAGE_KEYS.token, token);
        return { user: structuredClone(safeUser), token };
      })(),
    );
  }

  logout(): Observable<void> {
    return from(
      (async (): Promise<void> => {
        await delay(MOCK_DELAY);
        this.saveCurrentUser(null);
      })(),
    );
  }

  getCurrentUser(): Observable<Omit<User, 'passwordHash'> | null> {
    return from(
      (async (): Promise<Omit<User, 'passwordHash'> | null> => {
        await delay(MOCK_DELAY);
        return this.getStoredCurrentUser();
      })(),
    );
  }
}
