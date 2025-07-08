import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../service/auth.service";

@Injectable({ providedIn: 'root' })

export class AdminGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    const role = this.authService.GetRole(); // เรียก method เพื่อดึง role ของผู้ใช้

    if (role === 'admin') { 
      return true; // อนุญาตให้เข้า
    } else {
      this.router.navigate(['/not-authorized']); // ถ้าไม่ใช่ admin ให้ redirect ไปหน้าไม่อนุญาต
      return false; // ปฏิเสธการเข้าถึง
    }
  }
}