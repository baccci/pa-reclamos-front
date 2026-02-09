# API Endpoints - Reclamos Backend

**Base URL**: `http://localhost:3000`
**Auth**: JWT Bearer Token en header `Authorization: Bearer <token>`

---

## Auth (`/auth`) - Público

| Método | Endpoint | Body | Respuesta |
|--------|----------|------|-----------|
| POST | `/auth/register-cliente` | RegisterDTO | `{ access_token }` |
| POST | `/auth/register-empleado` | RegisterDTO | `{ access_token }` |
| POST | `/auth/login` | LoginDTO | `{ access_token }` |

**RegisterDTO**:
```json
{
  "email": "user@example.com",        // requerido, email válido
  "contraseña": "password123",         // requerido, 6-18 caracteres
  "nombre": "Juan Pérez",             // requerido, max 50 caracteres
  "telefono": "+1234567890"            // requerido, formato teléfono
}
```

**LoginDTO**:
```json
{
  "email": "user@example.com",        // requerido
  "contraseña": "password123"          // requerido, 6-18 caracteres
}
```

---

## Cliente (`/cliente`) - Rol: CLIENTE

| Método | Endpoint | Body/Params | Respuesta |
|--------|----------|-------------|-----------|
| GET | `/cliente/me/:mail` | mail (path) | ClienteDTO |
| PATCH | `/cliente` | UpdateClienteDTO | boolean |

**ClienteDTO**:
```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "telefono": "+1234567890",
  "nombre": "Juan Pérez"
}
```

**UpdateClienteDTO** (todos opcionales):
```json
{
  "email": "newemail@example.com",
  "nombre": "Juan Nuevo",
  "telefono": "+9876543210"
}
```

---

## Empleado (`/empleado`) - Rol: EMPLEADO

| Método | Endpoint | Body/Params | Respuesta |
|--------|----------|-------------|-----------|
| GET | `/empleado/me/:mail` | mail (path) | EmpleadoDTO |
| PATCH | `/empleado` | UpdateEmpleadoDTO | boolean |
| PATCH | `/empleado/:id/area` | AsignarAreaDTO | boolean |

**EmpleadoDTO**:
```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "employee@example.com",
  "telefono": "+1234567890",
  "nombre": "Ana Gómez",
  "area": "507f1f77bcf86cd799439012"   // nullable
}
```

**UpdateEmpleadoDTO** (todos opcionales):
```json
{
  "email": "newemail@example.com",
  "nombre": "Ana Nueva",
  "telefono": "+9876543210"
}
```

**AsignarAreaDTO**:
```json
{ "areaId": "507f1f77bcf86cd799439012" }
```

---

## Reclamo (`/reclamo`)

| Método | Endpoint | Rol | Body/Params | Respuesta |
|--------|----------|-----|-------------|-----------|
| POST | `/reclamo` | CLIENTE | CreateReclamoDTO | ReclamoDTO |
| GET | `/reclamo` | CLIENTE | - | ReclamoCompletoDTO[] |
| GET | `/reclamo/area` | EMPLEADO | - | ReclamoCompletoDTO[] |
| GET | `/reclamo/filtros` | EMPLEADO | query params | number |
| GET | `/reclamo/tiempo-promedio-resolucion` | EMPLEADO | ?areaId= | number |
| GET | `/reclamo/cantidad-promedio-resolucion` | EMPLEADO | ?areaId= | number |
| GET | `/reclamo/:id` | Ambos | id (path) | ReclamoCompletoDTO |
| PATCH | `/reclamo/:id` | CLIENTE | UpdateReclamoDTO | ReclamoDTO |
| PUT | `/reclamo/change-estado/:id` | EMPLEADO | UpdateEstadoDTO | ReclamoDTO |
| PUT | `/reclamo/reassign-area/:id` | EMPLEADO | ReasignarAreaDTO | ReclamoDTO |

**CreateReclamoDTO**:
```json
{
  "tipoReclamoId": "...",    // requerido
  "proyectoId": "...",       // requerido
  "areaId": "...",           // requerido
  "descripcion": "Falla",    // requerido, max 80 chars
  "prioridad": "ALTA",       // ALTA | MEDIA | BAJA
  "criticidad": "MEDIA"      // ALTA | MEDIA | BAJA
}
```

**ReclamoDTO**:
```json
{
  "id": "...",
  "tipoReclamo": "...",
  "proyecto": "...",
  "prioridad": "ALTA",
  "criticidad": "MEDIA",
  "descripcion": "Falla en el sistema",
  "estado": "PENDIENTE",
  "areaId": "..."
}
```

**ReclamoCompletoDTO**:
```json
{
  "id": "...",
  "prioridad": "ALTA",
  "criticidad": "MEDIA",
  "descripcion": "Falla en el sistema",
  "estado": "PENDIENTE",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z",
  "tipoReclamo": { "id": "...", "nombre": "Error de Sistema" },
  "proyecto": {
    "id": "...",
    "nombre": "Proyecto 1",
    "cliente": { "id": "...", "nombre": "Juan Pérez" }
  }
}
```

**UpdateReclamoDTO** (todos opcionales):
```json
{
  "tipoReclamoId": "...",
  "areaId": "...",
  "descripcion": "Nueva desc",   // max 100 chars
  "prioridad": "MEDIA",
  "criticidad": "BAJA"
}
```

**UpdateEstadoDTO**:
```json
{
  "descripcion": "En proceso",    // requerido, max 100 chars
  "estado": "EN_PROCESO"          // PENDIENTE | EN_PROCESO | RESUELTO
}
```

**ReasignarAreaDTO**:
```json
{
  "descripcion": "Reasignado",    // requerido, max 100 chars
  "areaId": "..."                 // requerido
}
```

**FiltersDTO** (query params, todos opcionales):
```
?estado=PENDIENTE&clienteId=...&fechaDesde=2024-01-01&fechaHasta=2024-01-31
```

---

## Área (`/area`)

| Método | Endpoint | Rol | Body/Params | Respuesta |
|--------|----------|-----|-------------|-----------|
| POST | `/area` | EMPLEADO | CreateAreaDTO | boolean |
| GET | `/area` | Ambos | - | AreaDTO[] |
| GET | `/area/:id` | Ambos | id (path) | AreaDTO |
| PATCH | `/area/:id` | EMPLEADO | UpdateAreaDTO | boolean |
| DELETE | `/area/:id` | EMPLEADO | id (path) | boolean |

**AreaDTO**:
```json
{
  "id": "...",
  "nombre": "Ventas",
  "descripcion": "Área de ventas"   // opcional
}
```

**CreateAreaDTO**:
```json
{
  "nombre": "Ventas",               // requerido, max 50 chars
  "descripcion": "Área de ventas"   // opcional, max 100 chars
}
```

---

## Proyecto (`/proyecto`) - Rol: CLIENTE

| Método | Endpoint | Body/Params | Respuesta |
|--------|----------|-------------|-----------|
| POST | `/proyecto` | CreateProyectoDTO | boolean |
| GET | `/proyecto` | - | ProyectoDTO[] |
| GET | `/proyecto/:id` | id (path) | ProyectoDTO |
| GET | `/proyecto/tipo-proyecto/:id` | id (path) | ProyectoDTO[] |
| PATCH | `/proyecto/:id` | UpdateProyectoDTO | boolean |
| DELETE | `/proyecto/:id` | id (path) | boolean |

**ProyectoDTO**:
```json
{
  "id": "...",
  "nombre": "Proyecto 1",
  "descripcion": "Desarrollo de Software",
  "tipoProyectoId": "..."
}
```

**CreateProyectoDTO**:
```json
{
  "nombre": "Proyecto 1",           // requerido, max 40 chars
  "descripcion": "Desarrollo",      // opcional, max 150 chars
  "tipoProyectoId": "..."           // requerido
}
```

---

## Tipo Reclamo (`/tipo-reclamo`) - Autenticado

| Método | Endpoint | Respuesta |
|--------|----------|-----------|
| GET | `/tipo-reclamo` | TipoReclamoDTO[] |
| GET | `/tipo-reclamo/:id` | TipoReclamoDTO |

```json
{ "id": "...", "nombre": "Error de Sistema", "descripcion": "..." }
```

---

## Tipo Proyecto (`/tipo-proyecto`) - Autenticado

| Método | Endpoint | Respuesta |
|--------|----------|-----------|
| GET | `/tipo-proyecto` | TipoProyectoDTO[] |
| GET | `/tipo-proyecto/:id` | TipoProyectoDTO |

```json
{ "id": "...", "nombre": "Desarrollo", "descripcion": "..." }
```

---

## Cambio Estado (`/cambio-estado`)

| Método | Endpoint | Rol | Respuesta |
|--------|----------|-----|-----------|
| GET | `/cambio-estado/:id` | Ambos | CambioEstadoConUsuarioDTO[] |
| GET | `/cambio-estado/estado/:estado` | EMPLEADO | CambioEstadoDTO[] |

**CambioEstadoConUsuarioDTO**:
```json
{
  "id": "...",
  "reclamoId": "...",
  "fechaInicio": "2024-01-15T10:30:00Z",
  "fechaFin": "2024-01-15T14:30:00Z",
  "descripcion": "En proceso",
  "estado": "EN_PROCESO",
  "usuario": { "id": "...", "nombre": "Ana", "email": "ana@ex.com" },
  "area": { "id": "...", "nombre": "Soporte" }
}
```

---

## Enums

| Enum | Valores |
|------|---------|
| Estados | `PENDIENTE`, `EN_PROCESO`, `RESUELTO` |
| Medidas (prioridad/criticidad) | `ALTA`, `MEDIA`, `BAJA` |
| Roles | `CLIENTE`, `EMPLEADO` |

---

## Notas

- Todos los IDs son MongoDB ObjectIds (strings de 24 caracteres hex)
- Swagger disponible en `http://localhost:3000/api`
- CORS habilitado para `http://localhost:4000`
- Puerto por defecto: `3000` (configurable via `PORT` env var)
