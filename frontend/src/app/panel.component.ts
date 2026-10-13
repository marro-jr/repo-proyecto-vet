import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { UsuarioService, UsuarioDTO, RolDTO } from './usuario.service';

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-vh-100 bg-light d-flex flex-column">

      <nav class="navbar navbar-expand-lg bg-navbar-black px-4 py-3 shadow-sm">
        <div class="container-fluid">
          <a class="navbar-brand fw-bold d-flex align-items-center gap-2 text-white" href="javascript:void(0)">
            <span class="fs-4">🐾</span>
            <span class="fs-5 tracking-wide">PetaPet</span>
          </a>

          <div class="d-flex align-items-center gap-3 ms-auto navbar-user-info">
            <span class="text-white small fw-medium">{{ usuarioLogueado }}</span>
            <span [ngClass]="rol === 'ADMIN' ? 'role-badge-admin' : 'role-badge-user'">
              ROL: {{ rol }}
            </span>

            <button type="button" class="btn btn-outline-light btn-sm ms-2" (click)="cerrarSesion()">
              <i class="bi bi-box-arrow-right me-1"></i>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      <main class="container my-4 flex-grow-1">

        <div *ngIf="exitoMensaje" class="alert alert-success alert-dismissible fade show d-flex align-items-center gap-2" role="alert">
          <i class="bi bi-check-circle-fill"></i>
          <div>{{ exitoMensaje }}</div>
          <button type="button" class="btn-close ms-auto" (click)="exitoMensaje = ''"></button>
        </div>

        <div *ngIf="errorMensaje" class="alert alert-danger alert-dismissible fade show d-flex align-items-center gap-2" role="alert">
          <i class="bi bi-exclamation-triangle-fill"></i>
          <div>{{ errorMensaje }}</div>
          <button type="button" class="btn-close ms-auto" (click)="errorMensaje = ''"></button>
        </div>

        <div *ngIf="rol !== 'ADMIN'" class="dashboard-card text-center py-5">
          <div class="fs-1 text-secondary mb-3">
            <i class="bi bi-person-badge"></i>
          </div>
          <h4 class="fw-bold text-dark">Portal de Recepción PetaPet</h4>
          <p class="text-secondary max-w-md mx-auto mb-2">
            Sesión iniciada como <strong>{{ usuarioLogueado }}</strong> (Rol: <strong>USER</strong>).
          </p>
          <div class="alert alert-secondary d-inline-block small text-muted px-4 py-2 mt-2">
            <i class="bi bi-shield-lock me-1"></i>
            La administración de cuentas y acceso a la sección de usuarios es exclusiva para Administradores (ADMIN).
          </div>
        </div>

        <div *ngIf="rol === 'ADMIN'">

          <div *ngIf="mostrarFormulario" class="card shadow-sm border-0 rounded-4 mb-4">
            <div class="card-header bg-white py-3 border-0 d-flex justify-content-between align-items-center">
              <h5 class="fw-bold mb-0 text-dark">
                <i class="bi" [ngClass]="editandoId ? 'bi-pencil-square text-primary' : 'bi-person-plus-fill text-teal'"></i>
                {{ editandoId ? 'Modificar Usuario #' + editandoId : 'Registrar Nuevo Usuario' }}
              </h5>
              <button type="button" class="btn btn-outline-secondary btn-sm" (click)="cancelarFormulario()">
                <i class="bi bi-x-lg"></i>
              </button>
            </div>
            <div class="card-body px-4 pb-4 pt-2">
              <form (submit)="$event.preventDefault(); guardarUsuario()" autocomplete="off">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label small fw-semibold text-secondary">Nombre *</label>
                    <input type="text" class="form-control" [(ngModel)]="formNombre" name="formNombre" placeholder="Ej: Carlos" required />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label small fw-semibold text-secondary">Apellido *</label>
                    <input type="text" class="form-control" [(ngModel)]="formApellido" name="formApellido" placeholder="Ej: Mendoza" required />
                  </div>

                  <div class="col-md-6">
                    <label class="form-label small fw-semibold text-secondary">Correo Institucional *</label>
                    <input type="email" class="form-control" [(ngModel)]="formCorreo" name="formCorreo" placeholder="usuario@vet.test" required />
                  </div>

                  <div class="col-md-6">
                    <label class="form-label small fw-semibold text-secondary">
                      Contraseña {{ editandoId ? '(Opcional al editar)' : '*' }}
                    </label>
                    <input
                      type="password"
                      class="form-control"
                      [(ngModel)]="formPassword"
                      name="formPassword"
                      [placeholder]="editandoId ? 'Dejar en blanco para mantener la actual' : 'Ingrese contraseña'"
                      [required]="!editandoId"
                    />
                  </div>

                  <div class="col-md-6">
                    <label class="form-label small fw-semibold text-secondary">Rol *</label>
                    <select class="form-select" [(ngModel)]="formIdRol" name="formIdRol" required>
                      <option [ngValue]="null" disabled>Selecciona un rol</option>
                      <option *ngFor="let r of roles" [ngValue]="r.idRol">
                        {{ r.nombre }} - {{ r.descripcion }}
                      </option>
                    </select>
                  </div>

                  <div class="col-md-6">
                    <label class="form-label small fw-semibold text-secondary">Estado *</label>
                    <select class="form-select" [(ngModel)]="formEstado" name="formEstado" required>
                      <option value="ACTIVO">ACTIVO</option>
                      <option value="INACTIVO">INACTIVO</option>
                    </select>
                  </div>
                </div>

                <div class="d-flex justify-content-end gap-2 mt-4">
                  <button type="button" class="btn btn-outline-secondary px-3" (click)="cancelarFormulario()">
                    Cancelar
                  </button>
                  <button type="submit" class="btn btn-primary-custom px-4" [disabled]="guardando">
                    <span *ngIf="guardando" class="spinner-border spinner-border-sm me-1"></span>
                    {{ editandoId ? 'Actualizar Usuario' : 'Crear Usuario' }}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div class="card shadow-sm border-0 rounded-4">
            <div class="card-header bg-white py-3 border-0 d-flex flex-wrap justify-content-between align-items-center gap-2">
              <div>
                <h5 class="fw-bold mb-1 text-dark">
                  <i class="bi bi-people-fill text-teal me-2"></i>Gestión de Usuarios Clínicos
                </h5>
                <p class="text-secondary small mb-0">
                  Módulo administrativo con control de acceso por roles y contraseñas protegidas con BCrypt.
                </p>
              </div>

              <div class="d-flex gap-2">
                <button type="button" class="btn btn-outline-secondary btn-sm" (click)="cargarUsuarios()" [disabled]="cargando">
                  <i class="bi bi-arrow-clockwise me-1"></i>
                  Refrescar
                </button>
                <button *ngIf="!mostrarFormulario" type="button" class="btn btn-primary-custom btn-sm" (click)="abrirNuevo()">
                  <i class="bi bi-person-plus-fill me-1"></i>
                  Nuevo Usuario
                </button>
              </div>
            </div>

            <div class="table-responsive">
              <table class="table table-hover align-middle mb-0">
                <thead class="table-light text-secondary small">
                  <tr>
                    <th># ID</th>
                    <th>Nombre Completo</th>
                    <th>Correo</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th>Fecha Alta</th>
                    <th class="text-end pe-4">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngIf="cargando">
                    <td colspan="7" class="text-center py-4 text-secondary">
                      <div class="spinner-border spinner-border-sm text-teal me-2"></div>
                      Cargando listado de usuarios...
                    </td>
                  </tr>

                  <tr *ngIf="!cargando && usuarios.length === 0">
                    <td colspan="7" class="text-center py-4 text-muted">
                      No hay usuarios registrados en el sistema.
                    </td>
                  </tr>

                  <tr *ngFor="let u of usuarios">
                    <td class="fw-bold text-secondary">#{{ u.idUsuario }}</td>
                    <td class="fw-medium text-dark">{{ u.nombre }} {{ u.apellido }}</td>
                    <td>{{ u.correo }}</td>
                    <td>
                      <span [ngClass]="u.rol === 'ADMIN' ? 'role-badge-admin' : 'role-badge-user'">
                        {{ u.rol }}
                      </span>
                    </td>
                    <td>
                      <span class="badge" [ngClass]="u.estado === 'ACTIVO' ? 'bg-success' : 'bg-secondary'">
                        {{ u.estado }}
                      </span>
                    </td>
                    <td class="text-secondary small">{{ u.fechaCreacion }}</td>
                    <td class="text-end pe-4">
                      <button
                        type="button"
                        class="btn btn-outline-primary btn-sm me-2"
                        (click)="abrirEditar(u)"
                        title="Modificar usuario"
                      >
                        <i class="bi bi-pencil-fill"></i>
                      </button>
                      <button
                        type="button"
                        class="btn btn-outline-danger btn-sm"
                        (click)="eliminar(u)"
                        title="Eliminar usuario"
                      >
                        <i class="bi bi-trash-fill"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="card-footer bg-white border-0 py-3 text-secondary small d-flex justify-content-between align-items-center">
              <span>Total de usuarios: <strong>{{ usuarios.length }}</strong></span>
              <span class="text-muted">Desarrollo Web Integrado &bull; Sección 5</span>
            </div>
          </div>

        </div>

      </main>

      <footer class="bg-white border-top py-3 text-center text-muted small mt-auto">
        PetaPet &bull; Sistema Clínico Veterinario &bull; Módulo de Usuarios
      </footer>

    </div>
  `
})
export class PanelComponent implements OnInit {
  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);

  usuarios: UsuarioDTO[] = [];
  roles: RolDTO[] = [];

  cargando = false;
  guardando = false;
  errorMensaje = '';
  exitoMensaje = '';

  mostrarFormulario = false;
  editandoId: number | null = null;

  formNombre = '';
  formApellido = '';
  formCorreo = '';
  formPassword = '';
  formIdRol: number | null = null;
  formEstado: 'ACTIVO' | 'INACTIVO' = 'ACTIVO';

  get rol(): string | null {
    return this.authService.obtenerRol();
  }

  get usuarioLogueado(): string | null {
    return this.authService.obtenerCorreo();
  }

  ngOnInit() {
    if (this.rol === 'ADMIN') {
      this.cargarRoles();
      this.cargarUsuarios();
    }
  }

  cargarRoles() {
    this.usuarioService.obtenerRoles().subscribe({
      next: (data) => {
        this.roles = data;
        if (this.roles.length > 0 && this.formIdRol === null) {
          this.formIdRol = this.roles[0].idRol;
        }
      },
      error: () => {}
    });
  }

  cargarUsuarios() {
    this.cargando = true;
    this.errorMensaje = '';
    this.usuarioService.listarUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.cargando = false;
      },
      error: (err) => {
        this.cargando = false;
        this.errorMensaje = err.error?.error || 'No fue posible cargar el listado de usuarios.';
      }
    });
  }

  abrirNuevo() {
    this.editandoId = null;
    this.formNombre = '';
    this.formApellido = '';
    this.formCorreo = '';
    this.formPassword = '';
    this.formEstado = 'ACTIVO';
    this.formIdRol = this.roles.length > 0 ? this.roles[0].idRol : null;
    this.mostrarFormulario = true;
    this.errorMensaje = '';
    this.exitoMensaje = '';
  }

  abrirEditar(u: UsuarioDTO) {
    this.editandoId = u.idUsuario || null;
    this.formNombre = u.nombre;
    this.formApellido = u.apellido;
    this.formCorreo = u.correo;
    this.formPassword = '';
    this.formEstado = u.estado || 'ACTIVO';
    this.formIdRol = u.idRol;
    this.mostrarFormulario = true;
    this.errorMensaje = '';
    this.exitoMensaje = '';
  }

  cancelarFormulario() {
    this.mostrarFormulario = false;
    this.editandoId = null;
  }

  guardarUsuario() {
    if (!this.formNombre || !this.formApellido || !this.formCorreo || !this.formIdRol) {
      this.errorMensaje = 'Por favor completa todos los campos requeridos.';
      return;
    }

    if (!this.editandoId && !this.formPassword) {
      this.errorMensaje = 'La contraseña es obligatoria para registrar un nuevo usuario.';
      return;
    }

    this.guardando = true;
    this.errorMensaje = '';
    this.exitoMensaje = '';

    const payload: UsuarioDTO = {
      nombre: this.formNombre.trim(),
      apellido: this.formApellido.trim(),
      correo: this.formCorreo.trim(),
      password: this.formPassword.trim(),
      estado: this.formEstado,
      idRol: this.formIdRol
    };

    if (this.editandoId) {
      this.usuarioService.actualizarUsuario(this.editandoId, payload).subscribe({
        next: () => {
          this.guardando = false;
          this.exitoMensaje = 'Usuario actualizado correctamente.';
          this.mostrarFormulario = false;
          this.cargarUsuarios();
        },
        error: (err) => {
          this.guardando = false;
          this.errorMensaje = err.error?.error || 'No fue posible actualizar el usuario.';
        }
      });
    } else {
      this.usuarioService.registrarUsuario(payload).subscribe({
        next: () => {
          this.guardando = false;
          this.exitoMensaje = 'Usuario registrado exitosamente.';
          this.mostrarFormulario = false;
          this.cargarUsuarios();
        },
        error: (err) => {
          this.guardando = false;
          this.errorMensaje = err.error?.error || 'No fue posible registrar el usuario.';
        }
      });
    }
  }

  eliminar(u: UsuarioDTO) {
    if (!u.idUsuario) return;
    const confirmacion = confirm(`¿Estás seguro de eliminar al usuario ${u.nombre} ${u.apellido} (${u.correo})?`);
    if (!confirmacion) return;

    this.errorMensaje = '';
    this.exitoMensaje = '';
    this.usuarioService.eliminarUsuario(u.idUsuario).subscribe({
      next: () => {
        this.exitoMensaje = `Usuario #${u.idUsuario} eliminado exitosamente.`;
        this.cargarUsuarios();
      },
      error: (err) => {
        this.errorMensaje = err.error?.error || 'No fue posible eliminar el usuario.';
      }
    });
  }

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
