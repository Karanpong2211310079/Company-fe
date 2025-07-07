import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeesService } from '../../../../core/service/employees.service';
import { Employees, PaginatedEmployees } from '../../../../core/models/employees';
import { DeleteService } from '../../../../core/service/delete.service';
import { ModifyService } from '../../../../core/service/modify.service';
import { CreateService } from '../../../../core/service/create.service';
import Swal from 'sweetalert2';

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

  constructor(
    private CreateService:CreateService,
    private ModifyService:ModifyService,
    private DeleteService: DeleteService,
    private employeeService: EmployeesService) {}

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

 editEmployee(emp: Employees): void {
  Swal.fire({
    title: `✏️ แก้ไขข้อมูลพนักงาน`,
    html: `
      <div style="display: flex; flex-direction: column; gap: 10px;">
        <input id="swal-input-firstname" class="swal2-input" placeholder="ชื่อจริง" value="${emp.first_name}">
        <input id="swal-input-lastname" class="swal2-input" placeholder="นามสกุล" value="${emp.last_name}">
        <input id="swal-input-phone" class="swal2-input" placeholder="เบอร์โทรศัพท์" value="${emp.phone_number}">
        <input id="swal-input-date" type="date" class="swal2-input" value="${emp.start_date}">
        <input id="swal-input-salary" type="number" class="swal2-input" placeholder="เงินเดือน" value="${emp.salary}">
      </div>
    `,
    confirmButtonText: 'บันทึก',
    cancelButtonText: 'ยกเลิก',
    showCancelButton: true,
    focusConfirm: false,
    preConfirm: () => {
      const first_name = (document.getElementById('swal-input-firstname') as HTMLInputElement)?.value?.trim();
      const last_name = (document.getElementById('swal-input-lastname') as HTMLInputElement)?.value?.trim();
      const phone_number = (document.getElementById('swal-input-phone') as HTMLInputElement)?.value?.trim();
      const start_date = (document.getElementById('swal-input-date') as HTMLInputElement)?.value;
      const salary = (document.getElementById('swal-input-salary') as HTMLInputElement)?.value;

      if (!first_name || !last_name || !phone_number || !start_date || !salary) {
        Swal.showValidationMessage('⚠️ กรุณากรอกข้อมูลให้ครบถ้วน');
        return null;
      }

      return {
        ...emp,
        first_name,
        last_name,
        phone_number,
        start_date,
        salary
      };
    }
  }).then((result) => {
    if (result.isConfirmed && result.value) {
      const updatedEmp: Employees = result.value;

      this.ModifyService.updateEmployee(updatedEmp).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: '✅ อัปเดตสำเร็จ',
            text: 'ข้อมูลพนักงานถูกแก้ไขแล้ว',
            timer: 1500,
            showConfirmButton: false
          });
          this.loadEmployees();
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: 'ไม่สามารถอัปเดตข้อมูลได้ กรุณาลองใหม่อีกครั้ง'
          });
        }
      });
    }
  });
}


  deleteEmployee(emp: Employees): void {
  Swal.fire({
    title: 'คุณแน่ใจหรือไม่?',
    text: `คุณต้องการลบ ${emp.full_name} หรือไม่?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'ใช่, ลบเลย!',
    cancelButtonText: 'ยกเลิก'
  }).then((result) => {
    if (result.isConfirmed) {
      this.DeleteService.DeleteEmployee(emp.id).subscribe({
        next: (response) => {
          Swal.fire('ลบสำเร็จ!', 'ข้อมูลพนักงานถูกลบแล้ว', 'success');
          this.loadEmployees(); // โหลดใหม่หลังลบ
        },
        error: (err) => {
          Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถลบพนักงานได้', 'error');
        }
      });
    }
  });
}
  createUser(): void {
  Swal.fire({
    title: '➕ เพิ่มพนักงานใหม่',
    html: `
      <div style="display: flex; flex-direction: column; gap: 10px;">
        <input id="swal-input-firstname" class="swal2-input" placeholder="ชื่อจริง">
        <input id="swal-input-lastname" class="swal2-input" placeholder="นามสกุล">
        <input id="swal-input-phone" class="swal2-input" placeholder="เบอร์โทรศัพท์">
        <input id="swal-input-date" type="date" class="swal2-input" placeholder="วันที่เริ่มงาน">
        <input id="swal-input-salary" type="number" class="swal2-input" placeholder="เงินเดือน">
      </div>
    `,
    confirmButtonText: 'สร้าง',
    cancelButtonText: 'ยกเลิก',
    showCancelButton: true,
    focusConfirm: false,
    preConfirm: () => {
      const first_name = (document.getElementById('swal-input-firstname') as HTMLInputElement)?.value?.trim();
      const last_name = (document.getElementById('swal-input-lastname') as HTMLInputElement)?.value?.trim();
      const phone_number = (document.getElementById('swal-input-phone') as HTMLInputElement)?.value?.trim();
      const start_date = (document.getElementById('swal-input-date') as HTMLInputElement)?.value;
      const salary = (document.getElementById('swal-input-salary') as HTMLInputElement)?.value;

      if (!first_name || !last_name || !phone_number || !start_date || !salary) {
        Swal.showValidationMessage('⚠️ กรุณากรอกข้อมูลให้ครบถ้วน');
        return null;
      }

      return {
        first_name,
        last_name,
        phone_number,
        start_date,
        salary
      };
    }
  }).then((result) => {
    if (result.isConfirmed && result.value) {
      const newEmployee = result.value;

      this.CreateService.CreateUser(newEmployee).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: '✅ สร้างพนักงานสำเร็จ',
            timer: 1500,
            showConfirmButton: false
          });
          this.loadEmployees();
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: 'ไม่สามารถสร้างพนักงานได้ กรุณาลองใหม่อีกครั้ง'
          });
        }
      });
    }
  });
}

}
