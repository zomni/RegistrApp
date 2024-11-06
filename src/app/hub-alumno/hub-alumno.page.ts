import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { WeatherService } from '../services/weather.service';
import { DateService } from '../services/date.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-hub-alumno',
  templateUrl: './hub-alumno.page.html',
  styleUrls: ['./hub-alumno.page.scss'],
})
export class HubAlumnoPage implements OnInit {
  currentDate: string;
  weather: string = 'Cargando...';
  isDarkMode: boolean = false;
  userName: string = '';
  userSchedule: any[] = []; // Array para el horario
  filteredSchedule: any[] = []; // Array para el horario filtrado
  searchTerm: string = ''; // Término de búsqueda
  daysOfWeek: string[] = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

  constructor(
    private router: Router,
    private menuController: MenuController,
    private authService: AuthService,
    private weatherService: WeatherService,
    private dateService: DateService,
    private userService: UserService,
    private loadingController: LoadingController // Inyectar LoadingController
  ) {
    this.currentDate = this.dateService.getCurrentDate();
  }

  async ngOnInit() {
    // Mostrar el indicador de carga
    const loading = await this.loadingController.create({
      message: 'Cargando datos...',
    });
    await loading.present();

    try {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      if (isLoggedIn) {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const userId = userData?.uid;

        if (userId) {
          // Obtener usuario desde Firestore utilizando el servicio UserService
          const user = await this.userService.getUser(userId);

          // Si el usuario existe, actualizar nombre y horario
          if (user) {
            this.userName = user.name || 'Usuario';
            this.userSchedule = this.convertScheduleToArray(user.schedule || {});
            this.sortSchedule();
            this.filteredSchedule = [...this.userSchedule]; // Inicializa el array filtrado
          }
        } else {
          this.router.navigate(['/login']);
        }
      } else {
        this.router.navigate(['/login']);
      }

      this.checkDarkMode();
      this.weather = await this.weatherService.getWeather(-33.5, -70.6); // Santiago, Chile
    } finally {
      // Ocultar el indicador de carga
      await loading.dismiss();
    }
  }

  // Convierte el objeto de horario en un array para evitar errores en la vista con *ngFor
  convertScheduleToArray(schedule: any): any[] {
    return Object.keys(schedule).map(day => ({
      day,
      subjects: schedule[day] || []
    }));
  }

  // Ordena el horario de clases según los días de la semana
  sortSchedule() {
    this.userSchedule.sort((a, b) => {
      return this.daysOfWeek.indexOf(a.day.toLowerCase()) - this.daysOfWeek.indexOf(b.day.toLowerCase());
    });
  }

  // Filtrar el horario de clases basado en el término de búsqueda
  filterSchedule(event: any) {
    const searchTerm = this.searchTerm.toLowerCase();
    this.filteredSchedule = this.userSchedule.filter(day => {
      return (
        day.day.toLowerCase().includes(searchTerm) || 
        day.subjects.some((subject: any) => subject.subject.toLowerCase().includes(searchTerm))
      );
    });
  }

  toggleDarkMode() {
    document.body.classList.toggle('dark-theme');
    this.isDarkMode = !this.isDarkMode;
  }

  checkDarkMode() {
    this.isDarkMode = document.body.classList.contains('dark-theme');
  }
  
  requestNotificationPermission() {
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          console.log('Permiso de notificación concedido.');
          // Aquí puedes agregar lógica para manejar la suscripción a notificaciones
        } else if (permission === 'denied') {
          console.log('Permiso de notificación denegado.');
        } else {
          console.log('Permiso de notificación no decidido.');
        }
      });
    } else {
      console.log('Este navegador no soporta notificaciones.');
    }
  }

  async logout() {
    await this.menuController.close();
    await this.authService.logout();
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
