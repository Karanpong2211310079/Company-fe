import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { navbarData } from './nav-data';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-side-bar',
  imports: [RouterModule, CommonModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss',
  standalone: true
})
export class SideBarComponent {
  collapsed = false;
  navData = navbarData;

  @Output() collapsedChange = new EventEmitter<boolean>();

  constructor(
    private cookieService: CookieService,
    private router: Router
  ) {}

  togglecollapsed() {
    this.collapsed = true;
    this.collapsedChange.emit(this.collapsed);
  }

  closecollapsed() {
    this.collapsed = false;
    this.collapsedChange.emit(this.collapsed);
  }

  logout() {
    this.cookieService.delete('token');
    this.cookieService.delete('role');
    this.router.navigate(['/']);
  }
}
