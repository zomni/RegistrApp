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
    "Matemáticas Básicas", "Física General", "Química General", "Inglés", 
    "Comunicación", "Fundamentos de Programación", "Sistemas Operativos", 
    "Redes Computacionales", "Bases de Datos", "Matemáticas Discretas", 
    "Ingeniería de Software", "Cálculo Integral", "Álgebra Lineal", 
    "Teoría de Control", "Física Aplicada", "Biología", "Estadística", 
    "Gestión de Proyectos", "Emprendimiento", "Metodología de la Investigación", 
    "Ética Profesional", "Habilidades Blandas", "Diseño Gráfico"
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

  generateRandomSchedule(): any {
    const schedule: { [key: string]: any[] } = {};
    const weekdays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
    const saturday = ['Sábado'];

    const weekdayTimes = [
      '19:00', '20:30', '21:30', '22:00'
    ];

    const saturdayTimes = [
      '08:00', '09:00', '10:00', '11:00', 
      '12:00', '13:00', '14:00', '15:00', 
      '16:00', '17:00'
    ];

    // Generar horario para días de semana (3 asignaturas máximo)
    weekdays.forEach(day => {
      schedule[day] = [];
      const usedTimes = new Set<string>(); // Para verificar tiempos ya usados

      while (schedule[day].length < 3) {
        const randomSubject = this.subjects[Math.floor(Math.random() * this.subjects.length)];
        const randomTime = weekdayTimes[Math.floor(Math.random() * weekdayTimes.length)];

        if (!usedTimes.has(randomTime)) {
          usedTimes.add(randomTime);
          schedule[day].push({ subject: randomSubject, time: randomTime });
        }
      }
    });

    // Generar horario para sábado (5 asignaturas máximo)
    saturday.forEach(day => {
      schedule[day] = [];
      const usedTimes = new Set<string>(); // Para verificar tiempos ya usados

      while (schedule[day].length < 5) {
        const randomSubject = this.subjects[Math.floor(Math.random() * this.subjects.length)];
        const randomTime = saturdayTimes[Math.floor(Math.random() * saturdayTimes.length)];

        if (!usedTimes.has(randomTime)) {
          usedTimes.add(randomTime);
          schedule[day].push({ subject: randomSubject, time: randomTime });
        }
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
      
      // Redirigir a la página de login
      this.router.navigate(['/login']).then(() => {
        window.location.reload(); // Fuerza la recarga de la página
      });
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
