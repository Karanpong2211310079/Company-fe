import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-logs',
  imports: [CommonModule],
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.scss'
})
export class LogsComponent {
  logs = [
    {
      date: '2025-06-28 10:23',
      user: 'John Doe',
      action: 'Logged in',
      status: 'Success'
    },
    {
      date: '2025-06-28 10:45',
      user: 'Jane Smith',
      action: 'Accessed employee records',
      status: 'Success'
    },
    {
      date: '2025-06-28 11:00',
      user: 'System',
      action: 'Server restart detected',
      status: 'Warning'
    },
    {
      date: '2025-06-28 11:15',
      user: 'Unknown',
      action: 'Unauthorized access attempt',
      status: 'Failed'
    }
  ];
}
