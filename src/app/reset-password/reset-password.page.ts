import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage {
  constructor(private router: Router) {}

  resetPassword() {
    // Aquí implementarías la lógica de restablecimiento de contraseña
    this.router.navigate(['/login']);
  }
}
