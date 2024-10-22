import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage {
  username: string = '';

  constructor(private router: Router, private alertController: AlertController) {}

  async resetPassword() {
    const auth = getAuth();

    // Verifica que el campo de correo no esté vacío
    if (this.username === '') {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'El correo institucional debe ser ingresado.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    try {
      // Envía un correo electrónico para restablecer la contraseña
      await sendPasswordResetEmail(auth, this.username);
      const alert = await this.alertController.create({
        header: 'Correo enviado',
        message: 'Se ha enviado un correo para restablecer tu contraseña.',
        buttons: ['OK'],
      });
      await alert.present();
      this.username = ''; // Limpia el campo de entrada
      
      this.router.navigate(['/login']); // Redirige a la página de inicio de sesión
    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se pudo enviar el correo. Asegúrate de que el correo institucional esté correcto.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }
}
