"use client"

import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api"
import { useAuthStore } from "@/stores/auth"

interface EmpleadoProfile {
  id: string
  email: string
  telefono: string
  nombre: string
  area: string | null
}

function isRealEmail(email?: string): boolean {
  if (!email) return false
  return !email.startsWith("usuario-")
}

export function useEmpleadoProfile() {
  const token = useAuthStore((s) => s.auth?.access_token)
  const email = useAuthStore((s) => s.user?.email)
  const hasRealEmail = isRealEmail(email)

  return useQuery<EmpleadoProfile>({
    queryKey: ["empleado", "profile", email],
    queryFn: async () => {
      if (!token || !email) throw new Error("No hay token o email")
      return api.empleado.obtenerPerfil(email, token) as Promise<EmpleadoProfile>
    },
    enabled: !!token && hasRealEmail,
  })
}
