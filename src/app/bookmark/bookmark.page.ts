import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-bookmark',
  templateUrl: './bookmark.page.html',
  styleUrls: ['./bookmark.page.scss'],
})
export class BookmarkPage implements OnInit {
  attendanceList: { 
    formattedDate: string; 
    subject: string; 
    section: string; 
    status: string; 
  }[] = []; // Ajuste para incluir toda la información necesaria
  currentDate: Date = new Date();

  constructor(
    private userService: UserService,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    this.loadAttendance();
  }

  async loadAttendance() {
    const userId = (await this.afAuth.currentUser)?.uid;
    if (!userId) {
      console.error('No se pudo obtener el UID del usuario.');
      return;
    }

    const user = await this.userService.getUser(userId);
    if (user && user.attendance) {
      this.attendanceList = user.attendance.map(record => {
        // Crear el objeto Date sin afectar la zona horaria
        const [day, month, year] = record.date.split('-').map(Number);
        const localDate = new Date(year, month - 1, day); // Mes ajustado (0-11)

        // Formatear la fecha de forma segura en local
        const formattedDate = localDate.toLocaleDateString('es-ES', {
          weekday: 'long',
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        });

        // Retornamos la estructura completa para el HTML
        return {
          formattedDate, // Fecha formateada para mostrar
          subject: record.subject,
          section: record.section,
          status: record.status,
        };
      });

      console.log('Lista de asistencia cargada:', this.attendanceList);
    }
  }
}
