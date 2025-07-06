import { Routes } from '@angular/router';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { VerticalComponent } from './views/dashboard/components/vertical/vertical.component';
import { PagesNotFoundComponent } from './views/pages-not-found/pages-not-found.component';
import { LoginComponent } from './views/auth/login/login.component';
import { GuardsGuard } from './core/guards/guards.guard';
import { AccessDeniedComponent } from './views/access-denied/access-denied.component';


export const routes: Routes = [
    {
        path:'',
        component:LoginComponent

    },

    {
        path:'dashboard',
        loadChildren: () => import('./views/dashboard/dashboard.route').then(m => m.DashboardRoutes),
        canActivate:[GuardsGuard]
    },
    
    {
        path:'not-authorized',
        component:AccessDeniedComponent
    },
    {
        path:'**',component:PagesNotFoundComponent

    }
];

