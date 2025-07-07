import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/service/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'] // ✅ แก้ styleUrl เป็น styleUrls
})
export class LoginComponent {

  loginform: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.loginform = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginform.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'กรอกข้อมูลไม่ครบ',
        text: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่านให้ครบถ้วน'
      });
      return;
    }

    const { username, password } = this.loginform.value;

    this.authService.LoginUser(username, password).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'เข้าสู่ระบบสำเร็จ',
          showConfirmButton: false,
          timer: 1500
        });
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'เข้าสู่ระบบล้มเหลว',
          text: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง'
        });
      }
    });
  }
}
