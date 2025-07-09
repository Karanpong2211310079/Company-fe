import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { PaginatedEmployees } from '../models/employees';
@Injectable({
  providedIn: 'root'
})
export class FilterService {

  filterEmployeesUrl = 'http://localhost:8000/api/employees/filter/';

  constructor(
    private http: HttpClient
  ) { }

 filterEmployees(min: number, max: number,url:string = this.filterEmployeesUrl): Observable<PaginatedEmployees> {
  const body = {
    low_range: min,
    high_range: max
  };
  return this.http.post<PaginatedEmployees>(url, body);
}
filterEmployeesDate(url:string = this.filterEmployeesUrl, startDate: string): Observable<PaginatedEmployees> {
  const body = {
    start_date: startDate
  };
  return this.http.post<PaginatedEmployees>(url, body);

  }

}