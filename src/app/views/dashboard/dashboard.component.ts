import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VerticalComponent } from './components/vertical/vertical.component';

@Component({
  selector: 'app-dashboard',
  imports: [RouterModule,VerticalComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
