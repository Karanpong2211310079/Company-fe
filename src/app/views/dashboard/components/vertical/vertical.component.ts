import { Component } from '@angular/core';
import { TopbarComponent } from "../topbar/topbar.component";
import { SideBarComponent } from "../side-bar/side-bar.component";
import { FooterComponent } from "../footer/footer.component";
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vertical',
  imports: [TopbarComponent, SideBarComponent, FooterComponent,RouterModule,CommonModule],
  templateUrl: './vertical.component.html',
  styleUrl: './vertical.component.scss'
})
export class VerticalComponent {
  sidebarCollapsed = false;

  onSidebarCollapsed(value:boolean){
    this.sidebarCollapsed = value
  }

}
