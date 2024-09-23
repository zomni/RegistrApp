import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NoAuthGuard } from './no-auth.guard'; // Importa la clase NoAuthGuard
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

describe('NoAuthGuard', () => {
  let guard: NoAuthGuard;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule], // Configura el módulo de pruebas para Router
      providers: [NoAuthGuard] // Provee el guardia
    });

    guard = TestBed.inject(NoAuthGuard); // Inyecta el guardia
    router = TestBed.inject(Router); // Inyecta el router
  });

  it('should be created', () => {
    expect(guard).toBeTruthy(); // Verifica que el guardia sea creado correctamente
  });

  it('should allow activation if user is not logged in', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null); // Simula que el usuario no está autenticado
    const route = {} as ActivatedRouteSnapshot; // Crea una instancia vacía de ActivatedRouteSnapshot
    const state = {} as RouterStateSnapshot; // Crea una instancia vacía de RouterStateSnapshot
    expect(guard.canActivate(route, state)).toBeTrue(); // Debería permitir la activación
  });

  it('should redirect to hub-alumno if user is logged in', () => {
    spyOn(localStorage, 'getItem').and.returnValue('true'); // Simula que el usuario está autenticado
    const route = {} as ActivatedRouteSnapshot; // Crea una instancia vacía de ActivatedRouteSnapshot
    const state = {} as RouterStateSnapshot; // Crea una instancia vacía de RouterStateSnapshot
    const navigateSpy = spyOn(router, 'navigate'); // Espía la redirección
    expect(guard.canActivate(route, state)).toBeFalse(); // Debería bloquear la activación
    expect(navigateSpy).toHaveBeenCalledWith(['/hub-alumno']); // Verifica que se redirija a /hub-alumno
  });
});
