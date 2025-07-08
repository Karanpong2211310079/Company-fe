import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { EmployeesComponent } from './pages/employees/employees.component';
import { VerticalComponent } from './components/vertical/vertical.component';
import { LogsComponent } from './pages/logs/logs.component';
import { OverviewsComponent } from './pages/overviews/overviews.component';
import { AdminGuard } from '../../core/guards/admin-guard.guard';
import { GuardsGuard } from '../../core/guards/guards.guard';
export const DashboardRoutes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        children: [
            {
                redirectTo: 'overviews',
                pathMatch: 'full',
                path: ''

            },
            {
                path: 'employees',
                component:EmployeesComponent,
                canActivate: [GuardsGuard] // ใช้ GuardsGuard เพื่อป้องกันการเข้าถึง
                
            },
            {
                path: 'logs',
                component:LogsComponent,
                canActivate: [AdminGuard] // ใช้ AdminGuard เพื่อป้องกันการเข้าถึง
            },
            {
                path: 'overviews',
                component:OverviewsComponent,
                canActivate: [GuardsGuard] // ใช้ GuardsGuard เพื่อป้องกันการเข้าถึง
            }
        ]
    },
];