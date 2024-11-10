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

  salas: string[] = [
    "101", "102", "103", "104", "105", "106", "107", "108", "201", "202", 
    "203", "204", "205", "206", "207", "208", "301", "302", "303", "304", 
    "305", "306", "307", "308", "401", "402", "403", "404", "405", "406", 
    "407", "408", "501", "502", "503", "504", "505", "506", "507", "508", 
    "601", "602", "603", "604", "605", "606", "607", "608", "701", "702", 
    "703", "704", "705", "706", "707", "708", "801", "802", "803", "804", 
    "805", "806", "807", "808", "L1", "L2", "L3", "L4", "L5", "L6", "L7",
    "L8"
  ];

  generateRandomSection(): string {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    const randomNumbers = Math.floor(100 + Math.random() * 900); 
    return `${randomNumbers}${randomLetter}`;
  }

  generateSubjectCode(): string {
    const randomNumber = Math.floor(1000 + Math.random() * 9000); 
    return `PGY${randomNumber}`;
  }

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

    weekdays.forEach(day => {
      schedule[day] = [];
      const usedTimes = new Set<string>();

      while (schedule[day].length < 3) {
        const randomSubject = this.subjects[Math.floor(Math.random() * this.subjects.length)];
        const randomTime = weekdayTimes[Math.floor(Math.random() * weekdayTimes.length)];
        const randomSala = this.salas[Math.floor(Math.random() * this.salas.length)];
        const randomSection = this.generateRandomSection();
        const subjectCode = this.generateSubjectCode();

        if (!usedTimes.has(randomTime)) {
          usedTimes.add(randomTime);
          schedule[day].push({ 
            subject: randomSubject, 
            time: randomTime, 
            sala: randomSala, 
            section: randomSection, 
            code: subjectCode
          });
        }
      }
    });

    saturday.forEach(day => {
      schedule[day] = [];
      const usedTimes = new Set<string>();

      while (schedule[day].length < 5) {
        const randomSubject = this.subjects[Math.floor(Math.random() * this.subjects.length)];
        const randomTime = saturdayTimes[Math.floor(Math.random() * saturdayTimes.length)];
        const randomSala = this.salas[Math.floor(Math.random() * this.salas.length)];
        const randomSection = this.generateRandomSection();
        const subjectCode = this.generateSubjectCode();

        if (!usedTimes.has(randomTime)) {
          usedTimes.add(randomTime);
          schedule[day].push({ 
            subject: randomSubject, 
            time: randomTime, 
            sala: randomSala, 
            section: randomSection, 
            code: subjectCode
          });
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
      
      this.router.navigate(['/login']).then(() => {
        window.location.reload();
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
