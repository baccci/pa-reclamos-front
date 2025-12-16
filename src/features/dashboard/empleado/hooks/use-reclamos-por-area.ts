"use client"

import { useCallback, useEffect, useState } from "react"
import { api } from "@/lib/api"
import type { Estados, ListarPorAreaParams, Reclamo } from "@/types/reclamos-empleados"

type Filtros = {
  estado: Estados | ""
  desde: string
  hasta: string
  proyecto: string
}

export function useReclamosPorArea() {
  const [reclamos, setReclamos] = useState<Reclamo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [filtros, setFiltros] = useState<Filtros>({
    estado: "",
    desde: "",
    hasta: "",
    proyecto: "",
  })

  const fetchReclamos = useCallback(async (p?: Partial<Filtros>) => {
    try {
      setIsLoading(true)

      const next = { ...filtros, ...(p ?? {}) }
      const params: ListarPorAreaParams = {
        estado: next.estado || undefined,
        desde: next.desde || undefined,
        hasta: next.hasta || undefined,
        proyecto: next.proyecto || undefined,
      }

      const data = await api.reclamos.listarPorArea(params)
      setReclamos(data)
      setError(null)
      setFiltros(next)
    } catch (e) {
      console.error(e)
      setError("Error al cargar los reclamos del área")
    } finally {
      setIsLoading(false)
    }
  }, [filtros])

  useEffect(() => {
    fetchReclamos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    reclamos,
    filtros,
    setFiltros,
    isLoading,
    error,
    refetch: fetchReclamos,
  }
}
