import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  constructor(private router: Router) {}

  register() {
    // Aquí implementarías la lógica de registro
    this.router.navigate(['/login']);
  }
}
