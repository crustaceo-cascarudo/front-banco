import { Routes } from '@angular/router';
import { Dashboard } from './components/pages/dashboard/dashboard';
import { Landing } from './components/pages/landing/landing';
import { LoginRegister } from './components/pages/login-register/login-register';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: '', component: Landing },
    { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
    { path: 'login', component: LoginRegister },
    { path: '**', redirectTo: '', pathMatch: 'full' },
];
