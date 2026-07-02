import { Component, inject, signal } from '@angular/core';
import { LoginForm } from './models';
import { email, form, FormField, required } from '@angular/forms/signals';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { LoginRequest } from '../../models/login-request';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormField],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private userService = inject(UserService);
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

    // validate user input
    if (this.loginForm.email().invalid() || this.loginForm.password().invalid()) {
      return;
    }

    // create request object
    const request: LoginRequest = {
      email: this.loginModel().email,
      password: this.loginModel().password
    };

    this.userService.login(request).subscribe({
      next: () => this.router.navigate(['/profile']),
      error: (err: Error) => alert(err.message),
    });
  }
}
