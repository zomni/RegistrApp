import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HubAlumnoPage } from './hub-alumno.page';

describe('HubAlumnoPage', () => {
  let component: HubAlumnoPage;
  let fixture: ComponentFixture<HubAlumnoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HubAlumnoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
