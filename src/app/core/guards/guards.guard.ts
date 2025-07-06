import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../service/auth.service";

@Injectable({ providedIn: 'root' })
export class GuardsGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    const role = this.authService.GetRole(); // ✅ เรียก method ให้ถูก

    if (role === 'admin') { 
      return true; // ✅ อนุญาตให้เข้า
    } else {
      this.router.navigate(['/not-authorized']); // ✅ Navigate ก่อน
      return false; // ✅ แล้วค่อย return false
    }
  }
}
