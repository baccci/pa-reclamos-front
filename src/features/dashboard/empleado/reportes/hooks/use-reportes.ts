"use client"

import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { useAuthStore } from "@/stores/auth"

type FechaFilters = {
  fechaDesde?: string
  fechaFin?: string
}

function filtrarPorFecha(items: any[], filtros?: FechaFilters) {
  if (!filtros?.fechaDesde && !filtros?.fechaFin) return items

  return items.filter((claim: any) => {
    if (!claim.createdAt) return false

    const claimDate = new Date(claim.createdAt)
    if (isNaN(claimDate.getTime())) return false

    const desde = filtros?.fechaDesde ? new Date(filtros.fechaDesde) : null
    const hasta = filtros?.fechaFin ? new Date(filtros.fechaFin) : null

    if (desde) {
      desde.setHours(0, 0, 0, 0)
    }
    if (hasta) {
      hasta.setHours(23, 59, 59, 999)
    }

    if (desde && claimDate < desde) return false
    if (hasta && claimDate > hasta) return false
    return true
  })
}

export function useReclamosPorEstado(filtros?: FechaFilters) {
  const token = useAuthStore((state) => state.auth?.access_token)

  return useQuery({
    queryKey: ["reportes", "empleado", "reclamos-por-estado", filtros],
    queryFn: async () => {
      if (!token) throw new Error("No authentication token")

      const reclamos = await api.reclamos.listarPorArea(token)
      const items = Array.isArray(reclamos) ? reclamos : []
      const filtrados = filtrarPorFecha(items, filtros)

      const counts = {
        pendientes: 0,
        enProceso: 0,
        resueltos: 0,
      }

      filtrados.forEach((reclamo: any) => {
        switch (reclamo.estado) {
          case "PENDIENTE":
            counts.pendientes += 1
            break
          case "EN_PROCESO":
            counts.enProceso += 1
            break
          case "RESUELTO":
            counts.resueltos += 1
            break
          default:
            break
        }
      })

      return counts
    },
    enabled: !!token,
  })
}

export function useTiempoPromedioResolucion(filtros?: FechaFilters) {
  const token = useAuthStore((state) => state.auth?.access_token)

  return useQuery({
    queryKey: ["reportes", "empleado", "tiempo-promedio-resolucion", filtros],
    queryFn: async () => {
      if (!token) throw new Error("No authentication token")

      const reclamos = await api.reclamos.listarPorArea(token)
      const items = Array.isArray(reclamos) ? reclamos : []
      const filtrados = filtrarPorFecha(items, filtros)

      const resueltos = filtrados.filter((reclamo: any) => reclamo.estado === "RESUELTO")
      if (resueltos.length === 0) return { promedio: 0, total: 0 }

      const tiempos = resueltos
        .map((reclamo: any) => {
          const createdAt = new Date(reclamo.createdAt)
          const updatedAt = new Date(reclamo.updatedAt)
          if (isNaN(createdAt.getTime()) || isNaN(updatedAt.getTime())) return null
          return (updatedAt.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
        })
        .filter((value: number | null): value is number => Number.isFinite(value))

      const promedio = tiempos.length > 0
        ? tiempos.reduce((a: number, b: number) => a + b, 0) / tiempos.length
        : 0

      return { promedio, total: tiempos.length }
    },
    enabled: !!token,
    retry: false,
  })
}

export function useCantidadPromedioResolucion(filtros?: FechaFilters) {
  const token = useAuthStore((state) => state.auth?.access_token)

  return useQuery({
    queryKey: ["reportes", "empleado", "cantidad-promedio-resolucion", filtros],
    queryFn: async () => {
      if (!token) throw new Error("No authentication token")

      const reclamos = await api.reclamos.listarPorArea(token)
      const items = Array.isArray(reclamos) ? reclamos : []
      const filtrados = filtrarPorFecha(items, filtros)

      const resueltos = filtrados.filter((reclamo: any) => reclamo.estado === "RESUELTO")
      if (resueltos.length === 0) return { promedio: 0, total: 0 }

      const resolucionesPorMes: Record<string, number> = {}
      resueltos.forEach((reclamo: any) => {
        const fecha = new Date(reclamo.updatedAt || reclamo.createdAt)
        if (isNaN(fecha.getTime())) return
        const mesAno = `${fecha.getFullYear()}-${fecha.getMonth() + 1}`
        resolucionesPorMes[mesAno] = (resolucionesPorMes[mesAno] || 0) + 1
      })

      const meses = Object.keys(resolucionesPorMes).length
      const promedio = meses > 0 ? resueltos.length / meses : 0

      return { promedio, total: resueltos.length }
    },
    enabled: !!token,
    retry: false,
  })
}
