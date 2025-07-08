import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { navbarData } from './nav-data';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../../../core/service/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-side-bar',
  imports: [RouterModule, CommonModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss',
  standalone: true
})
export class SideBarComponent implements OnInit {
  role: string | null = null;
  collapsed = false;
  navData = navbarData;

  @Output() collapsedChange = new EventEmitter<boolean>();

  constructor(
    private authService: AuthService,
    private cookieService: CookieService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.role = this.authService.GetRole();
    this.navData = navbarData.filter(item => item.roles.includes(this.role || ''));
  }

  togglecollapsed() {
    this.collapsed = true;
    this.collapsedChange.emit(this.collapsed);
  }

  closecollapsed() {
    this.collapsed = false;
    this.collapsedChange.emit(this.collapsed);
  }

  logout() {
    Swal.fire({
      title: 'คุณแน่ใจหรือไม่?',
      text: 'คุณต้องการออกจากระบบใช่หรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ออกจากระบบ',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cookieService.delete('token');
        this.cookieService.delete('role');
        Swal.fire({
          icon: 'success',
          title: 'ออกจากระบบสำเร็จ',
          showConfirmButton: false,
          timer: 1500
        });
        this.router.navigate(['/']);
      }
    });
  }
}
