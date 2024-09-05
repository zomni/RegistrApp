import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage {
  username: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(private router: Router, private alertController: AlertController) {}

  async resetPassword() {
    if (this.newPassword === this.confirmPassword && this.newPassword !== '') {
      const alert = await this.alertController.create({
        header: 'Contraseña cambiada',
        message: 'Tu contraseña ha sido cambiada con éxito',
        buttons: ['OK'],
      });
      await alert.present();
      this.username = '';
      this.newPassword = '';
      this.confirmPassword = '';
      
      this.router.navigate(['/login']);
    } else {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Las contraseñas no coinciden o están vacías',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }
}
