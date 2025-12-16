"use client"

import { useProyectos } from "@/features/dashboard/cliente/hooks/use-proyectos"
import { ProyectoCard } from "./proyecto-card"

export function ProyectoList() {
  const { proyectos, isLoading, error } = useProyectos()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">{error}</p>
      </div>
    )
  }

  if (proyectos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No tenés proyectos registrados</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-foreground mb-6">Mis Proyectos</h2>
      <div className="grid gap-4">
        {proyectos.map((p) => (
          <ProyectoCard key={p.id} proyecto={p} />
        ))}
      </div>
    </div>
  )
}
