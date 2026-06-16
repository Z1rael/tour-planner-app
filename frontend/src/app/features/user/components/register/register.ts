import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';

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
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    this.service
      .register({
        email: this.email,
        password: this.password,
        password_repeat: this.confirmPassword,
      })
      .subscribe({
        next: () => this.router.navigate(['/profile']),
        error: (err: Error) => alert(err.message),
      });
  }
}
