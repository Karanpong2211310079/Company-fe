import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EmployeesService } from '../../../../core/service/employees.service';
import { Employees } from '../../../../core/models/employees';
import { AuthService } from '../../../../core/service/auth.service';
import { DeleteService } from '../../../../core/service/delete.service';
import { CreateService } from '../../../../core/service/create.service';
import { ModifyService } from '../../../../core/service/modify.service';

import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, FormsModule],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit, OnDestroy {
  employees: Employees[] = [];
  searchTerm: string = '';
  minSalary: number = 0;
  maxSalary: number = 0;
  filterStartDate: string | null = null;
  currentPage: number = 0;
  pageSize: number = 10;
  AmountEmp: number = 0;
  role: string = '';

  private unsubscribe = new Subject<void>();
  private latestParams: { [key: string]: string | number } = {};

 get totalPages(): number[] {
  return Array.from(
    { length: Math.ceil(this.AmountEmp / this.pageSize) },
    (_, i) => i // เริ่มที่ 0
  );
}


  constructor(
    private DeleteService: DeleteService,
    private CreateService: CreateService,
    private ModifyService: ModifyService,
    private employeeService: EmployeesService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.role = this.authService.GetRole() ?? '';
    this.loadEmployees();
    this.applyAllFilters();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  loadEmployees(params: { [key: string]: string | number } = {}): void {
    this.latestParams = { ...params };

    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      query.set(key, value.toString());
    });

    const url = `http://localhost:8000/api/employees/?${query.toString()}`;
    console.log('Loading employees with URL:', url); // Debugging line
    this.employeeService.getEmployees(url).pipe(
      takeUntil(this.unsubscribe)
    ).subscribe({
      next: (data) => {
        this.employees = data.results;
        this.AmountEmp = data.total;
      },
      error: (err) => {
        console.error('Error loading employees:', err);
      }
    });
    
  }

  applyAllFilters(): void {
    const offset = this.currentPage * this.pageSize;
    const limit = this.pageSize;

    const params: any = {
      offset,
      limit,
    };

    if (this.searchTerm) params.search = this.searchTerm.trim();
    if (this.minSalary) params.min_salary = this.minSalary;
    if (this.maxSalary) params.max_salary = this.maxSalary;
    if (this.filterStartDate) params.start_date = this.filterStartDate;

    this.loadEmployees(params);
    
    
  }

  reloadSamePage(): void {
    this.loadEmployees(this.latestParams);
  }

  onSearch(keyword: string): void {
    this.searchTerm = keyword.trim();
    this.applyAllFilters();
  }



goToPage(page: number): void {
  if (page < 0 || page >= Math.ceil(this.AmountEmp / this.pageSize)) return; // ✅ อนุญาต page 0
  this.currentPage = page;
  this.applyAllFilters();
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
          next: () => {
            Swal.fire('ลบสำเร็จ!', 'ข้อมูลพนักงานถูกลบแล้ว', 'success');
            this.reloadSamePage();  // ✅ โหลดหน้าเดิม
          },
          error: () => {
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
        this.CreateService.CreateUser(result.value).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: '✅ สร้างพนักงานสำเร็จ',
              timer: 1500,
              showConfirmButton: false
            });
            this.reloadSamePage();  // ✅ โหลดหน้าเดิม
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
        this.ModifyService.updateEmployee(result.value).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: '✅ อัปเดตสำเร็จ',
              text: 'ข้อมูลพนักงานถูกแก้ไขแล้ว',
              timer: 1500,
              showConfirmButton: false
            });
            this.reloadSamePage();  // ✅ โหลดหน้าเดิม
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
}
