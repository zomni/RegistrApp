import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private db: Firestore) {}

  async getUsers(): Promise<User[]> {
    const users: User[] = [];
    const querySnapshot = await getDocs(collection(this.db, 'users'));
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();

      // Usa la notación de corchetes para acceder a las propiedades
      users.push(new User(
        data['uid'], 
        data['email'], 
        data['name'], 
        data['lastName'], 
        data['phoneNumber'], 
        data['address']
      ));
    });
    
    return users;
  }

  async getUser(uid: string): Promise<User | null> {
    const userDoc = doc(this.db, 'users', uid);
    const userSnapshot = await getDoc(userDoc);
    
    if (userSnapshot.exists()) {
      const data = userSnapshot.data();

      // Usa la notación de corchetes para acceder a las propiedades
      return new User(
        data['uid'], 
        data['email'], 
        data['name'], 
        data['lastName'], 
        data['phoneNumber'], 
        data['address']
      );
    }
    
    return null;
  }
}
