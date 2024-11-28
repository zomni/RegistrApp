import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { WeatherService } from '../services/weather.service';
import { DateService } from '../services/date.service';
import { UserService } from '../services/user.service';
import { LocationService } from '../services/location.service'; // Usar LocationService
import { PushNotifications } from '@capacitor/push-notifications';

@Component({
  selector: 'app-hub-alumno',
  templateUrl: './hub-alumno.page.html',
  styleUrls: ['./hub-alumno.page.scss'],
})
export class HubAlumnoPage implements OnInit {
  currentDate: string;
  weather: string = 'Cargando...';
  locationMessage: string = ''; // Mensaje de ubicación
  isInsideCampus: boolean | null = null; // Estado de si está dentro del campus
  isDarkMode: boolean = false;
  userName: string = '';
  userSchedule: any[] = []; // Array para el horario
  filteredSchedule: any[] = []; // Array para el horario filtrado
  searchTerm: string = ''; // Término de búsqueda
  daysOfWeek: string[] = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

  // Coordenadas del campus y radio en metros, DUOC -33.49999570717075, -70.61663612676108
  targetLatitude: number = -33.49999570717075;
  targetLongitude: number = -70.61663612676108;
  radius: number = 100;

  notificationsEnabled: boolean = false; // Estado del toggle de notificaciones
  isTableFormat: boolean = false; // Estado para alternar entre tabla y lista

  constructor(
    private router: Router,
    private menuController: MenuController,
    private authService: AuthService,
    private weatherService: WeatherService,
    private dateService: DateService,
    private userService: UserService,
    private locationService: LocationService, // Usar LocationService
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

      // Actualizar mensaje de ubicación pero sin mostrar alerta
      await this.updateLocationMessage();
    } finally {
      await loading.dismiss();
    }
  }

  async refreshLocation(event: any) {
    try {
      await this.updateLocationMessage();
    } catch (error) {
      console.error('Error al actualizar la ubicación:', error);
    } finally {
      event.target.complete();
    }
  }  

  async updateLocationMessage() {
    const hasPermission = await this.locationService.requestPermissions();
    if (!hasPermission) {
      this.locationMessage = 'Permiso de ubicación denegado.';
      this.isInsideCampus = null;
      return;
    }

    const position = await this.locationService.getCurrentPosition();
    if (position) {
      this.isInsideCampus = this.locationService.isWithinRadius(
        position.latitude,
        position.longitude,
        this.targetLatitude,
        this.targetLongitude,
        this.radius
      );

      this.locationMessage = this.isInsideCampus
        ? 'Estás dentro del campus.'
        : 'Estás fuera del campus.';
    } else {
      this.locationMessage = 'No se pudo obtener la ubicación.';
      this.isInsideCampus = null;
    }
  }

  async checkLocationProximity() {
    const loading = await this.loadingController.create({
      message: 'Verificando ubicación...',
    });
    await loading.present();

    try {
      const hasPermission = await this.locationService.requestPermissions();
      if (!hasPermission) {
        await this.showAlert('Permiso de ubicación denegado.');
        return;
      }

      const position = await this.locationService.getCurrentPosition();
      if (position) {
        const isInside = this.locationService.isWithinRadius(
          position.latitude,
          position.longitude,
          this.targetLatitude,
          this.targetLongitude,
          this.radius
        );

        const alertMessage = isInside
          ? 'Estás dentro del campus.'
          : 'Estás fuera del campus.';
        await this.showAlert(alertMessage);
      } else {
        await this.showAlert('No se pudo obtener la ubicación.');
      }
    } catch (error) {
      console.error('Error obteniendo la ubicación:', error);
      await this.showAlert('No se pudo obtener la ubicación.');
    } finally {
      await loading.dismiss();
    }
  }

  toggleScheduleFormat() {
    this.isTableFormat = !this.isTableFormat;
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

  toggleNotifications() {
    if (this.notificationsEnabled) {
      this.requestNotificationPermission();
    } else {
      this.cancelNotificationPermission();
    }

    // Guardar el estado del toggle para persistir entre sesiones
    localStorage.setItem('notificationsEnabled', JSON.stringify(this.notificationsEnabled));
  }

  requestNotificationPermission() {
    PushNotifications.requestPermissions().then(permission => {
      if (permission.receive === 'granted') {
        console.log('Permiso de notificación concedido.');
        PushNotifications.register();
      } else {
        console.log('Permiso de notificación denegado.');
      }
    }).catch(error => {
      console.error('Error al solicitar permisos de notificación:', error);
    });
  }

  cancelNotificationPermission() {
    PushNotifications.unregister().then(() => {
      console.log('Notificaciones desactivadas.');
    }).catch((error) => {
      console.error('Error al desactivar las notificaciones:', error);
    });
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

  async showAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Ubicación',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
