import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class RegisterService {
  public register(email: string, password: string, confirmPassword: string) {
    // Implementation for registration logic
    console.log(`Registering user with email: ${email}`);
    return true;
  }
}
