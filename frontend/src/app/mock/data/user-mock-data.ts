import {User} from '../services/mock-user-service';

export const mockUsers: User[] = [
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
