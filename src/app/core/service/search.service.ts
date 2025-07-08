import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Employees } from '../models/employees';

export interface EmployeePaginationResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Employees[];
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private baseUrl = 'http://localhost:8000/api/employees/search';

  constructor(private http: HttpClient) { }

 searchEmployees(keyword: string = '', page: number = 1, pageSize: number = 10): Observable<EmployeePaginationResponse> {
  let params = new HttpParams()
    .set('page', page.toString())
    .set('page_size', pageSize.toString());

  const trimmedKeyword = keyword.trim();

  const url = trimmedKeyword
    ? `${this.baseUrl}/${trimmedKeyword}/`  // มี keyword → ค้นหา
    : `${this.baseUrl}`;                    // ว่าง → แสดงทั้งหมด

  return this.http.get<EmployeePaginationResponse>(url, { params });
}

}
