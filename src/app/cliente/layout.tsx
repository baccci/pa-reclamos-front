import type React from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { AuthGuard } from "@/components/auth-guard"

interface ClienteLayoutProps {
  children: React.ReactNode
}

export default function ClienteLayout({ children }: ClienteLayoutProps) {
  return (
    <MainLayout>
      <AuthGuard allowedRole="cliente">
        <div className="flex flex-col items-center justify-center h-full w-full">
          {children}
        </div>
      </AuthGuard>
    </MainLayout>
  )
}
