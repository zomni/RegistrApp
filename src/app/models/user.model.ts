export class User {
  uid: string; // Identificador único de Firebase
  email: string;
  name: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  schedule: any[] = [];
  attendance: { date: string; subject: string; section: string; status: string }[] = []; // Lista de asistencia

  constructor(
    uid: string,
    email: string,
    name: string,
    lastName: string,
    phoneNumber: string,
    address: string,
    schedule: any[] = [],
    attendance: { date: string; subject: string; section: string; status: string }[] = []
  ) {
    this.uid = uid;
    this.email = email;
    this.name = name;
    this.lastName = lastName;
    this.phoneNumber = phoneNumber;
    this.address = address;
    this.schedule = schedule;
    this.attendance = attendance;
  }
}
