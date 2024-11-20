import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
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
        data['schedule'] || [],
        data['attendance'] || [] // Aseguramos que obtenga el campo 'attendance' si existe
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
    schedule: any[] = [],
    attendance: { date: string; subject: string; section: string; status: string }[] = []
  ): Promise<void> {
    const user = new User(uid, email, name, lastName, phoneNumber, address, schedule, attendance);
    const userRef = this.firestore.doc(`users/${uid}`);
    await userRef.set(Object.assign({}, user));
  }

  // Actualizar un usuario
  async updateUser(uid: string, updatedData: Partial<User>): Promise<void> {
    const userRef = this.firestore.doc(`users/${uid}`);
    const currentData = (await userRef.get().toPromise())?.data() as Partial<User>; // Usamos Partial<User> para evitar errores si faltan campos

    if (currentData) {
      // Combina los datos actuales con los nuevos
      const newData: Partial<User> = {
        ...currentData,
        ...updatedData,
        attendance: [
          ...(currentData.attendance || []), // Mantiene los registros existentes
          ...(updatedData.attendance || []), // Agrega los nuevos registros
        ],
      };
      await userRef.update(newData);
    } else {
      // Si no existe el usuario, creamos el documento
      await userRef.set(updatedData);
    }
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
      users.push(
        new User(
          data.uid,
          data.email,
          data.name,
          data.lastName,
          data.phoneNumber,
          data.address,
          data.schedule || [],
          data.attendance || [] // Incluimos 'attendance' en los datos obtenidos
        )
      );
    });

    return users;
  }
}
