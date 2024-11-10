import { Component, OnInit } from '@angular/core'; 
import { Router } from '@angular/router';
import { MenuController, LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { WeatherService } from '../services/weather.service';
import { DateService } from '../services/date.service';
import { UserService } from '../services/user.service';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-hub-alumno',
  templateUrl: './hub-alumno.page.html',
  styleUrls: ['./hub-alumno.page.scss'],
})
export class HubAlumnoPage implements OnInit {
  currentDate: string;
  weather: string = 'Cargando...';
  locationMessage: string = ''; // Mensaje de ubicación
  isDarkMode: boolean = false;
  userName: string = '';
  userSchedule: any[] = []; // Array para el horario
  filteredSchedule: any[] = []; // Array para el horario filtrado
  searchTerm: string = ''; // Término de búsqueda
  daysOfWeek: string[] = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  
  // Coordenadas de destino y radio en metros //-33.50004965556381 , -70.6165080277463 duoc
  // -33.62398953109721, -70.70978787693707
  targetLatitude: number = -33.62398953109721;
  targetLongitude: number = -70.70978787693707;
  radius: number = 100;

  constructor(
    private router: Router,
    private menuController: MenuController,
    private authService: AuthService,
    private weatherService: WeatherService,
    private dateService: DateService,
    private userService: UserService,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {
    this.currentDate = this.dateService.getCurrentDate();
  }

  async ngOnInit() {
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
          const user = await this.userService.getUser(userId);
          if (user) {
            this.userName = user.name || 'Usuario';
            this.userSchedule = this.convertScheduleToArray(user.schedule || {});
            this.sortSchedule();
            this.filteredSchedule = [...this.userSchedule];
          }
        } else {
          this.router.navigate(['/login']);
        }
      } else {
        this.router.navigate(['/login']);
      }

      this.checkDarkMode();
      this.weather = await this.weatherService.getWeather(-33.5, -70.6);
      await this.checkLocationProximity(); // Verificar proximidad a la ubicación
    } finally {
      await loading.dismiss();
    }
  }

  convertScheduleToArray(schedule: any): any[] {
    return Object.keys(schedule).map(day => ({
      day,
      subjects: schedule[day] || []
    }));
  }

  sortSchedule() {
    this.userSchedule.sort((a, b) => {
      return this.daysOfWeek.indexOf(a.day.toLowerCase()) - this.daysOfWeek.indexOf(b.day.toLowerCase());
    });
  }

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
    if (Capacitor.getPlatform() === 'android' && 'Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          console.log('Permiso de notificación concedido en Android.');
        } else if (permission === 'denied') {
          console.log('Permiso de notificación denegado.');
        } else {
          console.log('Permiso de notificación no decidido.');
        }
      });
    } else if (Capacitor.getPlatform() !== 'android') {
      console.log('La solicitud de permiso de notificación solo está habilitada para Android.');
    } else {
      console.log('Este navegador no soporta notificaciones.');
    }
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro de que deseas cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          handler: async () => {
            await this.menuController.close();
            await this.authService.logout();
            localStorage.clear();
            this.router.navigate(['/login']);
          },
        },
      ],
    });
    await alert.present();
  }

  // Verifica la proximidad del usuario a las coordenadas objetivo
  async checkLocationProximity() {
    // Muestra el loading
    const loading = await this.loadingController.create({
      message: 'Verificando ubicación...',
      duration: 1000 // Duración mínima de 3 segundos
    });
    await loading.present();

    try {
      const permission = await Geolocation.requestPermissions();
      if (permission.location === 'granted') {
        const position = await Geolocation.getCurrentPosition();
        const userLatitude = position.coords.latitude;
        const userLongitude = position.coords.longitude;

        if (this.isWithinRadius(userLatitude, userLongitude, this.targetLatitude, this.targetLongitude, this.radius)) {
          this.locationMessage = 'Estás dentro del campus.';
        } else {
          this.locationMessage = 'Estás fuera del campus.';
        }
      } else {
        this.locationMessage = 'Permiso de ubicación denegado.';
      }
    } catch (error) {
      console.error('Error obteniendo la ubicación:', error);
      this.locationMessage = 'No se pudo obtener la ubicación.';
    } finally {
      // Espera a que pasen 3 segundos si la operación terminó antes
      setTimeout(() => loading.dismiss(), 3000);
    }
  }

  isWithinRadius(userLat: number, userLon: number, targetLat: number, targetLon: number, radius: number): boolean {
    const R = 6371e3; 
    const φ1 = (userLat * Math.PI) / 180;
    const φ2 = (targetLat * Math.PI) / 180;
    const Δφ = ((targetLat - userLat) * Math.PI) / 180;
    const Δλ = ((targetLon - userLon) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    return distance <= radius;
  }

  async showAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Ubicación',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
