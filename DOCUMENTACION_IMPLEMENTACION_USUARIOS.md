# Implementación de usuarios

## Qué se añadió

- CRUD REST: `GET /usuarios`, `POST /usuarios`, `PUT /usuarios/{id}` y `DELETE /usuarios/{id}`. Se mantienen protegidos por JWT y rol `ADMIN`.
- Arquitectura por capas: `UsuarioController` delega en `UsuarioService`, que usa `UsuarioRepository`; la respuesta usa DTOs y no incluye contraseñas.
- JPQL en `UsuarioRepository.listarConRol()` para listar usuarios con su rol: `SELECT u FROM Usuario u JOIN FETCH u.rol`.
- `GET /usuarios/roles` como ruta auxiliar para llenar el selector del formulario.
- Pantalla Angular `/usuarios` para listar, registrar, editar y eliminar. Se abre desde el panel con **Gestionar usuarios** y requiere una sesión ADMIN.
- Las cuentas de prueba del perfil `dev` son `admin@petapet.test` / `admin123` y `user@petapet.test` / `user123`. Las contraseñas se guardan con BCrypt.
- El login usa `app.css` como hoja global, y se quitaron el emoji, “Portal Clínico Veterinario” y las tarjetas de atención/certificación.

## Verificación

La compilación del backend (`mvn -DskipTests compile`) y la compilación de Angular (`npm run build`) terminaron correctamente. No se ejecutaron pruebas automatizadas ni una sesión completa contra la base local.

## Uso local

1. En MySQL, crear la base `veterinaria_db` si no existe.
2. Iniciar `PetApplication (dev)` desde VS Code; el perfil `dev` crea los usuarios de prueba. Mantener el proceso activo.
3. Iniciar Angular y abrir `http://localhost:4200/login`.
4. Entrar como `admin@petapet.test` para abrir **Gestionar usuarios** desde el panel.
