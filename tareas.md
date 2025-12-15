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

4. **Nombres de archivos**: 
   - Usa kebab-case para nombres de archivos: `proyecto-list.tsx`, `use-proyectos.ts`
   - Usa PascalCase para componentes: `ProyectoList`, `ReclamoDetail`

### 📍 Dónde Trabajar Según la Tarea

- **Tareas de Cliente** → `/src/features/dashboard/cliente/`
- **Tareas de Empleado** → `/src/features/dashboard/empleado/`
- **Tareas de Administrador** → `/src/features/dashboard/admin/`
- **Autenticación/Registro** → `/src/features/auth/`
- **Código compartido/global** → `/src/[carpeta]` (components, constants, hooks, services, stores, types, utils)

---

## 🔌 API Client Global - **MUY IMPORTANTE**

### ¿Qué es?

El **API Client Global** es un objeto único (`api`) que centraliza todas las llamadas al backend. Está ubicado en `/src/lib/api/index.ts` y combina los módulos de API de todas las features usando el patrón **barrel export**.

### Estructura del API Client

El objeto `api` está organizado por **funcionalidad**, no por tipo de usuario:

```typescript
api/
├── auth/                    # Autenticación y registro
│   ├── login()
│   ├── registro()
│   └── recuperarPassword()
├── reclamos/               # Funcionalidades de reclamos (combinado)
│   ├── crear()             # Cliente
│   ├── listarMios()        # Cliente
│   ├── listarPorArea()     # Empleado
│   ├── actualizarEstado()  # Empleado
│   ├── reasignarArea()     # Empleado
│   └── obtener()            # Compartido
├── proyectos/              # Funcionalidades de proyectos
├── clientes/               # Funcionalidades de clientes
├── areas/                  # Funcionalidades de áreas (admin)
└── usuarios/               # Funcionalidades de usuarios (admin)
```

### ¿Cómo Funciona?

1. **Cada feature exporta su módulo de API** desde su carpeta `services/`:
   ```typescript
   // src/features/dashboard/cliente/services/reclamos-api.ts
   export const reclamosClienteApi = {
     crear: (data) => { /* ... */ },
     listarMios: () => { /* ... */ },
     modificar: (id, data) => { /* ... */ }
   }
   ```

2. **El archivo central importa y combina** todos los módulos:
   ```typescript
   // src/lib/api/index.ts
   import { reclamosClienteApi } from '@/features/dashboard/cliente/services/reclamos-api'
   import { reclamosEmpleadoApi } from '@/features/dashboard/empleado/services/reclamos-api'
   
   export const api = {
     reclamos: {
       ...reclamosClienteApi,
       ...reclamosEmpleadoApi,
     }
   }
   ```

3. **En cualquier parte de la app, importas y usas**:
   ```typescript
   import { api } from '@/lib/api'
   
   // Cliente creando reclamo
   await api.reclamos.crear(data)
   
   // Empleado actualizando estado
   await api.reclamos.actualizarEstado(id, "EN_PROCESO", "En revisión")
   ```

### ⚠️ Cómo Agregar Nuevas APIs

**Paso 1**: Crea el módulo de API en la feature correspondiente:

```typescript
// src/features/dashboard/cliente/services/proyectos-api.ts
export const proyectosClienteApi = {
  listar: async () => {
    // Lógica de llamada al backend
  },
  crear: async (data) => {
    // Lógica de llamada al backend
  },
  // ... más métodos
}
```

**Paso 2**: Importa el módulo en `/src/lib/api/index.ts`:

```typescript
// src/lib/api/index.ts
import { proyectosClienteApi } from '@/features/dashboard/cliente/services/proyectos-api'
```

**Paso 3**: Agrega el módulo al objeto `api`:

```typescript
export const api = {
  // ... otros módulos
  proyectos: {
    ...proyectosClienteApi,
    // Si hay métodos de otros roles, agrégalos aquí también
  },
}
```

**Paso 4**: Usa la API en tu código:

```typescript
import { api } from '@/lib/api'

const proyectos = await api.proyectos.listar()
```

### 📋 Ejemplos por Tipo de Usuario

**Cliente:**
```typescript
// Crear reclamo
await api.reclamos.crear(data)

// Listar mis reclamos
await api.reclamos.listarMios()

// Listar mis proyectos
await api.proyectos.listar()
```

**Empleado:**
```typescript
// Listar reclamos de mi área
await api.reclamos.listarPorArea()

// Actualizar estado de reclamo
await api.reclamos.actualizarEstado(id, "EN_PROCESO", "En revisión")

// Listar clientes
await api.clientes.listar()
```

**Admin:**
```typescript
// Listar todas las áreas
await api.areas.listar()

// Crear área
await api.areas.crear(data)

// Listar usuarios
await api.usuarios.listar()
```

### ✅ Ventajas de Esta Arquitectura

1. **Un solo lugar** para todas las llamadas API
2. **Sin duplicación** - cada método se define una vez
3. **Fácil de encontrar** - `api.reclamos.crear()` es intuitivo
4. **Escalable** - agregar nuevos métodos es simple
5. **Type-safe** - TypeScript ayuda con autocompletado
6. **Mantenible** - cambios en un solo lugar

### 🚨 Reglas Importantes

- **NUNCA** hagas llamadas directas al backend desde componentes
- **SIEMPRE** usa el objeto `api` global
- **Organiza** los métodos por funcionalidad, no por rol
- **Combina** métodos de diferentes roles en el mismo namespace cuando sea apropiado (ej: `api.reclamos.*`)

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