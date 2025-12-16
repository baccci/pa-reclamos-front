# Contexto del Proyecto - Guía para Agentes

Este documento contiene toda la información de contexto necesaria para trabajar en el proyecto, incluyendo arquitectura, tipos de datos, y convenciones.

---

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

### 📍 Dónde Trabajar Según el Tipo de Usuario

- **Funcionalidad para Cliente** → `/src/features/dashboard/cliente/`
- **Funcionalidad para Empleado** → `/src/features/dashboard/empleado/`
- **Funcionalidad para Administrador** → `/src/features/dashboard/admin/`
- **Autenticación/Registro** → `/src/features/auth/`
- **Código compartido/global** → `/src/[carpeta]` (components, constants, hooks, services, stores, types, utils)

---

## 🔌 API Client Global

### ¿Qué es?

El **API Client Global** es un objeto único (`api`) que centraliza todas las llamadas al backend.  
Está ubicado en `src/lib/api/index.ts` y es la **única puerta de entrada** al backend desde el frontend.

Para este trabajo práctico, se decidió implementar una versión **simple y directa** del cliente, orientada a cumplir el deadline:

- Un solo archivo (`src/lib/api/index.ts`).
- Un helper `request()` que maneja `fetch`, headers, token y parseo de errores.
- Un objeto `api` con funciones organizadas por **funcionalidad** (auth, proyectos, reclamos, etc.), mapeando 1:1 los endpoints documentados en `api-json.json`.

### Implementación actual (basada en OpenAPI del backend)

El objeto `api` expone, entre otros, los siguientes grupos de métodos:

- **Auth (`/auth/*`)**
  - `api.auth.login`
  - `api.auth.registerCliente`
  - `api.auth.registerEmpleado`

- **Proyectos (`/proyecto*`, `/tipo-proyecto*`)**
  - `api.proyectos.crear`, `api.proyectos.listar`, `api.proyectos.obtenerPorId`,
    `api.proyectos.actualizar`, `api.proyectos.eliminar`, `api.proyectos.listarPorTipoProyecto`
  - `api.tipoProyecto.listar`, `api.tipoProyecto.obtenerPorId`

- **Reclamos y tipos (`/reclamo*`, `/tipo-reclamo*`, `/cambio-estado*`)**
  - `api.reclamos.crear`, `api.reclamos.listarPorCliente`,
    `api.reclamos.actualizarEstado`, `api.reclamos.reasignarArea`, `api.reclamos.actualizar`
  - `api.tipoReclamo.listar`, `api.tipoReclamo.obtenerPorId`
  - `api.cambioEstado.listarPorReclamo`, `api.cambioEstado.listarPorEstado`

- **Áreas (`/area*`)**
  - `api.areas.crear`, `api.areas.listar`, `api.areas.obtenerPorId`,
    `api.areas.actualizar`, `api.areas.eliminar`

- **Cliente y empleado (`/cliente/update`, `/empleado/*`)**
  - `api.cliente.actualizarPerfil`
  - `api.empleado.actualizarPerfil`, `api.empleado.asignarArea`

Todos estos métodos usan `NEXT_PUBLIC_BACKEND_UR` como base de URL y, cuando corresponde,
aceptan un `token` (JWT) para autenticación.

### Reglas de uso para agentes

- **No introducir nuevos `fetch` directos** en componentes o hooks; siempre usar `api`.
- Si se necesita un nuevo método y el endpoint ya existe en el backend:
  - Agregar la función directamente en `src/lib/api/index.ts` bajo el grupo que corresponda.
  - Seguir la misma firma (datos + `token` cuando aplique).
- Cualquier lógica adicional de transformación de datos puede vivir en hooks/servicios de feature,
  pero las llamadas HTTP crudas se concentran en `api`.

### Uso con TanStack Query (React Query)

Los agentes deben preferir **TanStack Query** para manejo de datos remotos.  
Directrices y ejemplos:

- **Lectura (GET) → `useQuery`**:

```typescript
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { useAuthStore } from "@/stores/auth"

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
```

- **Escritura (POST/PUT/PATCH/DELETE) → `useMutation`**:

```typescript
import { useMutation } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { useAuthStore } from "@/stores/auth"

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
```

- **Auth con `useMutation`**:

```typescript
import { useMutation } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { useAuthStore } from "@/stores/auth"

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth)

  return useMutation({
    mutationFn: (payload: { email: string; contraseña: string }) =>
      api.auth.login(payload),
    onSuccess: (data) => {
      setAuth({ accessToken: data.access_token })
    },
  })
}
```

Los agentes pueden además usar `queryClient.invalidateQueries(...)` tras mutaciones para refrescar
listas afectadas (por ejemplo, invalidar `["proyectos"]` tras crear/editar/eliminar un proyecto).

### Nota de diseño (futuro refactor)

El diseño ideal planteado para largo plazo es:

- Servicios por feature (`features/[feature]/services/*-api.ts`).
- `src/lib/api/index.ts` actuando como barrel export que compone esos servicios.

Sin embargo, para este TP se priorizó una implementación **monolítica pero clara** en `src/lib/api/index.ts`,
ya completamente alineada con el OpenAPI del backend y suficiente para todas las tareas listadas en `tareas.md`.

---

## 📊 Tipos TypeScript - Modelos de Datos

### Estados de Reclamo

```typescript
export type Estados = "PENDIENTE" | "EN_PROCESO" | "RESUELTO"
```

### Cliente

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

**Funcionalidades del Cliente:**
- Gestionar sus proyectos (crear, listar, modificar, eliminar)
- Crear reclamos asociados a sus proyectos
- Ver y modificar sus reclamos (si no están resueltos)
- Ver historial de cambios de estado de sus reclamos

### Empleado

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
```

**Funcionalidades del Empleado:**
- Ver reclamos asignados a su área
- Actualizar estado de reclamos
- Reasignar reclamos a otras áreas
- Ver perfil de clientes y sus proyectos/reclamos
- Ver reportes y estadísticas de su área

### Área

```typescript
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

### Proyecto

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

### Reclamo

```typescript
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

**Flujo de Estados de Reclamo:**
- **PENDIENTE** → Puede pasar a **EN_PROCESO** o **RESUELTO**
- **EN_PROCESO** → Puede pasar a **RESUELTO**
- **RESUELTO** → Estado final, no se puede modificar

**Validaciones Importantes:**
- Un reclamo no puede ser actualizado por empleados de la misma área
- Solo empleados de la misma área pueden reasignar reclamos
- Los clientes solo pueden modificar reclamos si el estado NO es "RESUELTO"
- Al reasignar un reclamo, su estado vuelve a "PENDIENTE"

---

## 🔐 Autenticación y Roles

### Roles del Sistema

- **cliente**: Usuario que crea proyectos y reclamos
- **empleado**: Usuario que gestiona reclamos de su área
- **admin**: Usuario administrador con acceso completo

### Protección de Rutas

- **Clientes**: Acceso solo a sus proyectos y reclamos
- **Empleados**: Acceso a reclamos de su área y clientes
- **Administradores**: Acceso completo al sistema

---

## 📝 Convenciones de Código

### Nombres de Archivos y Funciones
- **kebab-case** para TODOS los archivos: `proyecto-list.tsx`, `use-proyectos.ts`, `reclamo-detail.tsx`
- Los componentes React también deben usar kebab-case en el nombre del archivo
- **kebab-case** para TODAS las funciones: `crear-reclamo()`, `listar-proyectos()`, `actualizar-estado()`

### Estructura de Componentes
- Componentes específicos de una feature van en `features/[feature]/components/`
- Componentes globales van en `src/components/`

### Estructura de Servicios
- Servicios específicos de una feature van en `features/[feature]/services/`
- Servicios globales van en `src/services/`

### Uso del API Client
- **SIEMPRE** usar `api` desde `@/lib/api`
- **NUNCA** hacer llamadas directas al backend desde componentes
- Organizar métodos por funcionalidad, no por rol

---

## 🎯 Resumen de Funcionalidades por Rol

### Cliente
- ✅ CRUD de Proyectos
- ✅ Crear reclamos
- ✅ Ver y modificar sus reclamos
- ✅ Ver historial de cambios de estado
- ✅ Dashboard con estadísticas

### Empleado
- ✅ Ver reclamos de su área
- ✅ Actualizar estado de reclamos
- ✅ Reasignar reclamos a otras áreas
- ✅ Ver perfil de clientes
- ✅ Ver proyectos y reclamos de clientes
- ✅ Reportes y estadísticas

### Administrador
- ✅ CRUD de Áreas y Sub-áreas
- ✅ CRUD de Usuarios
- ✅ Asignar roles y permisos
- ✅ Gestionar configuración del sistema

---

Este documento debe ser consultado antes de comenzar cualquier tarea para entender la arquitectura, tipos de datos y convenciones del proyecto.

