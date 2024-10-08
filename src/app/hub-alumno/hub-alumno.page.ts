import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { formatDate } from '@angular/common';
import { AuthService } from '../services/auth.service';

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

  constructor(private router: Router, private menuController: MenuController, private authService: AuthService) {
    this.currentDate = formatDate(new Date(), 'fullDate', 'es-ES');
    this.weather = 'Cargando...';
  }

  ngOnInit() {
    // Verificar si el usuario está autenticado
    if (!localStorage.getItem('isLoggedIn')) {
      this.router.navigate(['/login']); // Redirigir a login si no está autenticado
    } else {
      this.loadUserData(); // Cargar datos del usuario
    }
  
    // Cargar el clima y otras funcionalidades
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

  getWeather() {
    const lat = -33.49936946781729;
    const lon = -70.6165073767097;
    this.fetchWeather(lat, lon);
  }

  fetchWeather(lat: number, lon: number) {
    const apiKey = '88f2cbd5172e9f1896f6553ba54de122';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&lang=es&units=metric`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.main && data.weather && data.name) {
          const temperature = data.main.temp.toFixed(0);
          const weatherDescription = data.weather[0].description;
          const cityName = data.name;
          this.weather = `${cityName}: ${temperature}°C, ${weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1)}`;
        } else {
          this.weather = 'Datos del clima no disponibles';
        }
      })
      .catch((error) => {
        console.error('Error al obtener el clima:', error);
        this.weather = 'No se pudo obtener el clima';
      });
  }
}
