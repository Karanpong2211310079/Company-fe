import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogsService, PaginatedLogs } from '../../../../core/service/logs.service';
import { Logs } from '../../../../core/models/logs';

@Component({
  selector: 'app-logs',
  imports: [CommonModule],
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent {
  logs: Logs[] = [];
  log_type: string[] = [];

  currentPage: number = 1;
  totalItems: number = 0;
  pageSize: number = 10; // กำหนดจำนวนข้อมูลต่อหน้า
  totalPages: number = 0;

  constructor(private logsService: LogsService) {}

  ngOnInit(): void {
    this.showLogs(this.currentPage);
  }

  showLogs(page: number): void {
    this.logsService.GetLogs(page, this.pageSize).subscribe({
      next: (data: PaginatedLogs) => {
        this.logs = data.results;
        this.totalItems = data.count;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        this.log_type = [...new Set(this.logs.map(log => log.action))];
        this.currentPage = page;
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

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.showLogs(page);
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.showLogs(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.showLogs(this.currentPage + 1);
    }
  }
}
