
export class User {
    uid: string; // Identificador único de Firebase
    email: string; 
    name: string; 
    lastName: string; 
    phoneNumber: string; 
    address: string; 
  
    constructor(
      uid: string,
      email: string,
      name: string,
      lastName: string,
      phoneNumber: string,
      address: string
    ) {
      this.uid = uid;
      this.email = email;
      this.name = name;
      this.lastName = lastName;
      this.phoneNumber = phoneNumber;
      this.address = address;
    }
  }
  