import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { WeatherService } from '../services/weather.service';
import { DateService } from '../services/date.service';

@Component({
  selector: 'app-hub-alumno',
  templateUrl: './hub-alumno.page.html',
  styleUrls: ['./hub-alumno.page.scss'],
})
export class HubAlumnoPage implements OnInit {
  currentDate: string;
  weather: string;
  isDarkMode: boolean = false;
  userName: string = '';

  constructor(
    private router: Router,
    private menuController: MenuController,
    private authService: AuthService,
    private weatherService: WeatherService,
    private dateService: DateService
  ) {
    this.currentDate = this.dateService.getCurrentDate(); // Obtén la fecha actual desde el servicio
    this.weather = 'Cargando...';
  }

  async ngOnInit() {
    // Verificar si el usuario está autenticado
    if (!localStorage.getItem('isLoggedIn')) {
      this.router.navigate(['/login']); // Redirigir a login si no está autenticado
    } else {
      this.loadUserData(); // Cargar datos del usuario
    }
  
    // Cargar el clima
    this.getWeather();
  }

  loadUserData() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}'); // Recuperar datos del usuario del localStorage
    this.userName = userData.name || 'Usuario'; // Asignar el nombre del usuario, o 'Usuario' si no existe
  }

  toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-theme');
    this.isDarkMode = body.classList.contains('dark-theme');
  }

  checkDarkMode() {
    const body = document.body;
    this.isDarkMode = body.classList.contains('dark-theme');
  }

  async logout() {
    await this.authService.logout(); // Llama al servicio de autenticación para cerrar sesión
    localStorage.removeItem('isLoggedIn'); // Limpia el estado de inicio de sesión
    localStorage.removeItem('userData'); // Limpia los datos del usuario del localStorage
    this.userName = ''; // Limpia el nombre del usuario almacenado en la variable local
    await this.menuController.close(); // Cierra el menú lateral si está abierto
    this.router.navigate(['/login']); // Redirige al usuario a la página de login
  }

  async getWeather() {
    const lat = -33.49936946781729;
    const lon = -70.6165073767097;
    this.weather = await this.weatherService.getWeather(lat, lon); // Obtiene el clima desde el servicio
  }
}
