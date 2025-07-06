import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Logs } from '../models/logs'; // ตรวจสอบให้แน่ใจว่า Logs คือ Array หรือ Object

@Injectable({
  providedIn: 'root'
})
export class LogsService {
  
  private url = 'http://localhost:8000/user/logs';

  constructor(private http: HttpClient) {}

  GetLogs(): Observable<Logs[]> {
    return this.http.get<Logs[]>(this.url); // ✅ ใช้ this.url และใส่ <Logs[]> ถ้าเป็น Array
  }
}
