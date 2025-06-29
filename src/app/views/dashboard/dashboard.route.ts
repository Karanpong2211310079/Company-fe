import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { EmployeesComponent } from './pages/employees/employees.component';
import { VerticalComponent } from './components/vertical/vertical.component';
import { LogsComponent } from './pages/logs/logs.component';
import { OverviewsComponent } from './pages/overviews/overviews.component';

export const DashboardRoutes: Routes = [
    {
        path: '',
        component: VerticalComponent,
        children: [
            {
                path: '',
                component: DashboardComponent
            },
            {
                path: 'employees',
                component:EmployeesComponent
            },
            {
                path: 'logs',
                component:LogsComponent
            },
            {
                path: 'overviews',
                component:OverviewsComponent
            }
        ]
    },
];