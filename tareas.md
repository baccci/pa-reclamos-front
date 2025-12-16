# Lista de tereas front

## 📁 Arquitectura de Carpetas

### Estructura General

La aplicación está organizada siguiendo una arquitectura basada en **features**. Las features principales se encuentran dentro de `/src/features/`, mientras que el **código compartido o global** va directamente en `/src/`.

```
src/
├── components/            # Componentes React globales/compartidos
├── constants/             # Constantes globales
├── hooks/                 # Custom hooks globales
├── lib/                   # Librerías y utilidades de bajo nivel
│   └── api/              # API Client Global (ver sección API Client)
├── stores/                # Estado global compartido
├── types/                 # Tipos TypeScript globales
├── utils/                 # Utilidades y helpers globales
└── features/
    ├── auth/              # Autenticación y registro
    ├── dashboard/         # Dashboard principal (ver estructura abajo)
    └── [otras-features]/
```

### Dashboard - Estructura por Tipo de Usuario

El **dashboard** es la parte principal de la aplicación y está ubicado en `/src/features/dashboard/`. 

Como el contenido del dashboard **cambia según el tipo de usuario** (cliente, empleado, administrador), se ha separado en **tres carpetas independientes** dentro de `dashboard/`:

```
src/features/dashboard/
├── cliente/          # Dashboard para usuarios tipo CLIENTE
├── empleado/         # Dashboard para usuarios tipo EMPLEADO
└── admin/            # Dashboard para usuarios tipo ADMINISTRADOR
```

### Estructura Interna de Cada Carpeta de Dashboard

**Cada una de estas tres carpetas** (`cliente/`, `empleado/`, `admin/`) **sigue la misma arquitectura estándar**:

```
dashboard/[tipo-usuario]/
├── components/       # Componentes React específicos de este dashboard
├── hooks/            # Custom hooks específicos
├── services/         # Servicios API y lógica de negocio
├── stores/           # Estado global (Zustand, Redux, etc.)
├── constants/        # Constantes y configuraciones
├── types/            # Tipos TypeScript específicos
└── utils/            # Utilidades y helpers
```

### Ejemplo de Estructura Completa

```
src/features/dashboard/
├── cliente/
│   ├── components/
│   │   ├── proyectos/
│   │   │   ├── proyecto-list.tsx
│   │   │   ├── proyecto-form.tsx
│   │   │   └── proyecto-card.tsx
│   │   ├── reclamos/
│   │   │   ├── reclamo-list.tsx
│   │   │   └── reclamo-detail.tsx
│   │   └── dashboard-layout.tsx
│   ├── hooks/
│   │   ├── use-proyectos.ts
│   │   └── use-reclamos.ts
│   ├── services/
│   │   ├── proyecto-service.ts
│   │   └── reclamo-service.ts
│   ├── stores/
│   │   └── dashboard-store.ts
│   ├── constants/
│   │   └── routes.ts
│   └── types/
│       └── dashboard.types.ts
│
├── empleado/
│   ├── components/
│   │   ├── reclamos/
│   │   ├── clientes/
│   │   └── dashboard-layout.tsx
│   ├── hooks/
│   ├── services/
│   ├── stores/
│   ├── constants/
│   └── types/
│
└── admin/
    ├── components/
    │   ├── usuarios/
    │   ├── areas/
    │   └── dashboard-layout.tsx
    ├── hooks/
    ├── services/
    ├── stores/
    ├── constants/
    └── types/
```

### ⚠️ Reglas Importantes

1. **Separación por tipo de usuario**: 
   - Si trabajas en funcionalidad para **CLIENTES** → trabaja en `/src/features/dashboard/cliente/`
   - Si trabajas en funcionalidad para **EMPLEADOS** → trabaja en `/src/features/dashboard/empleado/`
   - Si trabajas en funcionalidad para **ADMINISTRADORES** → trabaja en `/src/features/dashboard/admin/`

2. **Código compartido/global**: 
   - El código compartido entre diferentes features o tipos de usuario va **directamente en `/src/`**
   - Componentes globales → `/src/components/`
   - Constantes globales → `/src/constants/`
   - Hooks globales → `/src/hooks/`
   - Servicios globales → `/src/services/`
   - Stores globales → `/src/stores/`
   - Tipos globales → `/src/types/`
   - Utilidades globales → `/src/utils/`

3. **Estructura consistente**: 
   - **Siempre** respeta la estructura: `components/`, `hooks/`, `services/`, `stores/`, `constants/`, `types/`, `utils/`
   - Si no necesitas alguna de estas carpetas, simplemente no la crees, pero si la creas, sigue el patrón

4. **Nombres de archivos y funciones**: 
   - Usa kebab-case para TODOS los nombres de archivos: `proyecto-list.tsx`, `use-proyectos.ts`, `reclamo-detail.tsx`
   - Los componentes React también deben usar kebab-case en el nombre del archivo
   - Las funciones también deben usar kebab-case: `crear-reclamo()`, `listar-proyectos()`, `actualizar-estado()`

### 📍 Dónde Trabajar Según la Tarea

- **Tareas de Cliente** → `/src/features/dashboard/cliente/`
- **Tareas de Empleado** → `/src/features/dashboard/empleado/`
- **Tareas de Administrador** → `/src/features/dashboard/admin/`
- **Autenticación/Registro** → `/src/features/auth/`
- **Código compartido/global** → `/src/[carpeta]` (components, constants, hooks, services, stores, types, utils)

---

## 🔌 API Client Global - **MUY IMPORTANTE**

### ¿Qué es?

El **API Client Global** es un objeto único (`api`) que centraliza todas las llamadas al backend.  
Está ubicado en `src/lib/api/index.ts` y es la **única forma permitida** de hablar con el backend desde el frontend.

Para este trabajo práctico, en lugar de armar servicios por feature + barrel exports, usamos una versión
**simplificada y directa**: todas las funciones para cada endpoint están definidas en ese archivo, agrupadas
por funcionalidad.

### Implementación actual (TP)

- El cliente usa la variable de entorno **`NEXT_PUBLIC_BACKEND_UR`** como base de todas las URLs.
- Se define un helper interno `request()` que:
  - Construye la URL (`BASE_URL + path`).
  - Agrega cabecera `Authorization: Bearer <token>` si se le pasa un token.
  - Envía/recibe JSON.
  - Lanza errores con mensajes legibles cuando el backend devuelve `message`.
- Encima de `request()` se expone un objeto `api` con esta estructura (resumida):

```typescript
import { api } from "@/lib/api"

api.auth.login(...)
api.auth.registerCliente(...)
api.auth.registerEmpleado(...)

api.proyectos.crear(...)
api.proyectos.listar(...)
api.proyectos.obtenerPorId(...)
api.proyectos.actualizar(...)
api.proyectos.eliminar(...)
api.proyectos.listarPorTipoProyecto(...)

api.tipoProyecto.listar(...)
api.tipoProyecto.obtenerPorId(...)

api.reclamos.crear(...)
api.reclamos.listarPorCliente(...)
api.reclamos.actualizarEstado(...)
api.reclamos.reasignarArea(...)
api.reclamos.actualizar(...)

api.tipoReclamo.listar(...)
api.tipoReclamo.obtenerPorId(...)

api.cambioEstado.listarPorReclamo(...)
api.cambioEstado.listarPorEstado(...)

api.areas.crear(...)
api.areas.listar(...)
api.areas.obtenerPorId(...)
api.areas.actualizar(...)
api.areas.eliminar(...)

api.cliente.actualizarPerfil(...)

api.empleado.actualizarPerfil(...)
api.empleado.asignarArea(...)
```

### Reglas de uso

- **NUNCA** llames `fetch` directo al backend desde componentes o hooks.
- **SIEMPRE** usa el objeto `api` global (`import { api } from "@/lib/api"`).
- La lógica de UI (formularios, tablas, etc.) vive en cada feature, pero todas las llamadas HTTP pasan por `api`.

### Uso con TanStack Query (React Query)

En el front se recomienda usar **TanStack Query** para manejo de datos remotos (estado de carga, error, cache).

Ejemplos típicos:

```typescript
import { useQuery, useMutation } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { useAuthStore } from "@/stores/auth"

// 1) Ejemplo: listar proyectos del cliente autenticado
export function useProyectos() {
  const token = useAuthStore((s) => s.auth?.accessToken)

  return useQuery({
    queryKey: ["proyectos"],
    enabled: !!token,
    queryFn: () => {
      if (!token) throw new Error("No hay token")
      return api.proyectos.listar(token)
    },
  })
}

// 2) Ejemplo: crear proyecto
export function useCrearProyecto() {
  const token = useAuthStore((s) => s.auth?.accessToken)

  return useMutation({
    mutationFn: (payload: {
      nombre: string
      descripcion?: string
      tipoProyectoId: string
    }) => {
      if (!token) throw new Error("No hay token")
      return api.proyectos.crear(payload, token)
    },
  })
}

// 3) Ejemplo: login
export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth)

  return useMutation({
    mutationFn: (payload: { email: string; contraseña: string }) =>
      api.auth.login(payload),
    onSuccess: (data) => {
      // guardar token y/o usuario en el store
      setAuth({ accessToken: data.access_token })
    },
  })
}
```

Patrón general:

- **Consultas (`GET`)** → `useQuery` con `queryKey` descriptivo y `queryFn` que llama a `api.*`.
- **Mutaciones (`POST/PUT/PATCH/DELETE`)** → `useMutation` que llama a `api.*` y luego:
  - Actualiza el store de auth si es login/registro.
  - Invalida queries relevantes (`queryClient.invalidateQueries(["proyectos"])`, etc.).

### Nota sobre escalabilidad

A futuro (fuera del deadline del TP) se podría refactorizar a:

- Servicios por feature en `features/[feature]/services/*-api.ts`.
- `src/lib/api/index.ts` actuando como barrel export que combina esos módulos.

Pero la implementación actual ya respeta el concepto de **API Client Global** y es suficiente para la entrega.

---

## Clientes:
El cliente, en su dashboard va a tener proyectos y reclamos

La composición de los mismos va a ser:

1. Proyectos: 
```typescript
export interface Proyecto {
  id: string
  clienteId: string
  tipoProyectoId: string
  nombre: string
  descripcion?: string
  reclamos?: Reclamo[]
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
  cliente?: Cliente
  tipoProyecto?: TipoProyecto
}

export interface TipoProyecto {
  id: string
  nombre: string
  descripcion?: string
  proyectos?: Proyecto[]
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}
```

2. Reclamos: 
```typescript
export type Estados = "PENDIENTE" | "EN_PROCESO" | "RESUELTO"

export interface Reclamo {
  id: string
  tipoReclamoId: string
  proyectoId: string
  estado: Estados
  prioridad: string
  criticidad: string
  archivo?: string
  descripcion: string
  cambioEstado?: CambioEstado[]
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
  tipoReclamo?: TipoReclamo
  proyecto?: Proyecto
}

export interface TipoReclamo {
  id: string
  nombre: string
  descripcion?: string
  reclamos?: Reclamo[]
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}

export interface CambioEstado {
  id: string
  reclamoId: string
  empleadoId?: string
  clienteId?: string
  areaId: string
  fechaInicio: Date
  fechaFin?: Date
  descripcion?: string
  estado: Estados
  reclamo?: Reclamo
  area?: Area
  empleado?: Empleado
  cliente?: Cliente
}
```

3. Cliente:
```typescript
export interface Cliente {
  id: string
  email: string
  contraseña: string
  nombre: string
  telefono: string
  role: string
  proyectos?: Proyecto[]
  cambiosEstado?: CambioEstado[]
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}
```






## Empleado
El empleado en su dashboard, va a recibir los reclamos, al los cuáles les podrá actualizar el reclamo, reasignar el área del reclamo y también podra ver los reportes básicos, como cantidad de reclamos, estado, promedio de resolución

La composición del Empleado será:
```typescript
export interface Empleado {
  id: string
  email: string
  contraseña: string
  nombre: string
  telefono: string
  role: string
  areaId?: string
  area?: Area
  cambiosEstado?: CambioEstado[]
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}

export interface Area {
  id: string
  nombre: string
  descripcion?: string
  cambioEstado?: CambioEstado[]
  empleados?: Empleado[]
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}
```


### Tareas

## Autenticación y Registro - **Salvador**

- `[x] Pantalla de login (sin funcionalidad o funcionalidad incompleta).`
  - **Completar**: Implementar funcionalidad completa de inicio de sesión
  - Validar credenciales con backend
  - Manejar errores de autenticación
  - Redirigir según rol del usuario

- `[x] Pantalla de registro (sin funcionalidad o funcionalidad incompleta).`
  - **Completar**: Implementar funcionalidad completa de registro
  - Formulario con campos: nombre, email, teléfono, dirección
  - Validar que el email sea único
  - Enviar datos al backend
  - Mostrar mensajes de error/éxito

- [] **Recuperar contraseña**
  - Agregar enlace "¿Olvidaste tu contraseña?" en página de login
  - Página para ingresar email y solicitar restablecimiento
  - Página para ingresar nueva contraseña con token de validación
  - Integrar con backend para envío de email y validación de token


## Gestión de Proyectos (Cliente)

- [] **CRUD de Proyectos - Crear**
  - Nueva sección "Crear Proyecto"
  - Formulario con campos: nombre (requerido), descripción (requerido)
  - Selector de tipo de proyecto (leer tipos desde backend)
  - Validar campos requeridos
  - Guardar proyecto en backend
  - Mostrar mensaje de confirmación
  - Redirigir a lista de proyectos o actualizar vista

- [] **CRUD de Proyectos - Listar (Mis Proyectos)**
  - Sección "Mis Proyectos" en dashboard
  - Listar todos los proyectos del cliente autenticado
  - Mostrar: nombre, descripción, tipo de proyecto, fecha de creación
  - Cargar proyectos desde backend (no mockear)
  - Mostrar estado de carga y errores

- [] **CRUD de Proyectos - Modificar**
  - Permitir editar nombre y descripción del proyecto
  - Permitir cambiar tipo de proyecto
  - Validar que el proyecto pertenezca al cliente
  - Actualizar en backend
  - Mostrar mensaje de confirmación

- [] **CRUD de Proyectos - Eliminar**
  - Opción para eliminar proyecto (soft delete)
  - Confirmar eliminación antes de proceder
  - Validar que no tenga reclamos asociados (o mostrar advertencia)
  - Eliminar en backend
  - Actualizar lista

## Gestión de Reclamos (Cliente) - **Salvador**

- `[x] Crear reclamo (falta actualizar)`
  - **Completar**: Actualizar formulario completo según requerimientos

- [] **Registrar un Reclamo - Formulario completo**
  - Actualizar formulario "Registrar nuevo reclamo"
  - **Eliminar campo "título"** (no requerido)
  - **Agregar selector de proyecto** (leer proyectos del cliente desde backend)
  - **Agregar selector de área** (leer áreas disponibles desde backend)
  - Campos: tipo de reclamo (requerido), prioridad (requerido), criticidad (requerido), descripción (requerido), proyecto (requerido), área (requerido)
  - Permitir adjuntar archivos o imágenes
  - Validar todos los campos requeridos
  - Guardar reclamo en estado "PENDIENTE" con fecha/hora y cliente
  - Mostrar mensaje de confirmación
  - Redirigir a "Mis Reclamos" o mostrar el reclamo creado

- `[x] Mis reclamos (está mockeado, falta cargar desde el backend).`
  - **Completar**: Implementar lectura real desde backend

- [] **Visualizar Reclamos - Lista completa**
  - Actualizar "Mis Reclamos" para cargar desde backend (no mockear)
  - Listar todos los reclamos del cliente
  - Mostrar: tipo, estado actual, prioridad, criticidad, proyecto asociado, fecha de creación
  - **Filtros**: por estado, fecha y proyecto
  - Mostrar estado de carga y manejar errores

- [] **Visualizar Reclamos - Detalle e Historial**
  - Al seleccionar un reclamo, mostrar vista detallada
  - Mostrar información completa del reclamo
  - **Historial de estado en forma de línea de tiempo (timeline)**
  - Por cada cambio de estado mostrar:
    - Área por la cual pasó
    - Fecha/hora en que inició ese estado
    - Descripción de la acción
    - Responsable (empleado o cliente)
  - Visualizar archivos adjuntos
  - Mostrar proyecto y cliente asociados (con links navegables)

- [] **Modificar Reclamo**
  - Permitir modificar reclamo si el estado actual NO es "RESUELTO"
  - Campos editables: descripción, prioridad, criticidad, archivos, tipo de reclamo, área sugerida
  - Validar estado antes de permitir edición
  - Registrar cambios con fecha/hora y usuario (cliente)
  - Actualizar en backend
  - Mostrar mensaje de confirmación

## Gestión de Reclamos (Empleado)

- [] **Visualizar Reclamos Asignados al Área**
  - Listar solo los reclamos asignados al área o subárea del empleado
  - Mostrar lista con información relevante
  - **Filtros**: por estado, fecha y proyecto
  - Mostrar estado de carga

- [] **Visualizar Reclamos - Detalle completo**
  - Al seleccionar un reclamo, mostrar vista detallada
  - Mostrar información completa del reclamo
  - **Mostrar proyecto y cliente asociados** (con links navegables)
  - **Historial de estado en forma de línea de tiempo (timeline)**
  - Por cada cambio de estado mostrar: área, fecha/hora, descripción, responsable
  - Visualizar archivos adjuntos
  - Links navegables a proyecto y cliente relacionados

- [] **Actualizar Estado de Reclamo**
  - Formulario para actualizar estado del reclamo
  - Estados posibles: PENDIENTE, EN_PROCESO, RESUELTO
  - **Validaciones de transición**:
    - De "PENDIENTE" → "EN_PROCESO" o "RESUELTO"
    - De "EN_PROCESO" → "RESUELTO"
    - No permitir si estado actual es "RESUELTO"
  - **Campo obligatorio**: resumen de resolución (si se cierra como RESUELTO)
  - Campo para descripción de lo realizado
  - Almacenar: fecha/hora, empleado, descripción
  - **Validar**: El reclamo no puede ser actualizado por empleados de la misma área
  - Actualizar en backend
  - Mostrar mensaje de confirmación
  - Actualizar vista del reclamo

- [] **Reasignar Área del Reclamo**
  - Formulario para reasignar reclamo a otra área o subárea
  - Selector de área/subárea destino
  - Campo para descripción de la reasignación
  - **Validar**: Estado actual NO debe ser "RESUELTO"
  - **Validar**: Solo empleados de la misma área pueden reasignar
  - Al reasignar, actualizar estado del reclamo a "PENDIENTE"
  - Almacenar: fecha/hora, empleado, descripción
  - Actualizar en backend
  - Mostrar mensaje de confirmación

## Gestión de Clientes (Empleado)

- [] **Listar Clientes**
  - Sección "Clientes" en dashboard del empleado
  - Listar todos los clientes del sistema
  - Mostrar: nombre, email, teléfono, cantidad de proyectos, cantidad de reclamos
  - Filtros de búsqueda (opcional)
  - Paginación si es necesario

- [] **Ver Perfil de Cliente**
  - Al seleccionar un cliente, mostrar perfil completo
  - Mostrar información personal: nombre, email, teléfono, dirección
  - **Mostrar proyectos asociados** (lista con links)
  - **Mostrar reclamos asociados** (lista con links)
  - Links navegables a proyectos y reclamos
  - Timeline o resumen de actividad reciente

## Gestión de Áreas (Administrador) - **Salvador**

- [] **CRUD de Áreas - Listar**
  - Vista general de áreas
  - Listar todas las áreas del sistema
  - Mostrar: nombre, descripción, cantidad de empleados, cantidad de reclamos asignados

- [] **CRUD de Áreas - Crear**
  - Formulario para crear nueva área
  - Campos: nombre (requerido), descripción (opcional)
  - Validar campos
  - Guardar en backend
  - Mostrar mensaje de confirmación

- [] **CRUD de Áreas - Modificar**
  - Permitir editar nombre y descripción del área
  - Actualizar en backend
  - Mostrar mensaje de confirmación

- [] **CRUD de Áreas - Eliminar**
  - Opción para eliminar área (soft delete)
  - Validar que no tenga empleados o reclamos asignados
  - Confirmar eliminación
  - Eliminar en backend

- [] **CRUD de Sub-áreas - Listar**
  - Vista general de subáreas
  - Listar todas las subáreas del sistema
  - Mostrar: nombre, descripción, área padre, cantidad de reclamos asignados

- [] **CRUD de Sub-áreas - Crear**
  - Formulario para crear nueva subárea
  - Campos: nombre (requerido), descripción (opcional)
  - **Selector de área padre** (asignar subárea a un área)
  - Validar campos
  - Guardar en backend
  - Mostrar mensaje de confirmación

- [] **CRUD de Sub-áreas - Modificar**
  - Permitir editar nombre, descripción y área padre
  - Actualizar en backend
  - Mostrar mensaje de confirmación

- [] **CRUD de Sub-áreas - Eliminar**
  - Opción para eliminar subárea (soft delete)
  - Validar que no tenga reclamos asignados
  - Confirmar eliminación
  - Eliminar en backend

## Gestión de Usuarios (Administrador) - **Salvador**

- [] **Listar Usuarios**
  - Sección "Usuarios" en dashboard del administrador
  - Listar todos los usuarios del sistema (clientes, empleados, administradores)
  - Mostrar: nombre, email, rol, área (si es empleado), estado
  - Filtros por rol y área
  - Búsqueda por nombre o email

- [] **Ver Detalle de Usuario**
  - Al seleccionar un usuario, mostrar pantalla de detalle
  - Mostrar todos los datos del usuario
  - **Editar rol del usuario** (selector de roles)
  - **Editar área del usuario** (si el usuario es de tipo empleado, mostrar selector de áreas)
  - Validar cambios
  - Actualizar en backend
  - Mostrar mensaje de confirmación
  - Los cambios deben reflejarse en permisos y acceso del usuario

- [] **Asignación de Roles y Permisos**
  - Sistema para gestionar roles y permisos
  - Asignar roles a usuarios
  - Modificar permisos asociados a cada rol
  - Los cambios deben afectar el acceso a funcionalidades del sistema

## Seguridad y Autenticación - **Salvador**

- [] **Protección de Rutas**
  - Implementar protección de rutas según rol del usuario
  - Clientes: acceso solo a sus proyectos y reclamos
  - Empleados: acceso a reclamos de su área y clientes
  - Administradores: acceso completo
  - Redirigir a login si no está autenticado
  - Redirigir a dashboard apropiado según rol

- [] **Seguridad de Sesión**
  - Implementar tokens de sesión seguros o cookies seguras
  - Protección contra CSRF
  - Manejo seguro de tokens JWT
  - Refresh tokens para renovar sesión
  - Cerrar sesión automáticamente después de inactividad

## Comentarios y Notas

- []? **Notas Compartidas (Empleados)**
  - Panel de notas internas por reclamo
  - Solo visible para empleados del área asignada al reclamo
  - Cada nota registra: autor (empleado), fecha/hora, contenido
  - No visible para el cliente
  - Permitir crear, editar y eliminar notas
  - Formato de texto enriquecido (opcional)

## Reportes y Dashboard - **Salvador**

- [] **Reportes de Reclamos (Empleado)**
  - Sección de reportes para empleados
  - **Filtros**: cliente, proyecto, tipo de reclamo, estado, área, fecha
  - **Indicadores a mostrar**:
    - Cantidad de reclamos por mes
    - Reclamos en curso vs resueltos
    - Tiempo promedio de resolución
    - Carga de trabajo por área/responsable
    - Tipos de reclamos más frecuentes
  - Gráficos visuales de los datos

- []????? **Dashboard con Estadísticas (Cliente)**
  - Tablero con gráficos dinámicos para clientes
  - **Gráficos**: barras, tortas, líneas de tiempo
  - **Filtros**: fecha, área, estado
  - Visualizar estado y evolución de datos
  - Actualización automática según filtros aplicados
  - Métricas: cantidad de reclamos por estado, tiempo de resolución, etc.


## Consultas y Relaciones - **Salvador**

- [] **Consultar relación Cliente–Proyecto–Reclamo (Empleado)**
  - Desde el perfil del cliente: ver proyectos y reclamos asociados
  - Desde cada reclamo: ver a qué proyecto y cliente pertenece
  - La información debe mostrarse en enlaces navegables/etiquetas
  - Navegación bidireccional entre cliente, proyecto y reclamo