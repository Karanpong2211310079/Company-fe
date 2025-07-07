import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Employees } from '../models/employees';
@Injectable({
  providedIn: 'root'
})
export class CreateService {

  createUrl = 'http://localhost:8000/user/create/'

  constructor(private http:HttpClient) { }

  CreateUser(employee:Employees):Observable<any>{
    const body = {
      first_name: employee.first_name,
      last_name: employee.last_name,
      phonenumber: employee.phone_number,
      startdate: employee.start_date,
      salary: employee.salary
    }
    return this.http.post(this.createUrl,body)
  }


}
