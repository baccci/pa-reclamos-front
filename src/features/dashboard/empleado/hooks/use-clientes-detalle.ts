"use client"

import { useCallback, useEffect, useState } from "react"
import { api } from "@/lib/api"
import type { ClienteDetalle } from "@/types/clientes-empleados"

export function useClienteDetalle(id: string) {
  const [cliente, setCliente] = useState<ClienteDetalle | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDetalle = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await api.clientes.obtener(id)
      setCliente(data)
      setError(null)
    } catch (e) {
      console.error(e)
      setError("Error al cargar el perfil del cliente")
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchDetalle()
  }, [fetchDetalle])

  return { cliente, isLoading, error, refetch: fetchDetalle }
}
