import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Cambiado a compat
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private firestore: AngularFirestore) {}

  // Obtener un usuario por ID
  async getUser(userId: string): Promise<User | null> {
    const userRef = this.firestore.doc<User>(`users/${userId}`);
    const userData = await userRef.get().toPromise();

    if (userData && userData.exists) {
      const data = userData.data()!;
      return new User(
        data['uid'],
        data['email'],
        data['name'],
        data['lastName'],
        data['phoneNumber'],
        data['address'],
        data['schedule'] || []
      );
    }
    return null;
  }

  // Crear un nuevo usuario
  async createUser(
    uid: string,
    email: string,
    name: string,
    lastName: string,
    phoneNumber: string,
    address: string,
    schedule: any[] = []
  ): Promise<void> {
    const user = new User(uid, email, name, lastName, phoneNumber, address, schedule);
    const userRef = this.firestore.doc(`users/${uid}`);
    await userRef.set(Object.assign({}, user));
  }

  // Actualizar un usuario
  async updateUser(uid: string, updatedData: Partial<User>): Promise<void> {
    const userRef = this.firestore.doc(`users/${uid}`);
    await userRef.update(updatedData);
  }

  // Eliminar un usuario
  async deleteUser(uid: string): Promise<void> {
    const userRef = this.firestore.doc(`users/${uid}`);
    await userRef.delete();
  }

  // Obtener todos los usuarios
  async getAllUsers(): Promise<User[]> {
    const users: User[] = [];
    const userSnapshot = await this.firestore.collection<User>('users').get().toPromise();

    userSnapshot?.forEach(doc => {
      const data = doc.data();
      users.push(new User(
        data.uid,
        data.email,
        data.name,
        data.lastName,
        data.phoneNumber,
        data.address,
        data.schedule || []
      ));
    });

    return users;
  }
}
