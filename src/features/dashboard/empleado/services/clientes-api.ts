import { apiClient } from "@/lib/api/api-client"
import type { ClienteDetalle, ClienteResumen } from "@/types/clientes-empleados"

const ENDPOINTS = {
  listar: "/clientes",
  obtener: (id: string) => `/clientes/${id}`,
}

export const clientesEmpleadoApi = {
  listar: async (): Promise<ClienteResumen[]> => {
    return apiClient<ClienteResumen[]>(ENDPOINTS.listar, { method: "GET" })
  },

  obtener: async (id: string): Promise<ClienteDetalle> => {
    return apiClient<ClienteDetalle>(ENDPOINTS.obtener(id), { method: "GET" })
  },
}
