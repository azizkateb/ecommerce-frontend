import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Backend } from '../backend';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [RouterLink,FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  constructor(private router: Router , private backend: Backend) {}

  data = {
    email: "",
    password: "",
    name: ""
  };
  onRegister() {
    // Handle form submission logic here
    console.log(this.data);
    this.backend.register(this.data).subscribe(
      (res) => {
        console.log('Registration successful:', res);
        this.router.navigate(['/login']);
      },
      (err) => {
        console.error('Registration failed:', err);
      }
    )

  }
}
