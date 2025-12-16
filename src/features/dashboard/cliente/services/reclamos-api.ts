import { apiClient } from "@/lib/api/api-client"
import type { Estados, Reclamo } from "@/types/reclamos-empleados"
import type { ReclamoDetalle } from "@/types/reclamos-empleados"
import type { Area, TipoReclamo } from "@/types/reclamos-empleados"

export interface ListarMiosParams {
  estado?: Estados
  desde?: string // YYYY-MM-DD
  hasta?: string // YYYY-MM-DD
  proyecto?: string
}

function toQuery(params: Record<string, string | undefined>) {
  const qs = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v) qs.set(k, v)
  })
  const s = qs.toString()
  return s ? `?${s}` : ""
}

export const reclamosClienteApi = {
  listarMios: async (params: ListarMiosParams = {}): Promise<Reclamo[]> => {
    const q = toQuery({
      estado: params.estado,
      desde: params.desde,
      hasta: params.hasta,
      proyecto: params.proyecto,
    })
    return apiClient<Reclamo[]>(`/reclamos/mios${q}`, { method: "GET" })
  },
  obtener: async (id: string): Promise<ReclamoDetalle> => {
    return apiClient<ReclamoDetalle>(`/reclamos/${id}`, { method: "GET" })
  },

  listarTiposReclamo: async (): Promise<TipoReclamo[]> => {
  return apiClient<TipoReclamo[]>("/tipos-reclamo", { method: "GET" })
},

    listarAreas: async (): Promise<Area[]> => {
    return apiClient<Area[]>("/areas", { method: "GET" })
    },

    modificar: async (
    id: string,
    payload: {
        descripcion: string
        prioridad: string
        criticidad: string
        tipoReclamoId: string
        areaId?: string
        archivo?: string
    },
    ): Promise<{ ok: true }> => {
    return apiClient<{ ok: true }>(`/reclamos/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    })
    },


}
