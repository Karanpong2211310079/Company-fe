import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators'; // ✅ ต้อง import
import { User } from '../models/Users';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8000/user/login/';

  constructor(
    private cookieService: CookieService, // ✅ เพิ่ม comma
    private http: HttpClient
  ) {}

  LoginUser(username: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}`, { username, password }).pipe(
      tap(user => {
        this.cookieService.set('token', user.access || '', {
          path: '/',
          secure: true,
          sameSite: 'Lax',
        });
        this.cookieService.set('role', user.role || '', { path: '/' });
      })
    );
  }

  Logout(){
    this.cookieService.delete('token','/');
    this.cookieService.delete('role','/');
  }
  GetToken(){
    return this.cookieService.get('token') || null;
  }
  GetRole(){
    return this.cookieService.get('role') || null;
  }
  isAuthenticate():boolean{
    return !!this.GetToken();
  }
}
