"use client"

import { useCallback, useEffect, useState } from "react"
import { api } from "@/lib/api"
import type { ClienteResumen } from "@/types/clientes-empleados"

export function useClientes() {
  const [clientes, setClientes] = useState<ClienteResumen[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchClientes = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await api.clientes.listar()
      setClientes(data)
      setError(null)
    } catch (e) {
      console.error(e)
      setError("Error al cargar los clientes")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchClientes()
  }, [fetchClientes])

  return { clientes, isLoading, error, refetch: fetchClientes }
}
