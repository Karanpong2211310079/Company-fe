import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/service/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginform:FormGroup;

  constructor(
    private fb:FormBuilder,
    private authService:AuthService
  ){

    this.loginform = this.fb.group({
      username: ['',[Validators.required]],
      password: ['',Validators.required],
    });
  }

  onSubmit(){
    if (this.loginform.invalid) return console.log('Error');

    const {username,password} = this.loginform.value
    this.authService.LoginUser(username,password).subscribe({
      next: () => console.log('Login Success'),
      error: () => console.log('Login Falied')
    })
  }
}
