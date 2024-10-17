import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
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
  userSchedule: any[] = []; // Mantener como array para evitar errores en la vista

  constructor(
    private router: Router,
    private menuController: MenuController,
    private authService: AuthService,
    private weatherService: WeatherService,
    private dateService: DateService,
    private userService: UserService
  ) {
    this.currentDate = this.dateService.getCurrentDate();
  }

  async ngOnInit() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn) {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const userId = userData?.uid;

      if (userId) {
        const user = await this.userService.getUser(userId);
        this.userName = user?.name || 'Usuario';
        this.userSchedule = this.convertScheduleToArray(user?.schedule || {});
      } else {
        this.router.navigate(['/login']);
      }
    } else {
      this.router.navigate(['/login']);
    }

    this.checkDarkMode();
    this.weather = await this.weatherService.getWeather(-33.5, -70.6);
  }

  // Conversión del objeto a array para evitar el error con *ngFor
  convertScheduleToArray(schedule: any): any[] {
    return Object.keys(schedule).map(day => ({
      day,
      subjects: schedule[day]
    }));
  }
  

  toggleDarkMode() {
    document.body.classList.toggle('dark-theme');
    this.isDarkMode = !this.isDarkMode;
  }

  checkDarkMode() {
    this.isDarkMode = document.body.classList.contains('dark-theme');
  }

  async logout() {
    await this.authService.logout();
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
