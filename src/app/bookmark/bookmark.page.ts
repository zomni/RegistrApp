import { Component, OnInit } from '@angular/core';
import { DateService } from '../services/date.service';

@Component({
  selector: 'app-bookmark',
  templateUrl: './bookmark.page.html',
  styleUrls: ['./bookmark.page.scss'],
})
export class BookmarkPage implements OnInit {
  attendanceList: { day: string; status: string }[] = [];
  currentDate: Date = new Date();

  constructor(private dateService: DateService) {}

  ngOnInit() {
    this.loadAttendance();
  }

  loadAttendance() {
    const currentDayIndex = this.currentDate.getDay(); // Obtiene el índice del día actual (0-6)
    const currentDay = this.currentDate.getDate(); // Día del mes
    const currentMonth = this.currentDate.getMonth(); // Mes actual (0-11)
    const currentYear = this.currentDate.getFullYear(); // Año actual

    // Calcula la fecha de inicio de la semana (domingo)
    const firstDayOfWeek = new Date(this.currentDate);
    firstDayOfWeek.setDate(currentDay - currentDayIndex); // Ajusta al domingo

    // Recorre todos los días de la semana
    for (let i = 0; i < 7; i++) {
      const date = new Date(firstDayOfWeek);
      date.setDate(firstDayOfWeek.getDate() + i); // Incrementa el día

      const dayName = date.toLocaleDateString('es-ES', { weekday: 'long' });
      const formattedDate = date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long'
      });

      // Marca como "Asistido" solo los días desde el inicio de la semana hasta el día actual
      const status = i <= currentDayIndex ? 'Presente' : ' ';

      this.attendanceList.push({ day: `${dayName} ${formattedDate}`, status });
    }
}

}
