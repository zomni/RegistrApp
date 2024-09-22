import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service'; // Importa el servicio de autenticación

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  email: string = '';
  username: string = '';
  password: string = '';

  constructor(
    private router: Router, 
    private alertController: AlertController,
    private authService: AuthService // Inyecta el servicio de autenticación
  ) {}

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async register() {
    // Verifica que todos los campos estén completos
    if (this.email === '' || this.username === '' || this.password === '') {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor, completa todos los campos',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    // Verifica que el correo tenga un formato válido
    if (!this.isValidEmail(this.email)) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor, ingresa un correo válido',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    try {
      // Llama al servicio de autenticación para crear un usuario con Firebase
      const user = await this.authService.register(this.email, this.password);

      // Muestra un mensaje de éxito
      const alert = await this.alertController.create({
        header: 'Registro exitoso',
        message: 'Tu cuenta ha sido registrada con éxito',
        buttons: ['OK'],
      });
      await alert.present();

      // Limpia los campos después del registro
      this.email = '';
      this.username = '';
      this.password = '';

      // Redirige al login después de registrar al usuario
      this.router.navigate(['/login']);

    } catch (error) {
      // Convierte el error a tipo Error y muestra el mensaje de Firebase
      const errorMessage = (error as Error).message;

      const alert = await this.alertController.create({
        header: 'Error',
        message: errorMessage,
        buttons: ['OK'],
      });
      await alert.present();
    }
  }
}
