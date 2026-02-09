"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { api } from "@/lib/api"
import { useAuthStore } from "@/stores/auth"

export function useCreateArea() {
  const token = useAuthStore((s) => s.auth?.access_token)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: { nombre: string; descripcion?: string }) => {
      if (!token) throw new Error("No hay token")
      return api.areas.crear(data, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["areas"] })
    },
  })
}

export function useUpdateArea() {
  const token = useAuthStore((s) => s.auth?.access_token)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { nombre?: string; descripcion?: string } }) => {
      if (!token) throw new Error("No hay token")
      return api.areas.actualizar(id, data, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["areas"] })
    },
  })
}

export function useDeleteArea() {
  const token = useAuthStore((s) => s.auth?.access_token)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      if (!token) throw new Error("No hay token")
      return api.areas.eliminar(id, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["areas"] })
    },
  })
}
