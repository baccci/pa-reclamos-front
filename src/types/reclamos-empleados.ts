export type Estados = "PENDIENTE" | "EN_PROCESO" | "RESUELTO"

export interface Area {
  id: string
  nombre: string
  descripcion?: string
}

export interface Cliente {
  id: string
  nombre: string
  email: string
  telefono: string
}

export interface Proyecto {
  id: string
  nombre: string
  descripcion?: string
}

export interface TipoReclamo {
  id: string
  nombre: string
  descripcion?: string
}

export interface Reclamo {
  id: string
  tipoReclamoId: string
  proyectoId: string
  estado: Estados
  prioridad: string
  criticidad: string
  archivo?: string
  descripcion: string
  createdAt: Date | string
  updatedAt: Date | string

  tipoReclamo?: TipoReclamo
  proyecto?: Proyecto
  cliente?: Cliente
  areaActual?: Area
}

export interface ListarPorAreaParams {
  estado?: Estados
  desde?: string // YYYY-MM-DD
  hasta?: string // YYYY-MM-DD
  proyecto?: string
}

export interface EmpleadoRef {
  id: string
  nombre: string
  email?: string
}

export interface CambioEstado {
  id: string
  reclamoId: string
  empleadoId?: string
  clienteId?: string
  areaId: string
  fechaInicio: Date | string
  fechaFin?: Date | string
  descripcion?: string
  estado: Estados

  area?: Area
  empleado?: EmpleadoRef
  cliente?: Cliente
}

export interface ReclamoDetalle extends Reclamo {
  cambioEstado?: CambioEstado[]
}
