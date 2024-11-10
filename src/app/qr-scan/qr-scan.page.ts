import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import {
  BarcodeScanner,
  BarcodeFormat,
  ScanOptions,
} from '@capacitor-mlkit/barcode-scanning';

@Component({
  selector: 'app-qr-scan',
  templateUrl: './qr-scan.page.html',
  styleUrls: ['./qr-scan.page.scss'],
})
export class QrScanPage implements OnInit, OnDestroy {
  public barcodes: any[] = [];
  public isScanning: boolean = false;

  constructor(private router: Router, private alertController: AlertController) {}

  ngOnInit() {
    this.startScan(); // Inicia el escaneo automáticamente
  }

  async startScan() {
    this.isScanning = true;
    const options: ScanOptions = {
      formats: [BarcodeFormat.QrCode],
    };

    try {
      const result = await BarcodeScanner.scan(options);
      this.barcodes = result.barcodes;
      this.isScanning = false;
      if (this.barcodes.length > 0) {
        await this.showSuccessMessage();
      }
    } catch (error) {
      console.error('Error al escanear: ', error);
      this.isScanning = false;
    }
  }

  ngOnDestroy() {
    this.isScanning = false;
  }

  irinicio() {
    this.router.navigate(['/home']);
  }

  async showSuccessMessage() {
    const alert = await this.alertController.create({
      header: '¡Éxito!',
      message: '¡Asistencia registrada con éxito!',
      buttons: ['OK'],
    });

    await alert.present();

    await alert.onDidDismiss();
    this.router.navigate(['/hub-alumno']);
  }
}
