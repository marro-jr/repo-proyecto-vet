# Sistema de gestión veterinaria

## Abrir y ejecutar en VS Code (Windows)

Abre en VS Code la carpeta `repo-proyecto-vet` (la que contiene `backend`, `frontend` y `sql`). Necesitas Java, Node.js/npm y MySQL 8. El backend usa el JDK 26 instalado en esta computadora; si tu JDK está en otra ubicación, cambia `JAVA_HOME` en `.vscode/tasks.json`.

1. Comprueba que el servicio **MySQL80** esté iniciado. La aplicación se conecta a `localhost:3306` como `root` y crea la base `veterinaria_db` si todavía no existe.
2. En VS Code abre **Terminal > Ejecutar tarea** y ejecuta **Backend: iniciar Spring Boot**. Escribe la clave de MySQL cuando la terminal la pida. Espera el mensaje de Spring Boot indicando que inició.
3. La primera vez, ejecuta la tarea **Frontend: instalar dependencias** y espera a que termine.
4. Ejecuta **Frontend: iniciar Angular**. Abre <http://localhost:4200>.

Ambas tareas de inicio deben quedar corriendo en sus terminales. El frontend envía las solicitudes de autenticación al backend en `http://localhost:8080`.

## Base de datos

El backend crea la base automáticamente al arrancar. Si necesitas además las tablas y datos iniciales definidos en el proyecto, abre `sql/BaseDatosPET.sql` en MySQL Workbench y ejecútalo después de crear la base. La configuración de Hibernate también crea o actualiza las tablas mapeadas por el backend.

La clave se solicita en la terminal y solo se mantiene en el proceso local de esa tarea; no está guardada en el repositorio. Para otra instalación, define `DB_PASSWORD` en el entorno antes de iniciar el backend. Puedes cambiar el host, puerto o nombre de la base con `DB_URL`, y el usuario con `DB_USERNAME`.

## Si no inicia

- **No se puede conectar a MySQL / Connection refused**: inicia el servicio MySQL y confirma que escucha en el puerto 3306.
- **Access denied for user root**: usa la clave correcta de MySQL; la clave del proyecto debe coincidir con la configurada en tu servidor local.
- **`ng` o `npm` no reconocido**: ejecuta primero **Frontend: instalar dependencias** y confirma que Node.js está instalado.
- **Error de Java o versión**: confirma que tienes JDK 21 o posterior y actualiza la ruta `JAVA_HOME` de la tarea de backend.
- **Puerto ocupado**: cierra la otra aplicación que usa el puerto 8080 (backend) o 4200 (frontend).

## CRUD de usuarios

La API usa el mismo recurso `/usuarios` para las cuatro operaciones. Los endpoints conservan la protección que ya tiene el proyecto: requieren un token JWT de un usuario con rol `ADMIN`. Primero inicia sesión en `POST /auth/login` y manda el token en el encabezado `Authorization: Bearer <token>`.

| Método | Endpoint | Acción |
| --- | --- | --- |
| GET | `/usuarios` | Lista usuarios |
| POST | `/usuarios` | Registra un usuario |
| PUT | `/usuarios/{id}` | Actualiza sus datos |
| DELETE | `/usuarios/{id}` | Elimina el usuario |

La implementación sigue las capas **Controller → Service → Repository**, con `Usuario` como entidad y DTOs para las peticiones y respuestas. `UsuarioRepository.listarConRol()` usa JPQL (`SELECT u FROM Usuario u JOIN FETCH u.rol`) para listar los usuarios con su rol. El formulario Angular obtiene las opciones de rol desde `GET /usuarios/roles`, una ruta auxiliar para llenar el selector.

Después de iniciar sesión como administrador, entra a `/panel` y pulsa **Gestionar usuarios** para abrir la pantalla Angular. Desde ahí puedes listar, registrar, editar y eliminar usuarios.

Para registrar en Postman, usa `POST http://localhost:8080/usuarios`, selecciona **Body → raw → JSON** y envía, por ejemplo:

```json
{
  "nombre": "Ana",
  "apellido": "Pérez",
  "correo": "ana@vet.test",
  "password": "clave123",
  "estado": "ACTIVO",
  "idRol": 2
}
```

`idRol` debe ser el ID de un rol existente (por ejemplo, consulta la tabla `rol`). Para actualizar, envía los mismos campos a `PUT /usuarios/{id}`; `password` puede omitirse o dejarse vacío para conservar la contraseña. Las respuestas nunca incluyen la contraseña. El POST responde 201, el DELETE responde 204 y un ID inexistente responde 404.
