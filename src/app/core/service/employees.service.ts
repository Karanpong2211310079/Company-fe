import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedEmployees } from '../models/employees';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  private baseUrl = 'http://localhost:8000/api/employees';

  constructor(private http: HttpClient) {}

  getEmployees(url: string = this.baseUrl): Observable<PaginatedEmployees> {
    return this.http.get<PaginatedEmployees>(url);
  }
}
