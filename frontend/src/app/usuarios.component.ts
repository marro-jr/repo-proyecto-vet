import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Usuario, UsuarioDatos, UsuariosService, Rol } from './usuarios.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-vh-100 bg-light py-4">
      <div class="container">
        <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
          <div>
            <h1 class="h3 fw-bold mb-1">Gestión de usuarios</h1>
            <p class="text-secondary mb-0">Lista, registra y administra las cuentas del sistema.</p>
          </div>
          <a class="btn btn-outline-secondary" routerLink="/panel">Volver al panel</a>
        </div>

        <div *ngIf="mensaje" class="alert alert-success" role="status">{{ mensaje }}</div>
        <div *ngIf="error" class="alert alert-danger" role="alert">{{ error }}</div>

        <section class="dashboard-card mb-4">
          <h2 class="h5 fw-bold mb-3">{{ usuarioEditando ? 'Editar usuario' : 'Registrar usuario' }}</h2>
          <form (ngSubmit)="guardar()" #formUsuario="ngForm">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label" for="nombre">Nombre</label>
                <input id="nombre" name="nombre" class="form-control" [(ngModel)]="datos.nombre" required />
              </div>
              <div class="col-md-6">
                <label class="form-label" for="apellido">Apellido</label>
                <input id="apellido" name="apellido" class="form-control" [(ngModel)]="datos.apellido" required />
              </div>
              <div class="col-md-6">
                <label class="form-label" for="correo">Correo</label>
                <input id="correo" name="correo" type="email" class="form-control" [(ngModel)]="datos.correo" required />
              </div>
              <div class="col-md-6">
                <label class="form-label" for="password">{{ usuarioEditando ? 'Nueva contraseña (opcional)' : 'Contraseña' }}</label>
                <input id="password" name="password" type="password" class="form-control"
                  [(ngModel)]="datos.password" [required]="!usuarioEditando" />
              </div>
              <div class="col-md-6">
                <label class="form-label" for="estado">Estado</label>
                <select id="estado" name="estado" class="form-select" [(ngModel)]="datos.estado">
                  <option value="ACTIVO">Activo</option>
                  <option value="INACTIVO">Inactivo</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label" for="rol">Rol</label>
                <select id="rol" name="rol" class="form-select" [(ngModel)]="datos.idRol" required>
                  <option *ngFor="let rol of roles" [ngValue]="rol.idRol">{{ rol.nombre }}</option>
                </select>
              </div>
            </div>
            <div class="d-flex gap-2 mt-4">
              <button class="btn btn-primary" type="submit" [disabled]="guardando || formUsuario.invalid">
                {{ guardando ? 'Guardando...' : (usuarioEditando ? 'Guardar cambios' : 'Registrar usuario') }}
              </button>
              <button *ngIf="usuarioEditando" class="btn btn-outline-secondary" type="button" (click)="cancelarEdicion()">
                Cancelar
              </button>
            </div>
          </form>
        </section>

        <section class="dashboard-card">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <h2 class="h5 fw-bold mb-0">Usuarios registrados</h2>
            <button class="btn btn-outline-primary btn-sm" type="button" (click)="cargarUsuarios()" [disabled]="cargando">
              Actualizar lista
            </button>
          </div>

          <div *ngIf="cargando" class="text-secondary py-3">Cargando usuarios...</div>
          <div *ngIf="!cargando && usuarios.length === 0" class="text-secondary py-3">
            Todavía no hay usuarios registrados.
          </div>

          <div *ngIf="!cargando && usuarios.length > 0" class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Nombre</th><th>Correo</th><th>Rol</th><th>Estado</th><th>Creación</th><th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let usuario of usuarios">
                  <td>{{ usuario.nombre }} {{ usuario.apellido }}</td>
                  <td>{{ usuario.correo }}</td>
                  <td>{{ usuario.nombreRol }}</td>
                  <td>{{ usuario.estado }}</td>
                  <td>{{ usuario.fechaCreacion }}</td>
                  <td class="text-nowrap">
                    <button class="btn btn-sm btn-outline-primary me-2" type="button" (click)="editar(usuario)">Editar</button>
                    <button class="btn btn-sm btn-outline-danger" type="button" (click)="eliminar(usuario)">Eliminar</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  `
})
export class UsuariosComponent implements OnInit {
  private usuariosService = inject(UsuariosService);
  private cdr = inject(ChangeDetectorRef);

  usuarios: Usuario[] = [];
  roles: Rol[] = [];
  usuarioEditando: Usuario | null = null;
  cargando = false;
  guardando = false;
  mensaje = '';
  error = '';

  datos: UsuarioDatos = this.datosVacios();

  ngOnInit(): void {
    this.usuariosService.listarRoles().subscribe({
      next: roles => {
        this.roles = roles;
        this.datos.idRol = roles.find(rol => rol.nombre === 'USER')?.idRol ?? roles[0]?.idRol ?? 0;
        this.cdr.detectChanges();
      },
      error: err => {
        this.mostrarError(err);
        this.cdr.detectChanges();
      }
    });
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.cargando = true;
    this.cdr.detectChanges();
    this.usuariosService.listar().subscribe({
      next: usuarios => {
        this.usuarios = usuarios;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: err => {
        this.cargando = false;
        this.mostrarError(err);
        this.cdr.detectChanges();
      }
    });
  }

  guardar(): void {
    this.error = '';
    this.mensaje = '';
    this.guardando = true;
    this.cdr.detectChanges();
    const peticion = this.usuarioEditando
      ? this.usuariosService.actualizar(this.usuarioEditando.idUsuario, this.datos)
      : this.usuariosService.registrar(this.datos);

    peticion.subscribe({
      next: () => {
        this.mensaje = this.usuarioEditando ? 'Usuario actualizado.' : 'Usuario registrado.';
        this.guardando = false;
        this.cancelarEdicion();
        this.cargarUsuarios();
        this.cdr.detectChanges();
      },
      error: err => {
        this.guardando = false;
        this.mostrarError(err);
        this.cdr.detectChanges();
      }
    });
  }

  editar(usuario: Usuario): void {
    this.usuarioEditando = usuario;
    this.datos = {
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      correo: usuario.correo,
      password: '',
      estado: usuario.estado,
      idRol: usuario.idRol
    };
    this.mensaje = '';
    this.error = '';
    this.cdr.detectChanges();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelarEdicion(): void {
    this.usuarioEditando = null;
    this.datos = this.datosVacios();
    this.datos.idRol = this.roles.find(rol => rol.nombre === 'USER')?.idRol ?? this.roles[0]?.idRol ?? 0;
    this.cdr.detectChanges();
  }

  eliminar(usuario: Usuario): void {
    if (!window.confirm(`¿Eliminar a ${usuario.nombre} ${usuario.apellido}?`)) return;
    this.error = '';
    this.mensaje = '';
    this.cdr.detectChanges();
    this.usuariosService.eliminar(usuario.idUsuario).subscribe({
      next: () => {
        this.mensaje = 'Usuario eliminado.';
        this.cargarUsuarios();
        this.cdr.detectChanges();
      },
      error: err => {
        this.mostrarError(err);
        this.cdr.detectChanges();
      }
    });
  }

  private datosVacios(): UsuarioDatos {
    return { nombre: '', apellido: '', correo: '', password: '', estado: 'ACTIVO', idRol: 0 };
  }

  private mostrarError(err: any): void {
    this.error = err?.error?.detail || err?.error?.error || 'No se pudo completar la operación. Verifica el backend y el acceso de administrador.';
  }
}
