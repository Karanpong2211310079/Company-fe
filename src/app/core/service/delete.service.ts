import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class DeleteService {
  private deleteUrl = 'http://localhost:8000/user/delete/'

  constructor(private http:HttpClient) {}

 DeleteEmployee(id: number): Observable<any> {
  return this.http.post(this.deleteUrl, { id });
}

}
