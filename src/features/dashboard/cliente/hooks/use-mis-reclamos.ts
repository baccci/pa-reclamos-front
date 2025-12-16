"use client"

import { useCallback, useEffect, useState } from "react"
import { api } from "@/lib/api"
import type { Estados, Reclamo } from "@/types/reclamos-empleados"
import type { ListarMiosParams } from "@/features/dashboard/cliente/services/reclamos-api"

type Filtros = {
  estado: Estados | ""
  desde: string
  hasta: string
  proyecto: string
}

const DEFAULT: Filtros = { estado: "", desde: "", hasta: "", proyecto: "" }

export function useMisReclamos() {
  const [reclamos, setReclamos] = useState<Reclamo[]>([])
  const [filtros, setFiltros] = useState<Filtros>(DEFAULT)

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(
    async (next?: Partial<Filtros>) => {
      const merged: Filtros = { ...filtros, ...(next ?? {}) }
      setFiltros(merged)

      const params: ListarMiosParams = {
        estado: merged.estado || undefined,
        desde: merged.desde || undefined,
        hasta: merged.hasta || undefined,
        proyecto: merged.proyecto || undefined,
      }

      try {
        setIsLoading(true)
        const data = await api.reclamos.listarMios(params)
        setReclamos(data)
        setError(null)
      } catch (e) {
        console.error(e)
        setError("Error al cargar tus reclamos")
      } finally {
        setIsLoading(false)
      }
    },
    [filtros],
  )

  useEffect(() => {
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { reclamos, filtros, isLoading, error, refetch }
}
