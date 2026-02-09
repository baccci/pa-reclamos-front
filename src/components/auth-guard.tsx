"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/auth"

interface AuthGuardProps {
  children: React.ReactNode
  allowedRole: "cliente" | "empleado"
}

export function AuthGuard({ children, allowedRole }: AuthGuardProps) {
  const router = useRouter()
  const auth = useAuthStore((s) => s.auth)
  const user = useAuthStore((s) => s.user)
  const hasHydrated = useAuthStore((s) => s._hasHydrated)

  useEffect(() => {
    if (!hasHydrated) return

    if (!auth?.access_token || !user) {
      router.replace("/login")
      return
    }

    if (user.role !== allowedRole) {
      const redirectTo = user.role === "empleado" ? "/empleado/reclamos-area" : "/cliente/reclamos"
      router.replace(redirectTo)
    }
  }, [hasHydrated, auth, user, allowedRole, router])

  if (!hasHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!auth?.access_token || !user || user.role !== allowedRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return <>{children}</>
}
