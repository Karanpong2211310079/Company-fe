import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employees',
  imports: [CommonModule],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent {

  searchTerm: string = '';

employees = [
  {
    name: 'John Doe',
    position: 'Software Engineer',
    email: 'john.doe@example.com',
    status: 'Active'
  },
  {
    name: 'Jane Smith',
    position: 'Project Manager',
    email: 'jane.smith@example.com',
    status: 'Active'
  },
  {
    name: 'Michael Johnson',
    position: 'UI/UX Designer',
    email: 'michael.j@example.com',
    status: 'Inactive'
  },
  {
    name: 'Emily Williams',
    position: 'QA Tester',
    email: 'emily.w@example.com',
    status: 'Active'
  }
];

get filteredEmployees() {
  if (!this.searchTerm) {
    return this.employees;
  }
  const term = this.searchTerm.toLowerCase();
  return this.employees.filter((emp: any) =>
    emp.name.toLowerCase().includes(term) ||
    emp.position.toLowerCase().includes(term) ||
    emp.email.toLowerCase().includes(term) ||
    emp.status.toLowerCase().includes(term)
  );
}
}