import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Html5Qrcode } from 'html5-qrcode';

@Component({
  selector: 'app-qr-scan',
  templateUrl: './qr-scan.page.html',
  styleUrls: ['./qr-scan.page.scss'],
})
export class QrScanPage implements OnInit, OnDestroy {
  private html5QrCode!: Html5Qrcode; // Usar operador de aserción no nula

  constructor(private router: Router) {}

  ngOnInit() {
    this.html5QrCode = new Html5Qrcode("qr-reader");

    // Inicia el escáner de QR
    this.html5QrCode.start(
      { facingMode: "environment" }, // Usa la cámara trasera
      {
        fps: 10, // Frames por segundo
        qrbox: { width: 250, height: 250 } // Tamaño del cuadro de escaneo
      },
      qrCodeMessage => {
        // Esto se llama cuando se escanea un código QR
        document.getElementById("qr-reader-results")!.innerText = qrCodeMessage;
      },
      errorMessage => {
        // Manejo de errores
        console.warn(`Error al escanear: ${errorMessage}`);
      }
    ).catch(err => {
      console.error(`Error al iniciar el escáner: ${err}`);
    });
  }

  ngOnDestroy() {
    // Detén el escáner cuando se destruye el componente
    if (this.html5QrCode) {
      this.html5QrCode.stop().catch(err => {
        console.error(`Error al detener el escáner: ${err}`);
      });
    }
  }

  irinicio() {
    this.router.navigate(['/home']);
  }
}

