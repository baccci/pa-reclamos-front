import { apiClient } from "@/lib/api/api-client"
import type { Estados, ListarPorAreaParams, Reclamo, ReclamoDetalle, Area } from "@/types/reclamos-empleados"
import type { NotaReclamo } from "@/types/notas-empleados"


const ENDPOINTS = {
  listarPorArea: "/reclamos/por-area",
  obtener: (id: string) => `/reclamos/${id}`,
  actualizarEstado: (id: string) => `/reclamos/${id}/estado`,
  listarAreas: "/areas",
  reasignarArea: (id: string) => `/reclamos/${id}/reasignar-area`,
    notas: (reclamoId: string) => `/reclamos/${reclamoId}/notas`,
  nota: (reclamoId: string, notaId: string) => `/reclamos/${reclamoId}/notas/${notaId}`,
}


function toQuery(params: Record<string, string | undefined>) {
  const qs = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v) qs.set(k, v)
  })
  const s = qs.toString()
  return s ? `?${s}` : ""
}

export const reclamosEmpleadoApi = {
  listarPorArea: async (params: ListarPorAreaParams = {}): Promise<Reclamo[]> => {
    const q = toQuery({
      estado: params.estado,
      desde: params.desde,
      hasta: params.hasta,
      proyecto: params.proyecto,
    })  
    return apiClient<Reclamo[]>(`${ENDPOINTS.listarPorArea}${q}`, { method: "GET" })
  },

  obtener: async (id: string): Promise<ReclamoDetalle> => {
    return apiClient<ReclamoDetalle>(ENDPOINTS.obtener(id), { method: "GET" })
  },

  actualizarEstado: async (
    id: string,
    estado: Estados,
    descripcion: string,
  ): Promise<{ ok: true }> => {
    return apiClient<{ ok: true }>(ENDPOINTS.actualizarEstado(id), {
      method: "PATCH",
      body: JSON.stringify({ estado, descripcion }),
    })
  },
    listarAreas: async (): Promise<Area[]> => {
        return apiClient<Area[]>(ENDPOINTS.listarAreas, { method: "GET" })
    },

    reasignarArea: async (
    id: string,
    areaId: string,
    descripcion: string,
    ): Promise<{ ok: true }> => {
    return apiClient<{ ok: true }>(ENDPOINTS.reasignarArea(id), {
        method: "PATCH",
        body: JSON.stringify({ areaId, descripcion }),
    })
    },

    listarNotas: async (reclamoId: string): Promise<NotaReclamo[]> => {
  return apiClient<NotaReclamo[]>(ENDPOINTS.notas(reclamoId), { method: "GET" })
},

    crearNota: async (reclamoId: string, contenido: string): Promise<NotaReclamo> => {
    return apiClient<NotaReclamo>(ENDPOINTS.notas(reclamoId), {
        method: "POST",
        body: JSON.stringify({ contenido }),
    })
    },

    editarNota: async (reclamoId: string, notaId: string, contenido: string): Promise<NotaReclamo> => {
    return apiClient<NotaReclamo>(ENDPOINTS.nota(reclamoId, notaId), {
        method: "PATCH",
        body: JSON.stringify({ contenido }),
    })
    },

    eliminarNota: async (reclamoId: string, notaId: string): Promise<{ ok: true }> => {
    return apiClient<{ ok: true }>(ENDPOINTS.nota(reclamoId, notaId), {
        method: "DELETE",
    })
    },


}
