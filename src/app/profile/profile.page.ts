import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  userData: any = {};

  constructor(private userService: UserService, private loadingController: LoadingController) {}

  async ngOnInit() {
    // Mostrar el indicador de carga
    const loading = await this.loadingController.create({
      message: 'Cargando perfil...',
    });
    await loading.present();

    try {
      const user = JSON.parse(localStorage.getItem('userData') || '{}');
      const userId = user?.uid;

      if (userId) {
        // Obtener los datos del usuario desde Firebase
        const userDetails = await this.userService.getUser(userId);

        // Asignar los datos al objeto userData
        if (userDetails) {
          this.userData = userDetails;
        }
      }
    } finally {
      // Ocultar el indicador de carga
      await loading.dismiss();
    }
  }
}
