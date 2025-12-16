export interface TipoProyecto {
  id: string
  nombre: string
  descripcion?: string
  createdAt: Date | string
  updatedAt: Date | string
  deletedAt?: Date | string
}

export interface Proyecto {
  id: string
  clienteId: string
  tipoProyectoId: string
  nombre: string
  descripcion?: string
  createdAt: Date | string
  updatedAt: Date | string
  deletedAt?: Date | string
  tipoProyecto?: TipoProyecto
}
