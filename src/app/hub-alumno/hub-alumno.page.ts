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

  constructor() {
    this.currentDate = formatDate(new Date(), 'fullDate', 'es-ES');
    this.weather = 'Cargando...';
  }

  ngOnInit() {
    this.getWeather();
  }

  getWeather() {
    const lat = -33.4489;
    const lon = -70.6693;
    this.fetchWeather(lat, lon);
  }

  fetchWeather(lat: number, lon: number) {
    const apiKey = '88f2cbd5172e9f1896f6553ba54de122';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&lang=es&units=metric`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const temperature = data.main.temp;
        const weatherDescription = data.weather[0].description;
        this.weather = `${temperature}°C, ${weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1)}`;
      })
      .catch((error) => {
        console.error('Error al obtener el clima:', error);
        this.weather = 'No se pudo obtener el clima';
      });
  }
}
