import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeesService } from '../../../../core/service/employees.service';
import { Employees, PaginatedEmployees } from '../../../../core/models/employees';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, FormsModule],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {
  searchTerm: string = '';
  employees: Employees[] = [];
  nextPage: string | null = null;
  previousPage: string | null = null;
  AmountEmp:number = 0

  constructor(private employeeService: EmployeesService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(url?: string): void {
    this.employeeService.getEmployees(url).subscribe({
      next: (data: PaginatedEmployees) => {
        this.employees = data.results;
        this.AmountEmp = data.count
        this.nextPage = data.next;
        this.previousPage = data.previous;
      },
      error: (err) => {
        console.error('Error loading employees:', err);
      }
    });
  }

  get filteredEmployees() {
    if (!this.searchTerm) return this.employees;
    const term = this.searchTerm.toLowerCase();
    return this.employees.filter((emp) =>
      emp.full_name?.toLowerCase().includes(term) ||
      emp.phone_number?.toLowerCase().includes(term)
    );
  }

  next() {
    if (this.nextPage) this.loadEmployees(this.nextPage);
  }

  prev() {
    if (this.previousPage) this.loadEmployees(this.previousPage);
  }

  editEmployee(emp:Employees){

  }
  deleteEmployee(emp:Employees){

  }
}
