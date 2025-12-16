import { apiClient } from "@/lib/api/api-client"
import type { Proyecto } from "@/types/entities"

const ENDPOINTS = {
  // 🔁 Cambiá esto si tu backend usa otra ruta
  listarMisProyectos: "/proyectos/mis",
}

export const proyectosClienteApi = {
  listar: async (): Promise<Proyecto[]> => {
    return apiClient<Proyecto[]>(ENDPOINTS.listarMisProyectos, { method: "GET" })
  },
}
