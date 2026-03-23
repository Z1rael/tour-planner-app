import { Component, Input } from '@angular/core';
import { RegisterService } from '../../services/register-service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private RegisterService = inject(RegisterService);
  private Router = inject(Router);

  public email: string = '';
  public password: string = '';
  public confirmPassword: string = '';

  submit(){
    if(this.password !== this.confirmPassword){
      alert("Passwords do not match!");
      return;
    }
    this.RegisterService.register(this.email, this.password, this.confirmPassword)/*.subscribe({
      next: (response) => {
        alert("Registration successful! Please log in.");
        this.Router.navigate(['/login']);
      },
      error: (error) => {
        alert("Registration failed: " + error.error.message);
      }
    });*/
  }
}
