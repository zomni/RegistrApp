import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  email: string = '';
  username: string = '';
  password: string = '';

  constructor(private router: Router, private alertController: AlertController) {}

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async register() {
    if (this.email === '' || this.username === '' || this.password === '') {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor, completa todos los campos',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    if (!this.isValidEmail(this.email)) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor, ingresa un correo válido',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    const alert = await this.alertController.create({
      header: 'Registro exitoso',
      message: 'Tu cuenta ha sido registrada con éxito',
      buttons: ['OK'],
    });
    await alert.present();

    this.email = '';
    this.username = '';
    this.password = '';

    this.router.navigate(['/login']);
  }
}
