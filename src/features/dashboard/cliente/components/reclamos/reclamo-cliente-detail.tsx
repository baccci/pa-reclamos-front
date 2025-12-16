"use client"

import Link from "next/link"
import { useMemo } from "react"
import { useReclamoClienteDetalle } from "@/features/dashboard/cliente/hooks/use-reclamo-cliente-detalle"
import type { CambioEstado, Estados } from "@/types/reclamos-empleados"

function formatDate(value?: string | Date) {
  if (!value) return "-"
  const d = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(d.getTime())) return "-"
  return d.toLocaleString("es-AR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function estadoBadge(estado: Estados) {
  const base = "text-xs px-2 py-1 rounded-lg border"
  if (estado === "PENDIENTE") return `${base} border-yellow-500/40 text-yellow-300`
  if (estado === "EN_PROCESO") return `${base} border-blue-500/40 text-blue-300`
  if (estado === "RESUELTO") return `${base} border-green-500/40 text-green-300`
  return base
}

function responsableLabel(c: CambioEstado) {
  if (c.empleado?.nombre) return `Empleado: ${c.empleado.nombre}`
  if (c.cliente?.nombre) return `Cliente: ${c.cliente.nombre}`
  return "Responsable: —"
}

export function ReclamoClienteDetail({ id }: { id: string }) {
  const { reclamo, isLoading, error } = useReclamoClienteDetalle(id)

  const timeline = useMemo(() => {
    const arr = reclamo?.cambioEstado ?? []
    return [...arr].sort((a, b) => {
      const da = new Date(a.fechaInicio as any).getTime()
      const db = new Date(b.fechaInicio as any).getTime()
      return da - db
    })
  }, [reclamo])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (error || !reclamo) {
    return (
      <div className="text-center py-10">
        <p className="text-red-400">{error ?? "No se encontró el reclamo"}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-xl font-bold truncate">
            {reclamo.tipoReclamo?.nombre ?? "Reclamo"} — #{reclamo.id}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Creado: {formatDate(reclamo.createdAt)} • Actualizado: {formatDate(reclamo.updatedAt)}
          </p>
        </div>

        <div className="flex items-center gap-3">
            {reclamo.estado !== "RESUELTO" && (
                <Link
                href={{ pathname: "/cliente/reclamos/[id]/editar", query: { id: String(reclamo.id) } }}
                className="text-sm underline text-primary"
                >
                Editar reclamo
                </Link>
            )}

            <span className={estadoBadge(reclamo.estado)}>{reclamo.estado}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 space-y-2">
          <p className="font-semibold">Datos</p>
          <p className="text-sm">Prioridad: {reclamo.prioridad}</p>
          <p className="text-sm">Criticidad: {reclamo.criticidad}</p>
          <p className="text-sm">Área: {reclamo.areaActual?.nombre ?? "—"}</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 space-y-2">
          <p className="font-semibold">Proyecto</p>
          <p className="text-sm">{reclamo.proyecto?.nombre ?? reclamo.proyectoId}</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 space-y-2">
          <p className="font-semibold">Cliente</p>
          <p className="text-sm">{reclamo.cliente?.nombre ?? "—"}</p>
          <p className="text-sm text-muted-foreground">{reclamo.cliente?.email ?? ""}</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-4 space-y-3">
        <p className="font-semibold">Descripción</p>
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{reclamo.descripcion}</p>

        {reclamo.archivo && (
          <div className="pt-2">
            <p className="text-sm font-semibold mb-1">Adjunto</p>
            <a
              href={reclamo.archivo}
              target="_blank"
              rel="noreferrer"
              className="text-sm underline text-primary"
            >
              Abrir archivo
            </a>
          </div>
        )}
      </div>

      <div className="bg-card border border-border rounded-xl p-4">
        <p className="font-semibold mb-4">Historial (Timeline)</p>

        {timeline.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay historial disponible.</p>
        ) : (
          <ol className="space-y-4">
            {timeline.map((c) => (
              <li key={c.id} className="flex gap-3">
                <div className="mt-1 h-3 w-3 rounded-full bg-primary shrink-0" />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={estadoBadge(c.estado)}>{c.estado}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(c.fechaInicio)} {c.fechaFin ? `→ ${formatDate(c.fechaFin)}` : ""}
                    </span>
                  </div>

                  <p className="text-sm mt-1">
                    Área: {c.area?.nombre ?? c.areaId} • {responsableLabel(c)}
                  </p>

                  {c.descripcion && (
                    <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                      {c.descripcion}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>

      <Link href={{ pathname: "/cliente/reclamos" }} className="text-sm underline text-primary">
        ← Volver a mis reclamos
      </Link>
    </div>
  )
}
