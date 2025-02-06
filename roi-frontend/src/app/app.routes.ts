import { Routes } from '@angular/router';

//COMPONENTES
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/advisor/dashboard/dashboard.component';
import { AddPropertyComponent } from './features/property/add-property/add-property.component';
import { UpdatePropertyComponent } from './features/property/update-property/update-property.component';
import { RegisterTransactionComponent } from './features/transaction/register-transaction/register-transaction.component';
import { UpdateTransactionComponent } from './features/transaction/update-transaction/update-transaction.component';
import { UpdateProfileComponent } from './features/advisor/update-profile/update-profile.component';
import { ViewPropertyComponent } from './features/property/view-property/view-property.component';
import { ViewTransactionComponent } from './features/transaction/view-transaction/view-transaction.component';
import { PropertyListComponent } from './features/property/property-list/property-list.component';
import { TransactionListComponent } from './features/transaction/transaction-list/transaction-list.component';
import { ViewProfileComponent } from './features/advisor/view-profile/view-profile.component';
import { ChangePasswordComponent } from './features/advisor/change-password/change-password.component';
import { PropertyComponent } from './public/property/property.component';

// GUARDS
import { authGuard } from './core/guards/auth.guard';
import { authenticatedGuard } from './core/guards/authenticated.guard';


export const routes: Routes = [
    { path: 'login', component: LoginComponent, canActivate: [authenticatedGuard] },
    { path: 'update-profile', component: UpdateProfileComponent, canActivate: [authGuard] },
    { path: 'view-profile', component: ViewProfileComponent, canActivate: [authGuard] },
    { path: 'change-password', component: ChangePasswordComponent, canActivate: [authGuard] },
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
    { path: 'property-list', component: PropertyListComponent, canActivate: [authGuard] },
    { path: 'view-property/:id', component: ViewPropertyComponent, canActivate: [authGuard] },
    { path: 'add-property', component: AddPropertyComponent, canActivate: [authGuard] },
    { path: 'update-property/:id', component: UpdatePropertyComponent, canActivate: [authGuard] },
    { path: 'transaction-list', component: TransactionListComponent, canActivate: [authGuard] },
    { path: 'view-transaction/:id', component: ViewTransactionComponent, canActivate: [authGuard] },
    { path: 'register-transaction/:id', component: RegisterTransactionComponent, canActivate: [authGuard] },
    { path: 'update-transaction/:id', component: UpdateTransactionComponent, canActivate: [authGuard] },
    { path: 'property', component: PropertyComponent, canActivate: [authGuard] },
    { path: '**', redirectTo: 'dashboard' },
];
