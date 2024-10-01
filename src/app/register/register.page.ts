import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  email: string = '';
  password: string = '';
  name: string = '';
  lastName: string = '';
  phoneNumber: string = '';
  address: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {}

  // Método para validar el formato del correo electrónico
  isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular básica para correos
    return regex.test(email);
  }

  // Método para manejar el registro del usuario
  async register() {
    // Verifica que todos los campos estén completos
    if (
      this.email === '' ||
      this.password === '' ||
      this.name === '' ||
      this.lastName === '' ||
      this.phoneNumber === '' ||
      this.address === ''
    ) {
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
      // Llama al servicio de autenticación para crear un usuario con Firebase y guardar los datos adicionales
      await this.authService.register(
        this.email,
        this.password,
        this.name,
        this.lastName,
        this.phoneNumber,
        this.address
      );

      // Muestra un mensaje de éxito
      const alert = await this.alertController.create({
        header: 'Registro exitoso',
        message: 'Tu cuenta ha sido registrada con éxito',
        buttons: [{
          text: 'OK',
          handler: () => {
            // Redirige al login después de cerrar el alert
            this.router.navigate(['/login']);
          },
        }],
      });
      await alert.present();

      // Limpia los campos después del registro
      this.email = '';
      this.password = '';
      this.name = '';
      this.lastName = '';
      this.phoneNumber = '';
      this.address = '';
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
