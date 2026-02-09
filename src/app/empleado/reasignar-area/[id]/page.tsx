"use client"

import { use } from "react"

import { ReclamoDetailShell } from "@/features/dashboard/empleado/reclamos/components/reclamo-detail-shell"

interface ReasignarAreaPageProps {
  params: Promise<{ id: string }>
}

export default function ReasignarAreaPage({ params }: ReasignarAreaPageProps) {
  const { id } = use(params)

  return (
    <div className="space-y-6 w-full">
      <h1 className="text-2xl font-bold text-foreground">Reasignar área</h1>
      <ReclamoDetailShell reclamoId={id} variant="reasignar-area" />
    </div>
  )
}
