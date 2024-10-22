import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard'; // Importa la clase AuthGuard
import { RouterTestingModule } from '@angular/router/testing';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule], // Configura el módulo de pruebas para Router
      providers: [AuthGuard]
    });

    guard = TestBed.inject(AuthGuard); // Inyecta el guardia
    router = TestBed.inject(Router);   // Inyecta el router
  });

  it('should be created', () => {
    expect(guard).toBeTruthy(); // Verifica que el guardia sea creado correctamente
  });

  it('should allow activation if user is logged in', () => {
    spyOn(localStorage, 'getItem').and.returnValue('true'); // Simula que el usuario está autenticado
    expect(guard.canActivate()).toBeTrue(); // Debería permitir la activación
  });

  it('should redirect to login if user is not logged in', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null); // Simula que el usuario no está autenticado
    const navigateSpy = spyOn(router, 'navigate'); // Espía la redirección
    expect(guard.canActivate()).toBeFalse(); // Debería bloquear la activación
    expect(navigateSpy).toHaveBeenCalledWith(['/login']); // Verifica que se redirija a /login
  });
});
