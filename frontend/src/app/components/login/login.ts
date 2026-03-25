import { Component, signal } from '@angular/core';
import { LoginForm } from './models';
import { email, form, FormField, required } from '@angular/forms/signals';
import { debounce } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormField],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
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

    const credentials = this.loginModel();

    console.log('Logging in with: ', credentials);
  }
}
