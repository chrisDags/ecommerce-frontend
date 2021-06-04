import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Luv2ShopFormService {

  constructor() { }

  getCreditCardMonths(startMonth: number): Observable<number[]>{
    let data: number[] = [];

    for(let month = startMonth; month <= 12; month++){
      data.push(month);
    }
    // 'of' operator wraps the object as an observable
    return of(data);
  }

  getCreditCardYears(): Observable<number[]>{
    let data: number[] = [];

    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    for(let year = startYear; year <= endYear; year++){
      data.push(year);
    }
    // 'of' operator wraps the object as an observable
    return of(data);

  }
}
