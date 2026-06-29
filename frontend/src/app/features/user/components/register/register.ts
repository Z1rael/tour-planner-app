import { Component, inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

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

    this.service.register(this.email, this.password, this.confirmPassword).subscribe({
      next: () => this.router.navigate(['/profile']),
      error: (err: Error) => alert(err.message),
    });
  }
}
