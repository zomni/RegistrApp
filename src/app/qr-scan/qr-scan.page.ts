import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import {
  BarcodeScanner,
  BarcodeFormat,
  ScanOptions,
} from '@capacitor-mlkit/barcode-scanning';
import { UserService } from '../services/user.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { LocationService } from '../services/location.service';

@Component({
  selector: 'app-qr-scan',
  templateUrl: './qr-scan.page.html',
  styleUrls: ['./qr-scan.page.scss'],
})
export class QrScanPage implements OnInit, OnDestroy {
  public barcodes: any[] = [];
  public isScanning: boolean = false;

  // Coordenadas del campus y radio en metros
  targetLatitude: number = -33.4994505196263;
  targetLongitude: number = -70.66439127315599;
  radius: number = 100;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private userService: UserService,
    private afAuth: AngularFireAuth,
    private locationService: LocationService,
    private loadingController: LoadingController
  ) {}

  async ngOnInit() {
    await this.startScan(); // Inicia el escaneo automáticamente
  }

  async startScan() {
    this.isScanning = true;
    const options: ScanOptions = {
      formats: [BarcodeFormat.QrCode],
    };

    try {
      const hasPermission = await this.locationService.requestPermissions();
      if (!hasPermission) {
        await this.showErrorMessage('Permiso de ubicación denegado.');
        this.redirectToHubAlumno();
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

        if (!isInside) {
          await this.showErrorMessage('No estás dentro del campus. No puedes registrar asistencia.');
          this.redirectToHubAlumno();
          return;
        }
      } else {
        await this.showErrorMessage('No se pudo obtener la ubicación.');
        this.redirectToHubAlumno();
        return;
      }

      const result = await BarcodeScanner.scan(options);
      this.isScanning = false;

      if (result.barcodes.length > 0) {
        const qrData = result.barcodes[0].displayValue;
        const [subject, section, room, qrDate] = qrData.split('|');

        // Invertir y agregar guiones a la fecha del QR (formato DD-MM-YYYY)
        const day = qrDate.slice(6, 8);
        const month = qrDate.slice(4, 6);
        const year = qrDate.slice(0, 4);
        const formattedQrDate = `${day}-${month}-${year}`;

        const currentDate = new Date().toLocaleDateString('es-CL', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }).replace(/\//g, '-'); // Asegura que use guiones

        console.log('Fecha del QR (formateada):', formattedQrDate);
        console.log('Fecha actual:', currentDate);

        if (formattedQrDate === currentDate) {
          await this.registerAttendance(subject, section, formattedQrDate);
        } else {
          await this.showErrorMessage(
            `El QR no corresponde al día actual. Fecha del QR: ${formattedQrDate}, Fecha del sistema: ${currentDate}.`
          );
        }
      }
    } catch (error) {
      console.error('Error al escanear: ', error);
      this.isScanning = false;
      this.redirectToHubAlumno();
    }
  }

  async registerAttendance(subject: string, section: string, date: string) {
    const loading = await this.loadingController.create({
      message: 'Registrando asistencia...',
    });
    await loading.present();

    try {
      const userId = (await this.afAuth.currentUser)?.uid;
      if (!userId) {
        await this.showErrorMessage('No se pudo obtener el UID del usuario.');
        return;
      }

      const user = await this.userService.getUser(userId);
      if (user) {
        const attendance = user.attendance || [];
        const alreadyRegistered = attendance.some(
          (record: any) => record.date === date && record.subject === subject && record.section === section
        );

        if (!alreadyRegistered) {
          attendance.push({ date, subject, section, status: 'Presente' });
          console.log('Guardando asistencia:', attendance);
          await this.userService.updateUser(userId, { attendance });
          await this.showSuccessMessage();
        } else {
          await this.showErrorMessage('Ya has registrado tu asistencia para esta clase.');
        }
      }
    } catch (error) {
      console.error('Error al registrar la asistencia:', error);
      await this.showErrorMessage('Ocurrió un error al registrar la asistencia.');
    } finally {
      await loading.dismiss();
    }
  }

  async showSuccessMessage() {
    const alert = await this.alertController.create({
      header: '¡Éxito!',
      message: '¡Asistencia registrada con éxito!',
      buttons: ['OK'],
    });

    await alert.present();

    await alert.onDidDismiss();
    this.redirectToHubAlumno();
  }

  async showErrorMessage(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  redirectToHubAlumno() {
    this.isScanning = false;
    this.router.navigate(['/hub-alumno']);
  }

  irinicio() {
    this.router.navigate(['/hub-alumno']);
  }

  ngOnDestroy() {
    this.isScanning = false;
  }
}
