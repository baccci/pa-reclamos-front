"use client"

import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api"
import { useAuthStore } from "@/stores/auth"

interface ReclamoCompleto {
  id: string
  estado: string
  createdAt: string
  updatedAt: string
  [key: string]: unknown
}

/**
 * Obtiene los reclamos propios del cliente usando GET /reclamo (rol CLIENTE).
 */
function useClienteReclamos() {
  const token = useAuthStore((state) => state.auth?.access_token)

  return useQuery<ReclamoCompleto[]>({
    queryKey: ["cliente", "mis-reclamos"],
    queryFn: async () => {
      if (!token) throw new Error("No authentication token")
      const response = await api.reclamos.listarPorCliente(token)
      return Array.isArray(response) ? (response as ReclamoCompleto[]) : []
    },
    enabled: !!token,
  })
}

/**
 * Cuenta los reclamos propios del cliente agrupados por estado.
 * Usa GET /reclamo (CLIENTE) y calcula client-side.
 */
export function useReclamosPorEstado() {
  const { data: reclamos = [], isLoading, error } = useClienteReclamos()

  const counts = {
    pendientes: reclamos.filter((r) => r.estado === "PENDIENTE").length,
    enProceso: reclamos.filter((r) => r.estado === "EN_PROCESO").length,
    resueltos: reclamos.filter((r) => r.estado === "RESUELTO").length,
  }

  return {
    data: reclamos.length > 0 ? counts : undefined,
    isLoading,
    error,
  }
}

/**
 * Devuelve los reclamos del cliente para el gráfico de evolución.
 * Usa GET /reclamo (CLIENTE).
 */
export function useReclamosParaEvolucion() {
  return useClienteReclamos()
}
