import { Component } from '@angular/core';
import { Router , RouterLink } from '@angular/router';
import { Backend } from '../backend';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [RouterLink,FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  constructor(private router: Router , private backend: Backend) {}

  data = {
    email: '',
    password: '',
  };


  onLogin() {
    // Logic for authentication
    console.log('Login attempt');
    this.backend.login(this.data).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Login failed', err);
      }
    });
  }
}
