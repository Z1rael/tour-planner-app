import { Component, inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RegisterRequest } from '../../models/register-request';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private service = inject(UserService);
  private router = inject(Router);

  public email: string = '';
  public password: string = '';
  public confirmPassword: string = '';

  submit() {
    // make sure the passwords are equal
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    // build request
    const request: RegisterRequest = {
      email: this.email,
      password: this.password,
      passwordRepeat: this.confirmPassword
    }

    // send request
    this.service.register(request).subscribe({
      next: () => this.router.navigate(['/profile']),
      error: (err: Error) => alert(err.message),
    });
  }
}
