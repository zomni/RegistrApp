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
  public userSubject = new BehaviorSubject<any>(null);
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
        this.getUserData(user.uid); // Carga los datos del usuario
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
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userData', JSON.stringify(userData)); 
          
          this.userSubject.next(userData); // Emite el nuevo usuario autenticado
        }
      }
      
      return result.user;
    } catch (error) {
      throw error;
    }
  }  

  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut();
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userData');
      
      this.userSubject.next(null); // Emite null cuando se cierra sesión
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      throw error;
    }
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
        // Guarda los datos del usuario en Firestore
        await this.firestore.collection('users').doc(uid).set({
          uid,
          email,
          name,
          lastName,
          phoneNumber,
          address,
        });

        // Almacena la información del nuevo usuario en localStorage
        const userData = { uid, email, name, lastName, phoneNumber, address };
        localStorage.setItem('userData', JSON.stringify(userData)); // Almacena los datos del usuario
        this.userSubject.next(userData); // Actualiza el BehaviorSubject
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
      const user = result.user;
  
      if (user) {
        const userData = {
          uid: user.uid,
          email: user.email,
          name: user.displayName || "Usuario sin nombre",
          phoneNumber: user.phoneNumber || "No disponible",
          address: "Dirección no proporcionada" // Puedes solicitarla más adelante si es necesario
        };
  
        // Verifica si el usuario ya está en la base de datos
        const userDoc = await this.firestore.collection('users').doc(user.uid).get().toPromise();
        
        if (!userDoc?.exists) {
          // Si el usuario no existe, crea un nuevo documento en Firestore
          await this.firestore.collection('users').doc(user.uid).set(userData);
        }
  
        localStorage.setItem('isLoggedIn', 'true'); // Guardar estado de inicio de sesión
        localStorage.setItem('userData', JSON.stringify(userData)); // Almacenar datos del usuario localmente
        this.userSubject.next(userData); // Actualiza el BehaviorSubject con la información del usuario
  
        return user; // Devuelve el usuario autenticado
      } else {
        throw new Error('Error al autenticar el usuario');
      }
    } catch (error) {
      throw error; // Maneja el error en el componente de login
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

  async saveUserSchedule(uid: string, schedule: any): Promise<void> {
    try {
      await this.firestore.collection('users').doc(uid).update({
        schedule: schedule,
      });
    } catch (error) {
      throw error;
    }
  }
}
