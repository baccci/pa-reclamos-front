export interface ClienteResumen {
  id: string
  nombre: string
  email: string
  telefono: string
  proyectosCount?: number
  reclamosCount?: number
}

export interface ProyectoMini {
  id: string
  nombre: string
}

export interface ReclamoMini {
  id: string
  estado: "PENDIENTE" | "EN_PROCESO" | "RESUELTO"
  descripcion: string
  createdAt: Date | string
}

export interface ClienteDetalle extends ClienteResumen {
  proyectos?: ProyectoMini[]
  reclamos?: ReclamoMini[]
}
