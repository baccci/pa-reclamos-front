export interface EmpleadoRef {
  id: string
  nombre: string
  email?: string
}

export interface NotaReclamo {
  id: string
  reclamoId: string
  empleadoId: string
  contenido: string
  createdAt: Date | string
  updatedAt: Date | string
  empleado?: EmpleadoRef
}
