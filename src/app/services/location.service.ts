import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private readonly EARTH_RADIUS = 6371e3; // Radio de la Tierra en metros

  constructor() {}

  // Solicita permisos de ubicación
  async requestPermissions(): Promise<boolean> {
    try {
      const permission = await Geolocation.requestPermissions();
      return permission.location === 'granted';
    } catch (error) {
      console.error('Error al solicitar permisos de ubicación:', error);
      return false;
    }
  }

  // Obtiene la ubicación actual del usuario
  async getCurrentPosition(): Promise<{ latitude: number; longitude: number } | null> {
    try {
      const position = await Geolocation.getCurrentPosition();
      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
    } catch (error) {
      console.error('Error obteniendo la ubicación:', error);
      return null;
    }
  }

  // Calcula si el usuario está dentro de un radio de una ubicación específica
  isWithinRadius(
    userLat: number,
    userLon: number,
    targetLat: number,
    targetLon: number,
    radius: number
  ): boolean {
    const φ1 = (userLat * Math.PI) / 180;
    const φ2 = (targetLat * Math.PI) / 180;
    const Δφ = ((targetLat - userLat) * Math.PI) / 180;
    const Δλ = ((targetLon - userLon) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = this.EARTH_RADIUS * c;
    return distance <= radius;
  }
}
