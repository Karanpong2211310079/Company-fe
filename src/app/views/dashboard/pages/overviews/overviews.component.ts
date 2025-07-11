import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeesService } from '../../../../core/service/employees.service';
import { StatsModel } from '../../../../core/models/data.interface';

@Component({
  selector: 'app-overviews',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overviews.component.html',
  styleUrls: ['./overviews.component.scss']
})
export class OverviewsComponent {
  AmountEmp: number = 0;
  

  public stats:StatsModel[] = [
    { title: 'Employees', value: this.AmountEmp, icon: '👥', color: 'bg-blue-100 text-blue-800' },
    { title: 'Reports', value: 24, icon: '📄', color: 'bg-green-100 text-green-800' },
    { title: 'Errors', value: 3, icon: '⚠️', color: 'bg-red-100 text-red-800' },
    { title: 'Pending Tasks', value: 12, icon: '⏳', color: 'bg-yellow-100 text-yellow-800' }
  ];

  constructor(private emp: EmployeesService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(url?: string): void {
    const apiUrl = 'http://localhost:8000/api/employees/'; // Provide your default API endpoint here
    this.emp.getEmployees(apiUrl).subscribe({
      next: (data) => {
        this.AmountEmp = data.total;
        this.stats[0].value = this.AmountEmp;
        console.log(data) // ✅ update stats หลัง API ตอบกลับ
      },
      error: (err) => {
        console.error('Error loading employees:', err);
      }
    });
  }
}
