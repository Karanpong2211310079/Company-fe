import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Logs } from '../models/logs'; // Logs คือ interface ของ log object เดียว

export interface PaginatedLogs {
  count: number;
  next: string | null;
  previous: string | null;
  results: Logs[];
}

@Injectable({
  providedIn: 'root'
})
export class LogsService {
  private url = 'http://localhost:8000/user/logs';

  constructor(private http: HttpClient) {}

  // เพิ่มพารามิเตอร์ page และ pageSize เพื่อรองรับ pagination
  GetLogs(page: number = 1, pageSize: number = 10): Observable<PaginatedLogs> {
    const params = `?page=${page}&page_size=${pageSize}`;
    return this.http.get<PaginatedLogs>(this.url + params);
  }
}
