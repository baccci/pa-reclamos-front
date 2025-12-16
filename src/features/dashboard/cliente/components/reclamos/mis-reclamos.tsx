"use client"

import Link from "next/link"
import { useMisReclamos } from "@/features/dashboard/cliente/hooks/use-mis-reclamos"
import type { Estados } from "@/types/reclamos-empleados"

const ESTADOS: (Estados | "")[] = ["", "PENDIENTE", "EN_PROCESO", "RESUELTO"]

function formatDate(value?: string | Date) {
  if (!value) return "-"
  const d = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(d.getTime())) return "-"
  return d.toLocaleString("es-AR", { year: "numeric", month: "2-digit", day: "2-digit" })
}

export function MisReclamos() {
  const { reclamos, filtros, isLoading, error, refetch } = useMisReclamos()

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Mis reclamos</h2>
          <p className="text-sm text-muted-foreground">Filtrá por estado, fechas y proyecto</p>
        </div>

        <button
          onClick={() => refetch()}
          className="rounded-lg px-4 py-2 bg-primary text-primary-foreground"
        >
          Recargar
        </button>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-card border border-border rounded-xl p-4">
        <label className="grid gap-2">
          <span className="text-sm">Estado</span>
          <select
            className="bg-input border border-border rounded-lg px-3 py-2"
            value={filtros.estado}
            onChange={(e) => refetch({ estado: e.target.value as Estados | "" })}
          >
            {ESTADOS.map((x) => (
              <option key={x || "ALL"} value={x}>
                {x || "Todos"}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-sm">Desde</span>
          <input
            type="date"
            className="bg-input border border-border rounded-lg px-3 py-2"
            value={filtros.desde}
            onChange={(e) => refetch({ desde: e.target.value })}
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm">Hasta</span>
          <input
            type="date"
            className="bg-input border border-border rounded-lg px-3 py-2"
            value={filtros.hasta}
            onChange={(e) => refetch({ hasta: e.target.value })}
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm">Proyecto</span>
          <input
            className="bg-input border border-border rounded-lg px-3 py-2"
            value={filtros.proyecto}
            onChange={(e) => refetch({ proyecto: e.target.value })}
            placeholder="Nombre o ID"
          />
        </label>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      )}

      {error && (
        <div className="text-center py-10">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {!isLoading && !error && reclamos.length === 0 && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No tenés reclamos para mostrar</p>
        </div>
      )}

      {!isLoading && !error && reclamos.length > 0 && (
        <div className="grid gap-3">
          {reclamos.map((r) => (
            <Link
              key={r.id}
              href={{ pathname: "/cliente/reclamos/[id]", query: { id: String(r.id) } }}
              className="block bg-card border border-border rounded-xl p-4 hover:bg-muted/40 transition-all"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold truncate">
                    {r.tipoReclamo?.nombre ?? "Reclamo"} — {r.estado}
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{r.descripcion}</p>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <span className="text-xs px-2 py-1 rounded-lg bg-input">
                    Prioridad: {r.prioridad}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-lg bg-input">
                    Criticidad: {r.criticidad}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-lg bg-input">
                    Creado: {formatDate(r.createdAt)}
                  </span>
                </div>
              </div>

              <div className="mt-3 text-xs text-muted-foreground">
                Proyecto: {r.proyecto?.nombre ?? r.proyectoId}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
