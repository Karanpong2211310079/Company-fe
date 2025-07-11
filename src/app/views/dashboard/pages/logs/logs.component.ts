import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { LogsService, PaginatedLogs } from '../../../../core/service/logs.service';
import { Logs } from '../../../../core/models/logs';

@Component({
  selector: 'app-logs',
  imports: [CommonModule],
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnDestroy {
  
  private log_type: string[] = [];
  public totalPages: number = 0;
  public currentPage: number = 1;
  public logs: Logs[] = [];

  private totalItems: number = 0;
  private pageSize: number = 10; // กำหนดจำนวนข้อมูลต่อหน้า
 

  private subscription: Subscription = new Subscription();

  constructor(private logsService: LogsService) {}

  ngOnInit(): void {
    this.showLogs(this.currentPage);
  }

  private showLogs(page: number): void {
    const sub = this.logsService.GetLogs(page, this.pageSize).subscribe({
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
    this.subscription.add(sub);
  }

  public mapStatus(action: string | null): string {
    if (!action) return 'Unknown';
    if (action.includes('FAILED') || action.includes('UNAUTHORIZED')) return 'Failed';
    if (action.includes('WARNING')) return 'Warning';
    return 'Success';
  }

  public goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.showLogs(page);
  }

  public prevPage(): void {
    if (this.currentPage > 1) {
      this.showLogs(this.currentPage - 1);
    }
  }

  public nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.showLogs(this.currentPage + 1);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
