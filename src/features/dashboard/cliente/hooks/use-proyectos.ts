"use client"

import { useCallback, useEffect, useState } from "react"
import type { Proyecto } from "@/types/entities"
import { api } from "@/lib/api"

export function useProyectos() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProyectos = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await api.proyectos.listar()
      setProyectos(data)
      setError(null)
    } catch (e) {
      console.error(e)
      setError("Error al cargar los proyectos")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProyectos()
  }, [fetchProyectos])

  return { proyectos, isLoading, error, refetch: fetchProyectos }
}
