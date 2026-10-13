import { Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { PanelComponent } from './panel.component';
import { UsuariosComponent } from './usuarios.component';
import { authGuard } from './auth.guard';
import { roleGuard } from './role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'panel', component: PanelComponent, canActivate: [authGuard] },
  { path: 'usuarios', component: UsuariosComponent, canActivate: [authGuard, roleGuard], data: { rol: 'ADMIN' } },
  { path: 'admin', component: PanelComponent, canActivate: [authGuard, roleGuard], data: { rol: 'ADMIN' } }
];
