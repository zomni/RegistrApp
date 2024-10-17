import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  email: string = '';
  password: string = '';
  name: string = '';
  lastName: string = '';
  phoneNumber: string = '';
  address: string = '';

  subjects: string[] = [
    "Matemáticas Básicas",
    "Física General",
    "Química General",
    "Inglés",
    "Comunicación",
    "Fundamentos de Programación",
    "Sistemas Operativos",
    "Redes Computacionales",
    "Bases de Datos",
    "Matemáticas Discretas",
    "Ingeniería de Software",
    "Cálculo Integral",
    "Álgebra Lineal",
    "Teoría de Control",
    "Física Aplicada",
    "Biología",
    "Estadística",
    "Gestión de Proyectos",
    "Emprendimiento",
    "Metodología de la Investigación",
    "Ética Profesional",
    "Habilidades Blandas",
    "Diseño Gráfico"
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {}

  isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  // Modificación de la función para permitir múltiples asignaturas
  generateRandomSchedule(): any {
    const schedule: { [key: string]: any[] } = {}; // Ahora cada día tiene un array de asignaturas
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const startTimes = ['08:00', '09:00', '10:00', '11:00'];

    days.forEach(day => {
      const numSubjects = day === 'Sábado' ? 5 : 3; // Más asignaturas el sábado
      schedule[day] = []; // Inicializamos un array vacío para cada día

      for (let i = 0; i < numSubjects; i++) {
        const randomSubject = this.subjects[Math.floor(Math.random() * this.subjects.length)];
        const randomTime = startTimes[Math.floor(Math.random() * startTimes.length)];
        
        schedule[day].push({ subject: randomSubject, time: randomTime });
      }
    });

    return schedule;
  }

  async register() {
    if (!this.isValidEmail(this.email)) {
      await this.showAlert('Error', 'Por favor, ingresa un correo válido');
      return;
    }

    try {
      const user = await this.authService.register(
        this.email, this.password, this.name, 
        this.lastName, this.phoneNumber, this.address
      );
      const schedule = this.generateRandomSchedule();
      await this.authService.saveUserSchedule(user.uid, schedule);

      await this.showAlert('Registro exitoso', 'Tu cuenta ha sido registrada con éxito');
      this.router.navigate(['/login']);
    } catch (error) {
      await this.showAlert('Error', (error as Error).message);
    }
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header, message, buttons: ['OK']
    });
    await alert.present();
  }
}
