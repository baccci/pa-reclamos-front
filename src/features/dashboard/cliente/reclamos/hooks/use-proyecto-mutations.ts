"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { useAuthStore } from "@/stores/auth"

export interface ActualizarProyectoPayload {
  nombre?: string
  descripcion?: string
  tipoProyectoId?: string
}

export function useActualizarProyecto() {
  const token = useAuthStore((state) => state.auth?.access_token)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: ActualizarProyectoPayload
    }) => {
      if (!token) throw new Error("No hay token de autenticación")
      return api.proyectos.actualizar(id, data, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proyectos"] })
    },
  })
}

export function useEliminarProyecto() {
  const token = useAuthStore((state) => state.auth?.access_token)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      if (!token) throw new Error("No hay token de autenticación")
      return api.proyectos.eliminar(id, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proyectos"] })
    },
  })
}
