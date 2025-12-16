"use client"

import { useCallback, useEffect, useState } from "react"
import { api } from "@/lib/api"
import type { NotaReclamo } from "@/types/notas-empleados"

export function useNotasReclamo(reclamoId: string) {
  const [notas, setNotas] = useState<NotaReclamo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNotas = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await api.reclamos.listarNotas(reclamoId)
      setNotas(data)
      setError(null)
    } catch (e) {
      console.error(e)
      setError("Error al cargar las notas internas")
    } finally {
      setIsLoading(false)
    }
  }, [reclamoId])

  useEffect(() => {
    fetchNotas()
  }, [fetchNotas])

  const crear = useCallback(
    async (contenido: string) => {
      const txt = contenido.trim()
      if (!txt) return

      const created = await api.reclamos.crearNota(reclamoId, txt)
      setNotas((prev) => [created, ...prev])
    },
    [reclamoId],
  )

  const editar = useCallback(
    async (notaId: string, contenido: string) => {
      const txt = contenido.trim()
      if (!txt) return

      const updated = await api.reclamos.editarNota(reclamoId, notaId, txt)
      setNotas((prev) => prev.map((n) => (n.id === notaId ? updated : n)))
    },
    [reclamoId],
  )

  const eliminar = useCallback(
    async (notaId: string) => {
      await api.reclamos.eliminarNota(reclamoId, notaId)
      setNotas((prev) => prev.filter((n) => n.id !== notaId))
    },
    [reclamoId],
  )

  return { notas, isLoading, error, refetch: fetchNotas, crear, editar, eliminar }
}
