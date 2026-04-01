import { Component, Input } from '@angular/core';
import { UserService } from '../../services/user.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private service = inject(UserService);
  private Router = inject(Router);

  public email: string = '';
  public password: string = '';
  public confirmPassword: string = '';

  submit() {
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
  }
}
