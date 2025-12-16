"use client"

import type { Proyecto } from "@/types/entities"

function formatDate(value?: Date | string) {
  if (!value) return "-"
  const d = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(d.getTime())) return "-"
  return d.toLocaleDateString("es-AR", { year: "numeric", month: "short", day: "2-digit" })
}

export function ProyectoCard({ proyecto }: { proyecto: Proyecto }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:bg-muted/40 transition-all">
      <h3 className="text-base font-semibold text-foreground">{proyecto.nombre}</h3>

      <p className="text-sm text-muted-foreground mt-1">
        {proyecto.descripcion ?? "Sin descripción"}
      </p>

      <div className="flex flex-wrap gap-2 mt-3">
        <span className="text-xs px-2 py-1 rounded-lg bg-input text-foreground">
          Tipo: {proyecto.tipoProyecto?.nombre ?? "—"}
        </span>
        <span className="text-xs px-2 py-1 rounded-lg bg-input text-foreground">
          Creado: {formatDate(proyecto.createdAt)}
        </span>
      </div>
    </div>
  )
}
