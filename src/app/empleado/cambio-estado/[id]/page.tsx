"use client"

import { use } from "react"

import { ReclamoDetailShell } from "@/features/dashboard/empleado/reclamos/components/reclamo-detail-shell"

interface CambioEstadoPageProps {
  params: Promise<{ id: string }>
}

export default function CambioEstadoPage({ params }: CambioEstadoPageProps) {
  const { id } = use(params)

  return (
    <div className="space-y-6 w-full">
      <h1 className="text-2xl font-bold text-foreground">Cambiar estado</h1>
      <ReclamoDetailShell reclamoId={id} variant="cambio-estado" />
    </div>
  )
}
