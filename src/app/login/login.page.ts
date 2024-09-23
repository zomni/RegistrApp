import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service'; // Importa el servicio de autenticación

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  username: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private authService: AuthService // Inyecta el servicio de autenticación
  ) {}

  async login() {
    try {
      const user = await this.authService.login(this.username, this.password);
      if (user) {
        this.router.navigate(['/hub-alumno']); // Redirige al hub si el login es exitoso
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      const alert = await this.alertController.create({
        header: 'Fallo al iniciar sesión',
        message: errorMessage, // Muestra el mensaje de error de Firebase
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  async loginWithGoogle() {
    try {
      const user = await this.authService.loginWithGoogle(); // Llama al método de autenticación de Google
      if (user) {
        this.router.navigate(['/hub-alumno']); // Redirige al hub si el login es exitoso
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      const alert = await this.alertController.create({
        header: 'Fallo al iniciar sesión con Google',
        message: errorMessage,
        buttons: ['OK'],
      });
      await alert.present();
    }
  }
}
