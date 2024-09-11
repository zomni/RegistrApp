import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Html5Qrcode } from 'html5-qrcode';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-qr-scan',
  templateUrl: './qr-scan.page.html',
  styleUrls: ['./qr-scan.page.scss'],
})
export class QrScanPage implements OnInit, OnDestroy {
  private html5QrCode!: Html5Qrcode;
  private isScanning: boolean = true;
  constructor(private router: Router, private alertController: AlertController) {}

  ngOnInit() {
    this.html5QrCode = new Html5Qrcode("qr-reader");

    this.html5QrCode.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: { width: 250, height: 250 }
      },
      async qrCodeMessage => {
        if (this.isScanning) {
          this.isScanning = false;
          this.html5QrCode.stop().then(() => {
            console.log("Escaneo detenido");
          }).catch(err => {
            console.error("Error al detener el escáner", err);
          });

          await this.showSuccessMessage();
        }
      },
      errorMessage => {
        console.warn(`Error al escanear: ${errorMessage}`);
      }
    ).catch(err => {
      console.error(`Error al iniciar el escáner: ${err}`);
    });
  }

  ngOnDestroy() {    if (this.html5QrCode && this.isScanning) {
      this.html5QrCode.stop().catch(err => {
        console.error(`Error al detener el escáner: ${err}`);
      });
    }
  }

  irinicio() {
    this.router.navigate(['/home']);
  }

  async showSuccessMessage() {
    const alert = await this.alertController.create({
      header: '¡Éxito!',
      message: '¡Asistencia registrada con éxito!',
      buttons: ['OK']
    });

    await alert.present();

    await alert.onDidDismiss();

    this.router.navigate(['/hub-alumno']);
  }
}
