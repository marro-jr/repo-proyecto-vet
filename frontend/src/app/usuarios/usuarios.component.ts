import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DatosUsuario, Rol, Usuario, UsuarioService } from './usuario.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-vh-100 bg-light d-flex flex-column">
      <nav class="navbar bg-navbar-black px-4 py-3 shadow-sm">
        <div class="container-fluid">
          <a class="navbar-brand fw-bold text-white" routerLink="/panel">PetaPet</a>
          <a class="btn btn-outline-light btn-sm" routerLink="/panel">
            <i class="bi bi-arrow-left me-1"></i>
            Volver al panel
          </a>
        </div>
      </nav>

      <main class="container my-4 flex-grow-1">
        <div class="mb-4">
          <h1 class="h3 fw-bold mb-1">Gestión de usuarios</h1>
          <p class="text-secondary mb-0">Administra las cuentas y roles del sistema.</p>
        </div>

        <div *ngIf="mensajeExito" class="alert alert-success" role="status">
          {{ mensajeExito }}
        </div>

        <div *ngIf="mensajeError" class="alert alert-danger" role="alert">
          {{ mensajeError }}
        </div>

        <section class="dashboard-card mb-4">
          <h2 class="h5 fw-bold mb-3">
            {{ usuarioSeleccionado ? 'Editar usuario' : 'Registrar usuario' }}
          </h2>

          <form [formGroup]="formularioUsuario" (ngSubmit)="guardarUsuario()">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label" for="nombre">Nombre</label>
                <input id="nombre" class="form-control" formControlName="nombre" />
                <div *ngIf="campoInvalido('nombre')" class="text-danger small mt-1">
                  <span *ngIf="formularioUsuario.get('nombre')?.hasError('required')">
                    El nombre es obligatorio.
                  </span>
                  <span *ngIf="formularioUsuario.get('nombre')?.hasError('minlength')">
                    El nombre debe tener al menos 2 caracteres.
                  </span>
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label" for="apellido">Apellido</label>
                <input id="apellido" class="form-control" formControlName="apellido" />
                <div *ngIf="campoInvalido('apellido')" class="text-danger small mt-1">
                  <span *ngIf="formularioUsuario.get('apellido')?.hasError('required')">
                    El apellido es obligatorio.
                  </span>
                  <span *ngIf="formularioUsuario.get('apellido')?.hasError('minlength')">
                    El apellido debe tener al menos 2 caracteres.
                  </span>
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label" for="correo">Correo</label>
                <input id="correo" type="email" class="form-control" formControlName="correo" />
                <div *ngIf="campoInvalido('correo')" class="text-danger small mt-1">
                  <span *ngIf="formularioUsuario.get('correo')?.hasError('required')">
                    El correo es obligatorio.
                  </span>
                  <span *ngIf="formularioUsuario.get('correo')?.hasError('email')">
                    Ingresa un correo válido.
                  </span>
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label" for="password">
                  {{ usuarioSeleccionado ? 'Nueva contraseña (opcional)' : 'Contraseña' }}
                </label>
                <input
                  id="password"
                  type="password"
                  class="form-control"
                  formControlName="password"
                />
                <div *ngIf="campoInvalido('password')" class="text-danger small mt-1">
                  <span *ngIf="formularioUsuario.get('password')?.hasError('required')">
                    La contraseña es obligatoria.
                  </span>
                  <span *ngIf="formularioUsuario.get('password')?.hasError('minlength')">
                    La contraseña debe tener al menos 6 caracteres.
                  </span>
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label" for="rol">Rol</label>
                <select id="rol" class="form-select" formControlName="idRol">
                  <option [ngValue]="0" disabled>Selecciona un rol</option>
                  <option *ngFor="let rol of listaRoles" [ngValue]="rol.idRol">
                    {{ rol.nombre }} - {{ rol.descripcion }}
                  </option>
                </select>
                <div *ngIf="campoInvalido('idRol')" class="text-danger small mt-1">
                  Selecciona un rol.
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label" for="estado">Estado</label>
                <select id="estado" class="form-select" formControlName="estado">
                  <option value="ACTIVO">Activo</option>
                  <option value="INACTIVO">Inactivo</option>
                </select>
              </div>
            </div>

            <div class="d-flex gap-2 mt-4">
              <button class="btn btn-primary" type="submit" [disabled]="estaGuardando">
                {{
                  estaGuardando
                    ? 'Guardando...'
                    : usuarioSeleccionado
                      ? 'Guardar cambios'
                      : 'Registrar usuario'
                }}
              </button>
              <button
                *ngIf="usuarioSeleccionado"
                class="btn btn-outline-secondary"
                type="button"
                (click)="cancelarEdicion()"
              >
                Cancelar
              </button>
            </div>
          </form>
        </section>

        <section class="dashboard-card">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <h2 class="h5 fw-bold mb-0">Usuarios registrados</h2>
            <button
              class="btn btn-outline-primary btn-sm"
              type="button"
              (click)="cargarUsuarios()"
              [disabled]="estaCargando"
            >
              Actualizar lista
            </button>
          </div>

          <div *ngIf="estaCargando" class="text-secondary py-3">Cargando usuarios...</div>

          <div *ngIf="!estaCargando && listaUsuarios.length === 0" class="text-secondary py-3">
            No hay usuarios registrados.
          </div>

          <div *ngIf="!estaCargando && listaUsuarios.length > 0" class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Creación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let usuario of listaUsuarios">
                  <td>{{ usuario.nombre }} {{ usuario.apellido }}</td>
                  <td>{{ usuario.correo }}</td>
                  <td>{{ usuario.rol }}</td>
                  <td>{{ usuario.estado }}</td>
                  <td>{{ usuario.fechaCreacion }}</td>
                  <td class="text-nowrap">
                    <button
                      class="btn btn-sm btn-outline-primary me-2"
                      type="button"
                      (click)="editarUsuario(usuario)"
                    >
                      Editar
                    </button>
                    <button
                      class="btn btn-sm btn-outline-danger"
                      type="button"
                      (click)="eliminarUsuario(usuario)"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  `,
})
export class UsuariosComponent implements OnInit {
  private usuarioService = inject(UsuarioService);
  private detectorCambios = inject(ChangeDetectorRef);

  listaUsuarios: Usuario[] = [];
  listaRoles: Rol[] = [];
  usuarioSeleccionado: Usuario | null = null;
  formularioUsuario = new FormGroup({
    nombre: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    apellido: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    correo: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
    estado: new FormControl<'ACTIVO' | 'INACTIVO'>('ACTIVO', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    idRol: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
    }),
  });
  formularioEnviado = false;
  estaCargando = false;
  estaGuardando = false;
  mensajeExito = '';
  mensajeError = '';

  ngOnInit(): void {
    this.cargarRoles();
    this.cargarUsuarios();
  }

  cargarRoles(): void {
    this.usuarioService.listarRoles().subscribe({
      next: (roles) => {
        this.listaRoles = roles;
        if (!this.usuarioSeleccionado) {
          this.formularioUsuario.patchValue({ idRol: this.obtenerRolPredeterminado() });
        }
        this.detectorCambios.detectChanges();
      },
      error: (error) => this.mostrarError(error, 'No fue posible cargar los roles.'),
    });
  }

  cargarUsuarios(): void {
    this.estaCargando = true;
    this.mensajeError = '';
    this.detectorCambios.detectChanges();

    this.usuarioService.listarUsuarios().subscribe({
      next: (usuarios) => {
        this.listaUsuarios = usuarios;
        this.estaCargando = false;
        this.detectorCambios.detectChanges();
      },
      error: (error) => {
        this.estaCargando = false;
        this.mostrarError(error, 'No fue posible cargar los usuarios.');
      },
    });
  }

  guardarUsuario(): void {
    this.formularioEnviado = true;

    if (this.formularioUsuario.invalid) {
      this.formularioUsuario.markAllAsTouched();
      this.mensajeError = 'Revisa los campos del formulario.';
      this.detectorCambios.detectChanges();
      return;
    }

    this.estaGuardando = true;
    this.mensajeExito = '';
    this.mensajeError = '';
    this.detectorCambios.detectChanges();

    const formulario = this.formularioUsuario.getRawValue();
    const datosUsuario: DatosUsuario = {
      nombre: formulario.nombre.trim(),
      apellido: formulario.apellido.trim(),
      correo: formulario.correo.trim(),
      password: formulario.password,
      estado: formulario.estado,
      idRol: formulario.idRol,
    };
    const solicitud = this.usuarioSeleccionado
      ? this.usuarioService.actualizarUsuario(this.usuarioSeleccionado.idUsuario, datosUsuario)
      : this.usuarioService.registrarUsuario(datosUsuario);

    solicitud.subscribe({
      next: () => {
        this.mensajeExito = this.usuarioSeleccionado
          ? 'Usuario actualizado correctamente.'
          : 'Usuario registrado correctamente.';
        this.estaGuardando = false;
        this.cancelarEdicion();
        this.cargarUsuarios();
      },
      error: (error) => {
        this.estaGuardando = false;
        this.mostrarError(error, 'No fue posible guardar el usuario.');
      },
    });
  }

  editarUsuario(usuario: Usuario): void {
    this.usuarioSeleccionado = usuario;
    this.formularioUsuario.setValue({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      correo: usuario.correo,
      password: '',
      estado: usuario.estado,
      idRol: usuario.idRol,
    });
    this.actualizarValidadoresPassword();
    this.formularioEnviado = false;
    this.mensajeExito = '';
    this.mensajeError = '';
    this.detectorCambios.detectChanges();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelarEdicion(): void {
    this.usuarioSeleccionado = null;
    this.formularioUsuario.reset({
      nombre: '',
      apellido: '',
      correo: '',
      password: '',
      estado: 'ACTIVO',
      idRol: this.obtenerRolPredeterminado(),
    });
    this.actualizarValidadoresPassword();
    this.formularioEnviado = false;
    this.detectorCambios.detectChanges();
  }

  eliminarUsuario(usuario: Usuario): void {
    const nombreCompleto = usuario.nombre + ' ' + usuario.apellido;
    if (!window.confirm('¿Eliminar a ' + nombreCompleto + '?')) {
      return;
    }

    this.mensajeExito = '';
    this.mensajeError = '';
    this.usuarioService.eliminarUsuario(usuario.idUsuario).subscribe({
      next: () => {
        this.mensajeExito = 'Usuario eliminado correctamente.';
        this.cargarUsuarios();
      },
      error: (error) => this.mostrarError(error, 'No fue posible eliminar el usuario.'),
    });
  }

  campoInvalido(nombreCampo: string): boolean {
    const campo = this.formularioUsuario.get(nombreCampo);
    return !!campo && campo.invalid && (campo.touched || this.formularioEnviado);
  }

  private actualizarValidadoresPassword(): void {
    const campoPassword = this.formularioUsuario.controls.password;
    const validadores = this.usuarioSeleccionado
      ? [Validators.minLength(6)]
      : [Validators.required, Validators.minLength(6)];
    campoPassword.setValidators(validadores);
    campoPassword.updateValueAndValidity();
  }

  private obtenerRolPredeterminado(): number {
    return (
      this.listaRoles.find((rol) => rol.nombre === 'USER')?.idRol ?? this.listaRoles[0]?.idRol ?? 0
    );
  }

  private mostrarError(error: HttpErrorResponse, mensajePredeterminado: string): void {
    const respuesta = error.error as { error?: string; detail?: string } | null;
    this.mensajeError = respuesta?.detail || respuesta?.error || mensajePredeterminado;
    this.detectorCambios.detectChanges();
  }
}
