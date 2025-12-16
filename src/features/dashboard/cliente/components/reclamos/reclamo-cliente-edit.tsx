"use client"

import Link from "next/link"
import { useReclamoClienteEdit } from "@/features/dashboard/cliente/hooks/use-reclamo-cliente-edit"

export function ReclamoClienteEdit({ id }: { id: string }) {
  const { reclamo, tipos, areas, form, update, isLoading, isSaving, error, save } =
    useReclamoClienteEdit(id)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (!reclamo) {
    return (
      <div className="text-center py-10">
        <p className="text-red-400">{error ?? "No se encontró el reclamo"}</p>
      </div>
    )
  }

  const disabled = reclamo.estado === "RESUELTO"

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Editar reclamo #{reclamo.id}</h2>
          <p className="text-sm text-muted-foreground">Estado actual: {reclamo.estado}</p>
        </div>

        <Link
          href={{ pathname: "/cliente/reclamos/[id]", query: { id: String(reclamo.id) } }}
          className="text-sm underline text-primary"
        >
          ← Volver
        </Link>
      </div>

      {disabled && (
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">
            Este reclamo está <span className="font-medium">RESUELTO</span> y no puede editarse.
          </p>
        </div>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}

      <form
        onSubmit={async (e) => {
          e.preventDefault()
          await save()
        }}
        className="bg-card border border-border rounded-xl p-4 space-y-4"
      >
        <label className="grid gap-2">
          <span className="text-sm">Tipo de reclamo *</span>
          <select
            className="bg-input border border-border rounded-lg px-3 py-2"
            value={form.tipoReclamoId}
            onChange={(e) => update({ tipoReclamoId: e.target.value })}
            disabled={disabled || isSaving}
          >
            <option value="">Seleccioná</option>
            {tipos.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nombre}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-sm">Prioridad *</span>
          <input
            aria-label="Prioridad"
            className="bg-input border border-border rounded-lg px-3 py-2"
            value={form.prioridad}
            onChange={(e) => update({ prioridad: e.target.value })}
            disabled={disabled || isSaving}
            placeholder="Ej: Alta / Media / Baja"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm">Criticidad *</span>
          <input
            aria-label="Criticidad"
            className="bg-input border border-border rounded-lg px-3 py-2"
            value={form.criticidad}
            onChange={(e) => update({ criticidad: e.target.value })}
            disabled={disabled || isSaving}
            placeholder="Ej: Crítica / Normal"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm">Área sugerida (opcional)</span>
          <select
            className="bg-input border border-border rounded-lg px-3 py-2"
            value={form.areaId}
            onChange={(e) => update({ areaId: e.target.value })}
            disabled={disabled || isSaving}
          >
            <option value="">Sin sugerencia</option>
            {areas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nombre}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-sm">Descripción *</span>
          <textarea
            aria-label="Descripción"
            className="bg-input border border-border rounded-lg px-3 py-2 min-h-[140px]"
            value={form.descripcion}
            onChange={(e) => update({ descripcion: e.target.value })}
            disabled={disabled || isSaving}
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm">Archivo (URL opcional)</span>
          <input
            aria-label="Archivo"
            className="bg-input border border-border rounded-lg px-3 py-2"
            value={form.archivo}
            onChange={(e) => update({ archivo: e.target.value })}
            disabled={disabled || isSaving}
            placeholder="https://..."
          />
        </label>

        <button
          type="submit"
          disabled={disabled || isSaving}
          className="rounded-lg px-4 py-2 bg-primary text-primary-foreground disabled:opacity-50"
        >
          {isSaving ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>

      <Link href={{ pathname: "/cliente/reclamos" }} className="text-sm underline text-primary">
        ← Volver a mis reclamos
      </Link>
    </div>
  )
}
