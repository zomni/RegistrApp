import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service'; // Importa el servicio de autenticación
import { UserService } from '../services/user.service'; // Importa el servicio de usuarios

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = ''; // Cambié username a email
  password: string = '';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private authService: AuthService, // Inyecta el servicio de autenticación
    private userService: UserService // Inyecta el servicio de usuarios
  ) {}

  ngOnInit() {
    // Verifica si el usuario ya está autenticado
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      this.router.navigate(['/hub-alumno']); // Redirige al hub-alumno si ya está autenticado
    }
  }

  async login() {
    try {
      const user = await this.authService.login(this.email, this.password);
      if (user) {
        const userData = await this.userService.getUser(user.uid);
        if (userData) {
          // Aquí ya estás actualizando el BehaviorSubject en AuthService
          this.authService.userSubject.next(userData);
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userData', JSON.stringify(userData));
        }
        this.router.navigate(['/hub-alumno']);
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      const alert = await this.alertController.create({
        header: 'Fallo al iniciar sesión',
        message: errorMessage,
        buttons: ['OK'],
      });
      await alert.present();
    }
  }  

  async loginWithGoogle() {
    try {
      const user = await this.authService.loginWithGoogle(); // Llama al método de autenticación de Google
      if (user) {
        // Guardar el estado de autenticación en localStorage
        localStorage.setItem('isLoggedIn', 'true');

        // Obtener datos del usuario desde Firestore
        const userData = await this.userService.getUser(user.uid);

        // Guardar los datos del usuario en localStorage
        if (userData) {
          localStorage.setItem('userData', JSON.stringify(userData));
        }

        // Redirige al hub si el login es exitoso
        this.router.navigate(['/hub-alumno']);
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
