import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Importa AngularFireAuth para autenticación
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Importa Firestore para almacenar datos adicionales
import { GoogleAuthProvider } from 'firebase/auth'; // Importa GoogleAuthProvider para login con Google

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth, // Inyección de servicio de autenticación
    private firestore: AngularFirestore // Inyección de servicio de Firestore
  ) {}

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

  // Método para registrar nuevos usuarios y almacenar datos adicionales en Firestore
  async register(
    email: string, 
    password: string, 
    name: string, 
    lastName: string, 
    phoneNumber: string, 
    address: string
  ): Promise<any> {
    try {
      // Crear usuario en Firebase Authentication
      const result = await this.afAuth.createUserWithEmailAndPassword(email, password);
      const uid = result.user?.uid;

      // Almacenar datos adicionales en Firestore usando el uid del usuario
      if (uid) {
        await this.firestore.collection('users').doc(uid).set({
          uid,
          email,
          name,
          lastName,
          phoneNumber,
          address,
        });
      }

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

  // Método para restablecer contraseña
  async resetPassword(email: string): Promise<void> {
    try {
      await this.afAuth.sendPasswordResetEmail(email);
    } catch (error) {
      throw error;
    }
  }

  // Método para obtener la información del usuario desde Firestore
  async getUserData(uid: string): Promise<any> {
    try {
      const userDoc = await this.firestore.collection('users').doc(uid).get().toPromise();
      return userDoc?.data(); // Devuelve los datos del usuario almacenados en Firestore
    } catch (error) {
      throw error;
    }
  }

  // Método para actualizar los datos adicionales del usuario
  async updateUserData(
    uid: string, 
    name: string, 
    lastName: string, 
    phoneNumber: string, 
    address: string
  ): Promise<void> {
    try {
      await this.firestore.collection('users').doc(uid).update({
        name,
        lastName,
        phoneNumber,
        address,
      });
    } catch (error) {
      throw error;
    }
  }
}
