import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service'; // Importa el servicio de autenticación
import { UserService } from '../services/user.service'; // Importa el servicio de usuario

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private authService: AuthService, // Inyecta el servicio de autenticación
    private userService: UserService, // Inyecta el servicio de usuario
    private loadingController: LoadingController // Inyecta el LoadingController
  ) {}

  ngOnInit() {
    // Verifica si el usuario ya está autenticado
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      this.router.navigate(['/hub-alumno']).then(() => {
        window.location.reload(); // Fuerza la recarga de la página
      });
    }
  }

  async login() {
    const loading = await this.loadingController.create({
      message: 'Verificando credenciales...', // Mensaje de carga
      spinner: 'crescent', // Spinner
    });
    await loading.present(); // Muestra el loading

    try {
      const user = await this.authService.login(this.username, this.password);
      if (user) {
        localStorage.setItem('isLoggedIn', 'true'); // Guardar el estado de autenticación

        // Obtener datos del usuario desde Firestore
        const userData = await this.userService.getUser(user.uid);

        // Guardar los datos del usuario en localStorage
        if (userData) {
          localStorage.setItem('userData', JSON.stringify(userData));
        }

        // Cierra el loading y redirige al hub
        await loading.dismiss();
        this.router.navigate(['/hub-alumno']).then(() => {
          window.location.reload(); // Fuerza la recarga de la página
        });
      }
    } catch (error) {
      await loading.dismiss(); // Cierra el loading si ocurre un error
      const errorMessage = (error as Error).message;
      const alert = await this.alertController.create({
        header: 'Fallo al iniciar sesión',
        message: errorMessage, // Muestra el mensaje de error
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  async loginWithGoogle() {
    const loading = await this.loadingController.create({
      message: 'Iniciando sesión con Google...', // Mensaje de carga
      spinner: 'crescent', // Spinner
    });
    await loading.present(); // Muestra el loading

    try {
      const user = await this.authService.loginWithGoogle(); // Llama al método de autenticación de Google
      if (user) {
        localStorage.setItem('isLoggedIn', 'true'); // Guardar el estado de autenticación

        // Obtener datos del usuario desde Firestore
        const userData = await this.userService.getUser(user.uid);

        // Guardar los datos del usuario en localStorage
        if (userData) {
          localStorage.setItem('userData', JSON.stringify(userData));
        }

        // Cierra el loading y redirige al hub
        await loading.dismiss();
        this.router.navigate(['/hub-alumno']).then(() => {
          window.location.reload(); // Fuerza la recarga de la página
        });
      }
    } catch (error) {
      await loading.dismiss(); // Cierra el loading si ocurre un error
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
