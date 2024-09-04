import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HubAlumnoPageRoutingModule } from './hub-alumno-routing.module';

import { HubAlumnoPage } from './hub-alumno.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HubAlumnoPageRoutingModule
  ],
  declarations: [HubAlumnoPage]
})
export class HubAlumnoPageModule {}
