import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HubAlumnoPage } from './hub-alumno.page';

const routes: Routes = [
  {
    path: '',
    component: HubAlumnoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HubAlumnoPageRoutingModule {}
