import { Component ,Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HostListener } from '@angular/core';
import { navbarData } from './nav-data';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-side-bar',
  imports: [RouterModule,CommonModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent {
  collapsed = false;
  navData = navbarData
  @Output() collapsedChange = new EventEmitter<boolean>();  // ✅ output ไปยัง parent

  togglecollapsed(){
    this.collapsed = true
    this.collapsedChange.emit(this.collapsed)
  }
  closecollapsed(){
    this.collapsed = false
    this.collapsedChange.emit(this.collapsed)

  }
}
