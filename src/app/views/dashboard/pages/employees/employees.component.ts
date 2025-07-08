import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EmployeesService } from '../../../../core/service/employees.service';
import { Employees } from '../../../../core/models/employees';
import { DeleteService } from '../../../../core/service/delete.service';
import { ModifyService } from '../../../../core/service/modify.service';
import { CreateService } from '../../../../core/service/create.service';
import { FilterService } from '../../../../core/service/filter.service';
import { AuthService } from '../../../../core/service/auth.service';
import { SearchService } from '../../../../core/service/search.service';

import Swal from 'sweetalert2';

import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, FormsModule],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit, OnDestroy {
  searchTerm: string = '';
  employees: Employees[] = [];

  nextPage: string | null = null;
  previousPage: string | null = null;
  AmountEmp: number = 0;

  minSalary: number = 0;
  maxSalary: number = 0;
  pageSize: number = 10; // ให้ตรงกับ backend

  role: string | null = null;
  currentPage: number = 1;

  // เปลี่ยนเป็น Subject ที่เก็บ object keyword+page
  searchTermChanged = new Subject<{ keyword: string; page: number }>();

  private unsubscribe = new Subject<void>();

  get totalPages(): number[] {
    return Array.from({ length: Math.ceil(this.AmountEmp / this.pageSize) }, (_, i) => i + 1);
  }

  constructor(
    private SearchService: SearchService,
    private authService: AuthService,
    private CreateService: CreateService,
    private ModifyService: ModifyService,
    private DeleteService: DeleteService,
    private employeeService: EmployeesService,
    private filterService: FilterService
  ) {}

  ngOnInit(): void {
    this.role = this.authService.GetRole();
    this.loadEmployees();

    this.searchTermChanged.pipe(
      debounceTime(300),
      distinctUntilChanged((prev, curr) => prev.keyword === curr.keyword && prev.page === curr.page),
      switchMap(({ keyword, page }) =>
        this.SearchService.searchEmployees(keyword, page, this.pageSize).pipe(
          map(data => ({ data, page }))
        )
      ),
      takeUntil(this.unsubscribe)
    ).subscribe({
      next: ({ data, page }) => {
        this.employees = data.results;
        this.AmountEmp = data.count;
        this.nextPage = data.next;
        this.previousPage = data.previous;
        this.currentPage = page;
      },
      error: (err) => {
        console.error('Search error:', err);
      }
    });
  }
  onSetPageSize(): void {
  if (!this.pageSize || this.pageSize < 1) {
    Swal.fire({
      icon: 'warning',
      title: 'Invalid Page Size',
      text: 'Please enter a valid number greater than 0.',
    });
    return;
  }

  this.currentPage = 1;  // รีเซ็ตกลับหน้าแรก
  this.loadEmployees(`http://localhost:8000/api/employees/?page=1&page_size=${this.pageSize}`);
}


  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onSearch(keyword: string): void {
    this.currentPage = 1;
    this.searchTerm = keyword.trim();
    this.searchTermChanged.next({ keyword: this.searchTerm, page: this.currentPage });
  }

  goToPage(page: number): void {
    if (page < 1 || page > Math.ceil(this.AmountEmp / this.pageSize)) return;
    this.currentPage = page;

    if (this.searchTerm) {
      this.searchTermChanged.next({ keyword: this.searchTerm, page: this.currentPage });
    } else if (this.minSalary || this.maxSalary) {
      // ถ้ามี filter
      const baseUrl = `http://localhost:8000/api/employees/filter/`;
      const url = new URL(baseUrl);
      url.searchParams.set('page', page.toString());
      url.searchParams.set('page_size', this.pageSize.toString());
      this.applyFilter(url.toString());
    } else {
      const baseUrl = `http://localhost:8000/api/employees/`;
      const url = new URL(baseUrl);
      url.searchParams.set('page', page.toString());
      url.searchParams.set('page_size', this.pageSize.toString());
      this.loadEmployees(url.toString());
    }
  }

  loadEmployees(url?: string): void {
    let finalUrl: string;
    if (url) {
      const urlObj = new URL(url);
      urlObj.searchParams.set('page_size', this.pageSize.toString());
      finalUrl = urlObj.toString();

      const match = finalUrl.match(/page=(\d+)/);
      if (match) this.currentPage = +match[1];
      else this.currentPage = 1;
    } else {
      finalUrl = `http://localhost:8000/api/employees/?page=1&page_size=${this.pageSize}`;
      this.currentPage = 1;
    }

    this.employeeService.getEmployees(finalUrl).subscribe({
      next: (data) => {
        this.employees = data.results;
        this.AmountEmp = data.count;
        this.nextPage = data.next;
        this.previousPage = data.previous;
      },
      error: (err) => {
        console.error('Error loading employees:', err);
      }
    });
  }

  applyFilter(url?: string): void {
    let finalUrl: string;
    if (url) {
      const urlObj = new URL(url);
      urlObj.searchParams.set('page_size', this.pageSize.toString());
      finalUrl = urlObj.toString();

      const match = finalUrl.match(/page=(\d+)/);
      if (match) this.currentPage = +match[1];
      else this.currentPage = 1;
    } else {
      finalUrl = `http://localhost:8000/api/employees/filter/?page=1&page_size=${this.pageSize}`;
      this.currentPage = 1;
    }

    this.filterService.filterEmployees(this.minSalary, this.maxSalary, finalUrl).pipe(
      takeUntil(this.unsubscribe)
    ).subscribe({
      next: (data) => {
        this.employees = data.results;
        this.AmountEmp = data.count;
        this.nextPage = data.next;
        this.previousPage = data.previous;
      },
      error: (err) => {
        console.error('Filter error:', err);
        this.employees = [];
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
    if (!this.nextPage) return;

    const urlObj = new URL(this.nextPage);
    urlObj.searchParams.set('page_size', this.pageSize.toString());
    const urlWithPageSize = urlObj.toString();

    this.minSalary || this.maxSalary
      ? this.applyFilter(urlWithPageSize)
      : this.loadEmployees(urlWithPageSize);
  }

  prev() {
    if (!this.previousPage) return;

    const urlObj = new URL(this.previousPage);
    urlObj.searchParams.set('page_size', this.pageSize.toString());
    const urlWithPageSize = urlObj.toString();

    this.minSalary || this.maxSalary
      ? this.applyFilter(urlWithPageSize)
      : this.loadEmployees(urlWithPageSize);
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
          next: () => {
            Swal.fire('ลบสำเร็จ!', 'ข้อมูลพนักงานถูกลบแล้ว', 'success');
            this.loadEmployees(); // โหลดใหม่หลังลบ
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
