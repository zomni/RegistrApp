import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { GoogleAuthProvider } from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Sujeto para observar el estado del usuario
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable(); // Observable para suscribirse

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {
    // Verificar el estado de autenticación al inicializar el servicio
    this.afAuth.onAuthStateChanged((user) => {
      if (user) {
        this.userSubject.next(user); // Actualiza el sujeto si el usuario está autenticado
        localStorage.setItem('isLoggedIn', 'true'); // Almacena el estado de inicio de sesión
      } else {
        this.userSubject.next(null); // Si no hay usuario, establece el sujeto a null
        localStorage.removeItem('isLoggedIn'); // Elimina el estado de inicio de sesión
      }
    });
  }

  async login(email: string, password: string): Promise<any> {
    try {
      const result = await this.afAuth.signInWithEmailAndPassword(email, password);
      const uid = result.user?.uid;
      
      if (uid) {
        const userDoc = await this.firestore.collection('users').doc(uid).get().toPromise();
        const userData = userDoc?.data();
        
        if (userData) {
          // Actualiza localStorage con la información correcta del usuario desde Firestore
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userData', JSON.stringify(userData)); // Guarda los datos reales del usuario
        }
      }
      
      return result.user;
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    await this.afAuth.signOut();
  }

  async register(
    email: string, 
    password: string, 
    name: string, 
    lastName: string, 
    phoneNumber: string, 
    address: string
  ): Promise<any> {
    try {
      const result = await this.afAuth.createUserWithEmailAndPassword(email, password);
      const uid = result.user?.uid;

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

  async loginWithGoogle(): Promise<any> {
    const provider = new GoogleAuthProvider();
    try {
      const result = await this.afAuth.signInWithPopup(provider);
      return result.user;
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await this.afAuth.sendPasswordResetEmail(email);
    } catch (error) {
      throw error;
    }
  }

  async getUserData(uid: string): Promise<any> {
    try {
      const userDoc = await this.firestore.collection('users').doc(uid).get().toPromise();
      return userDoc?.data();
    } catch (error) {
      throw error;
    }
  }

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
