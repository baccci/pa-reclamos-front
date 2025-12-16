"use client"

import Link from "next/link"
import { useClienteDetalle } from "@/features/dashboard/empleado/hooks/use-clientes-detalle"

function formatDate(value?: string | Date) {
  if (!value) return "-"
  const d = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(d.getTime())) return "-"
  return d.toLocaleString("es-AR", { year: "numeric", month: "2-digit", day: "2-digit" })
}

export function ClienteDetail({ id }: { id: string }) {
  const { cliente, isLoading, error, refetch } = useClienteDetalle(id)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (error || !cliente) {
    return (
      <div className="text-center py-10 space-y-3">
        <p className="text-red-400">{error ?? "Cliente no encontrado"}</p>
        <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground" onClick={refetch}>
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">{cliente.nombre}</h2>
        <p className="text-sm text-muted-foreground">{cliente.email}</p>
        <p className="text-sm text-muted-foreground">{cliente.telefono}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="font-semibold mb-3">Proyectos</p>
          {!cliente.proyectos || cliente.proyectos.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin proyectos.</p>
          ) : (
            <ul className="space-y-2">
              {cliente.proyectos.map((p) => (
                <li key={p.id} className="text-sm">
                  {p.nombre}{" "}
                  <span className="text-muted-foreground">({p.id})</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <p className="font-semibold mb-3">Reclamos</p>
          {!cliente.reclamos || cliente.reclamos.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin reclamos.</p>
          ) : (
            <ul className="space-y-3">
              {cliente.reclamos.map((r) => (
                <li key={r.id} className="border border-border rounded-lg p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">#{r.id}</p>
                    <span className="text-xs px-2 py-1 rounded-lg bg-input">{r.estado}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{r.descripcion}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Creado: {formatDate(r.createdAt)}
                  </p>

                  <Link
                    href={{ pathname: "/empleado/reclamos/[id]", query: { id: String(r.id) } }}
                    className="text-sm underline text-primary mt-2 inline-block"
                  >
                    Ver reclamo
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Link href="/empleado/clientes" className="text-sm underline text-primary">
        ← Volver a clientes
      </Link>
    </div>
  )
}
