"use client"

import { useAreaClaims } from "@/features/dashboard/cliente/reclamos/hooks/use-area-reclamo"
import { ClaimCardEmployee } from "./claim-card-employee"

export function ListaReclamosArea() {
  const { data: claims = [], isLoading, error } = useAreaClaims()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">Error al cargar los reclamos del área.</p>
      </div>
    )
  }

  if (claims.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No hay reclamos asignados al área</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Reclamos de mi Área</h2>
      <div className="grid gap-4">
        {claims.map((claim) => (
          <ClaimCardEmployee key={claim.id} claim={claim} />
        ))}
      </div>
    </div>
  )
}
