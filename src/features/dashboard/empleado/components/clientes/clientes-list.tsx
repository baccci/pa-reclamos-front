"use client"

import Link from "next/link"
import { useClientes } from "@/features/dashboard/empleado/hooks/use-clientes"

export function ClienteList() {
  const { clientes, isLoading, error, refetch } = useClientes()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-10 space-y-3">
        <p className="text-red-400">{error}</p>
        <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground" onClick={refetch}>
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Clientes</h2>
          <p className="text-sm text-muted-foreground">Listado de clientes del sistema</p>
        </div>

        <button
          onClick={() => refetch()}
          className="rounded-lg px-4 py-2 bg-primary text-primary-foreground"
        >
          Recargar
        </button>
      </div>

      {clientes.length === 0 ? (
        <p className="text-muted-foreground">No hay clientes para mostrar.</p>
      ) : (
        <div className="grid gap-3">
          {clientes.map((c) => (
            <Link
              key={c.id}
              href={{ pathname: "/empleado/clientes/[id]", query: { id: String(c.id) } }}
              className="block bg-card border border-border rounded-xl p-4 hover:bg-muted/40 transition-all"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold truncate">{c.nombre}</p>
                  <p className="text-sm text-muted-foreground truncate">{c.email}</p>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <span className="text-xs px-2 py-1 rounded-lg bg-input">
                    Tel: {c.telefono}
                  </span>
                  {typeof c.proyectosCount === "number" && (
                    <span className="text-xs px-2 py-1 rounded-lg bg-input">
                      Proyectos: {c.proyectosCount}
                    </span>
                  )}
                  {typeof c.reclamosCount === "number" && (
                    <span className="text-xs px-2 py-1 rounded-lg bg-input">
                      Reclamos: {c.reclamosCount}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
