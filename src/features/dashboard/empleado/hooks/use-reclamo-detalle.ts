"use client"

import { useCallback, useEffect, useState } from "react"
import { api } from "@/lib/api"
import type { ReclamoDetalle } from "@/types/reclamos-empleados"

export function useReclamoDetalle(id: string) {
  const [reclamo, setReclamo] = useState<ReclamoDetalle | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDetalle = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await api.reclamos.obtener(id)
      setReclamo(data as ReclamoDetalle)
      setError(null)
    } catch (e) {
      console.error(e)
      setError("Error al cargar el detalle del reclamo")
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchDetalle()
  }, [fetchDetalle])

  return { reclamo, isLoading, error, refetch: fetchDetalle }
}
