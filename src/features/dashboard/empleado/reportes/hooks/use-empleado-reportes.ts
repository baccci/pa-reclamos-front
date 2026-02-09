"use client"

import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api"
import { useAuthStore } from "@/stores/auth"

/**
 * Cuenta reclamos por estado usando GET /reclamo/filtros?estado=X (EMPLEADO).
 */
export function useReclamosPorEstado() {
  const token = useAuthStore((state) => state.auth?.access_token)

  return useQuery({
    queryKey: ["reportes", "reclamos-por-estado"],
    queryFn: async () => {
      if (!token) throw new Error("No authentication token")

      const [pendientes, enProceso, resueltos] = await Promise.all([
        api.reclamos.filtros({ estado: "PENDIENTE" }, token),
        api.reclamos.filtros({ estado: "EN_PROCESO" }, token),
        api.reclamos.filtros({ estado: "RESUELTO" }, token),
      ])

      return {
        pendientes: typeof pendientes === "number" ? pendientes : 0,
        enProceso: typeof enProceso === "number" ? enProceso : 0,
        resueltos: typeof resueltos === "number" ? resueltos : 0,
      }
    },
    enabled: !!token,
  })
}

/**
 * GET /reclamo/tiempo-promedio-resolucion?areaId=...
 * Devuelve number (días). Solo EMPLEADO.
 */
export function useTiempoPromedioResolucion(areaId: string | null | undefined) {
  const token = useAuthStore((state) => state.auth?.access_token)

  return useQuery<number>({
    queryKey: ["reportes", "tiempo-promedio-resolucion", areaId],
    queryFn: async () => {
      if (!token || !areaId) throw new Error("No authentication token or areaId")
      const result = await api.reclamos.tiempoPromedioResolucion(areaId, token)
      return typeof result === "number" ? result : 0
    },
    enabled: !!token && !!areaId,
  })
}

/**
 * GET /reclamo/cantidad-promedio-resolucion?areaId=...
 * Devuelve number entre 0 y 1. Solo EMPLEADO.
 */
export function usePorcentajeResolucion(areaId: string | null | undefined) {
  const token = useAuthStore((state) => state.auth?.access_token)

  return useQuery<number>({
    queryKey: ["reportes", "cantidad-promedio-resolucion", areaId],
    queryFn: async () => {
      if (!token || !areaId) throw new Error("No authentication token or areaId")
      const result = await api.reclamos.cantidadPromedioResolucion(areaId, token)
      return typeof result === "number" ? result : 0
    },
    enabled: !!token && !!areaId,
  })
}

/**
 * GET /reclamo/area - devuelve ReclamoCompletoDTO[]. Solo EMPLEADO.
 */
export function useReclamosParaEvolucion() {
  const token = useAuthStore((state) => state.auth?.access_token)

  return useQuery({
    queryKey: ["reportes", "reclamos-evolucion"],
    queryFn: async () => {
      if (!token) throw new Error("No authentication token")
      const response = await api.reclamos.listarPorArea(token)
      return Array.isArray(response) ? response : []
    },
    enabled: !!token,
  })
}
