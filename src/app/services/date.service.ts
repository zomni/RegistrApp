import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  constructor() {}

  getCurrentDate(): string {
    return formatDate(new Date(), 'fullDate', 'es-ES');
  }
}
