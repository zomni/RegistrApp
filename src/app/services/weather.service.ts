import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey = '88f2cbd5172e9f1896f6553ba54de122'; // Tu API Key de OpenWeatherMap
  private weatherData: string = '';

  constructor() {}

  async getWeather(lat: number, lon: number): Promise<string> {
    if (this.weatherData) {
      return this.weatherData; // Retorna datos almacenados si ya existen
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&lang=es&units=metric`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.main && data.weather && data.name) {
        const temperature = data.main.temp.toFixed(0);
        const weatherDescription = data.weather[0].description;
        const cityName = data.name;
        this.weatherData = `${cityName}: ${temperature}°C, ${weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1)}`;
        return this.weatherData;
      } else {
        return 'Datos del clima no disponibles';
      }
    } catch (error) {
      console.error('Error al obtener el clima:', error);
      return 'No se pudo obtener el clima';
    }
  }

  clearWeatherData() {
    this.weatherData = ''; // Método para limpiar datos del clima
  }
}
