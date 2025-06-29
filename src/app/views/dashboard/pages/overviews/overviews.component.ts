import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-overviews',
  imports: [CommonModule],
  templateUrl: './overviews.component.html',
  styleUrl: './overviews.component.scss'
})
export class OverviewsComponent {
  stats = [
    { title: 'Employees', value: 128, icon: '👥', color: 'bg-blue-100 text-blue-800' },
    { title: 'Reports', value: 24, icon: '📄', color: 'bg-green-100 text-green-800' },
    { title: 'Errors', value: 3, icon: '⚠️', color: 'bg-red-100 text-red-800' },
    { title: 'Pending Tasks', value: 12, icon: '⏳', color: 'bg-yellow-100 text-yellow-800' }
  ];

}
