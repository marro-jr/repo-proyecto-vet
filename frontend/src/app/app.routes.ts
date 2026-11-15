import { Routes } from '@angular/router';
import { LoginComponent } from './autenticacion/login.component';
import { authGuard } from './autenticacion/auth.guard';
import { roleGuard } from './autenticacion/role.guard';
import { CitasComponent } from './citas/citas.component';
import { PanelComponent } from './panel/panel.component';
import { ReportesComponent } from './reportes/reportes.component';
import { ServiciosComponent } from './servicios/servicios.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { VentasComponent } from './ventas/ventas.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'panel', component: PanelComponent, canActivate: [authGuard] },
  { path: 'servicios', component: ServiciosComponent, canActivate: [authGuard] },
  { path: 'citas', component: CitasComponent, canActivate: [authGuard] },
  { path: 'ventas', component: VentasComponent, canActivate: [authGuard] },
  {
    path: 'usuarios',
    component: UsuariosComponent,
    canActivate: [authGuard, roleGuard],
    data: { rol: 'ADMIN' },
  },
  {
    path: 'reportes',
    component: ReportesComponent,
    canActivate: [authGuard, roleGuard],
    data: { rol: 'ADMIN' },
  },
  {
    path: 'admin',
    component: PanelComponent,
    canActivate: [authGuard, roleGuard],
    data: { rol: 'ADMIN' },
  },
  { path: '**', redirectTo: 'login' },
];
