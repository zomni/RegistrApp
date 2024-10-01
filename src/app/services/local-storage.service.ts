import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}

  // Almacena un valor en localStorage
  setItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Obtiene un valor de localStorage
  getItem(key: string): any {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null; // Devuelve null si no existe
  }

  // Elimina un valor de localStorage
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  // Verifica si un valor existe en localStorage
  exists(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  // Limpia el localStorage
  clear(): void {
    localStorage.clear();
  }
}
