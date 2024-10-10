import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard'; // Guard para rutas autenticadas
import { NoAuthGuard } from './guards/no-auth.guard'; // Guard para rutas no autenticadas
import { PageNotFoundComponent } from './page-not-found/page-not-found.component'; // Importa el componente 404

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule),
    canActivate: [NoAuthGuard] // Evita que usuarios autenticados accedan a esta ruta
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./reset-password/reset-password.module').then(m => m.ResetPasswordPageModule),
    canActivate: [NoAuthGuard] // Evita que usuarios autenticados accedan a esta ruta
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then(m => m.RegisterPageModule),
    canActivate: [NoAuthGuard] // Evita que usuarios autenticados accedan a esta ruta
  },
  {
    path: 'qr-scan',
    loadChildren: () => import('./qr-scan/qr-scan.module').then(m => m.QrScanPageModule),
    canActivate: [AuthGuard] // Protege esta ruta solo para usuarios autenticados
  },
  {
    path: 'hub-alumno',
    loadChildren: () => import('./hub-alumno/hub-alumno.module').then(m => m.HubAlumnoPageModule),
    canActivate: [AuthGuard] // Protege esta ruta solo para usuarios autenticados
  },
  {
    path: '**', // Ruta wildcard para manejar páginas no encontradas
    component: PageNotFoundComponent, // Redirige a la página 404
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
