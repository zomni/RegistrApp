import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NoAuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const isLoggedIn = !!localStorage.getItem('isLoggedIn');

    if (isLoggedIn) {
      // Redirige a la página de inicio si el usuario ya está autenticado
      this.router.navigate(['/hub-alumno']);
      return false; // Impide el acceso a la ruta
    }
    return true; // Permite el acceso a la ruta
  }
}
