import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email: string = '';
  password: string = '';

  submit(): any {
    if(this.email && this.password) {
      console.log(`Login attempted with user: ${this.email}`)
    }
  }
}
