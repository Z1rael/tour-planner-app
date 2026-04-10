import { Component, inject, signal } from '@angular/core';
import { LoginForm } from './models';
import { email, form, FormField, required } from '@angular/forms/signals';
import { MockUserService } from '../../../../mock/services/mock-user-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormField],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private userService = inject(MockUserService);  // TODO: swap for real UserService
  private router = inject(Router);

  readonly loginModel = signal<LoginForm>({
    email: '',
    password: '',
    rememberMe: false,
  });

  readonly loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.email, { message: 'Email is required' });
    email(schemaPath.email, { message: 'Enter a valid email address' });
    required(schemaPath.password, { message: 'Password is required' });
  });

  onSubmit(event: Event) {
    event.preventDefault();

    if (this.loginForm.email().invalid() || this.loginForm.password().invalid()) return;

    const { email, password } = this.loginModel();

    this.userService.login(email, password).subscribe({
      next: () => this.router.navigate(['/tours']),
      error: (err: Error) => alert(err.message),
    });
  }
}
