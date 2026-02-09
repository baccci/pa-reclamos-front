import type React from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { AuthGuard } from "@/components/auth-guard"

interface EmpleadoLayoutProps {
  children: React.ReactNode
}

export default function EmpleadoLayout({ children }: EmpleadoLayoutProps) {
  return (
    <MainLayout>
      <AuthGuard allowedRole="empleado">
        <div className="flex flex-col items-center justify-center h-full w-full">
          {children}
        </div>
      </AuthGuard>
    </MainLayout>
  )
}
