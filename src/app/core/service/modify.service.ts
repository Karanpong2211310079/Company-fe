import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Employees } from '../models/employees';
@Injectable({
  providedIn: 'root'
})
export class ModifyService {

  private UpdateUrl = 'http://localhost:8000/user/update/'

  constructor(private http:HttpClient) { }

   updateEmployee(employee: Employees): Observable<any> {
    const body = {
      employees_id: employee.id,
      first_name: employee.first_name,
      last_name: employee.last_name,
      phonenumber: employee.phone_number,
      startdate: employee.start_date,
      salary: employee.salary
    };

    return this.http.post(this.UpdateUrl, body);
  }






}
