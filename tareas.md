# Lista de tereas front

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

## Autenticación y Registro

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

## Gestión de Reclamos (Cliente)

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

## Gestión de Áreas (Administrador)

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

## Gestión de Usuarios (Administrador)

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

## Seguridad y Autenticación

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

## Reportes y Dashboard

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


## Consultas y Relaciones

- [] **Consultar relación Cliente–Proyecto–Reclamo (Empleado)**
  - Desde el perfil del cliente: ver proyectos y reclamos asociados
  - Desde cada reclamo: ver a qué proyecto y cliente pertenece
  - La información debe mostrarse en enlaces navegables/etiquetas
  - Navegación bidireccional entre cliente, proyecto y reclamo