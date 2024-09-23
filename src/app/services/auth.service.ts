import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Importa AngularFireAuth
import { GoogleAuthProvider } from 'firebase/auth'; // Importa GoogleAuthProvider

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth) {}

  // Método para iniciar sesión con Firebase Authentication
  async login(email: string, password: string): Promise<any> {
    try {
      const result = await this.afAuth.signInWithEmailAndPassword(email, password);
      localStorage.setItem('isLoggedIn', 'true'); // Guarda el estado de inicio de sesión
      return result.user;
    } catch (error) {
      throw error; // Lanza el error para manejarlo en el componente
    }
  }

  // Método para cerrar sesión
  async logout(): Promise<void> {
    await this.afAuth.signOut();
    localStorage.removeItem('isLoggedIn'); // Limpia el estado de autenticación
  }

  // Método para registrar nuevos usuarios
  async register(email: string, password: string): Promise<any> {
    try {
      const result = await this.afAuth.createUserWithEmailAndPassword(email, password);
      return result.user;
    } catch (error) {
      throw error;
    }
  }

  // Método para iniciar sesión con Google
  async loginWithGoogle(): Promise<any> {
    const provider = new GoogleAuthProvider();
    try {
      const result = await this.afAuth.signInWithPopup(provider);
      localStorage.setItem('isLoggedIn', 'true'); // Actualiza el estado de inicio de sesión
      return result.user;
    } catch (error) {
      throw error; // Lanza el error para manejarlo en el componente
    }
  }
}
