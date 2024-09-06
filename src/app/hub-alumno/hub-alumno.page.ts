import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-hub-alumno',
  templateUrl: './hub-alumno.page.html',
  styleUrls: ['./hub-alumno.page.scss'],
})
export class HubAlumnoPage implements OnInit {
  currentDate: string;
  weather: string;
  isDarkMode: boolean = false;

  constructor() {
    this.currentDate = formatDate(new Date(), 'fullDate', 'es-ES');
    this.weather = 'Cargando...';
  }

  ngOnInit() {
    this.getWeather();
    this.checkDarkMode(); // Verificar el modo oscuro al inicializar
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

  toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-theme');
    this.isDarkMode = body.classList.contains('dark-theme');
  }

  checkDarkMode() {
    const body = document.body;
    this.isDarkMode = body.classList.contains('dark-theme');
  }
}
  