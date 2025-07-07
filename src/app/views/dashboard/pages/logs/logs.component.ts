import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Logs } from '../../../../core/models/logs';
import { LogsService } from '../../../../core/service/logs.service';
@Component({
  selector: 'app-logs',
  imports: [CommonModule],
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.scss'
})
export class LogsComponent {
  logs: Logs[] = [];
  log_type:string[] = [];

  constructor(private logsService: LogsService) {}

  ngOnInit(): void {
    this.showLogs();
  }

  showLogs(): void {
    this.logsService.GetLogs().subscribe({
      next: (data) => {
        this.log_type = [...new Set(data.map(log => log.action))];
        console.log(this.log_type)
        this.logs = data; // ✅ รับจาก API
        console.log(data)
      },
      error: (err) => {
        console.error('Error loading logs:', err);
      }
    });
  }

  mapStatus(action: string | null): string {
  if (!action) return 'Unknown';
  if (action.includes('FAILED') || action.includes('UNAUTHORIZED')) return 'Failed';
  if (action.includes('WARNING')) return 'Warning';
  return 'Success';
}

}

