"use client"

import { useMemo, useState } from "react"
import { api } from "@/lib/api"
import type { Estados } from "@/types/reclamos-empleados"

type Props = {
  reclamoId: string
  estadoActual: Estados
  onSuccess?: () => void
}

function allowedNextStates(estado: Estados): Estados[] {
  if (estado === "PENDIENTE") return ["EN_PROCESO", "RESUELTO"]
  if (estado === "EN_PROCESO") return ["RESUELTO"]
  return []
}

export function ActualizarEstadoForm({ reclamoId, estadoActual, onSuccess }: Props) {
  const opciones = useMemo(() => allowedNextStates(estadoActual), [estadoActual])

  const [estado, setEstado] = useState<Estados | "">("")
  const [descripcion, setDescripcion] = useState("")
  const [resumen, setResumen] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const requiereResumen = estado === "RESUELTO"
  const disabled = estadoActual === "RESUELTO" || opciones.length === 0

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (disabled) return

    if (!estado) return setError("Seleccioná un estado.")
    if (!descripcion.trim()) return setError("La descripción es obligatoria.")
    if (requiereResumen && !resumen.trim()) {
      return setError("El resumen de resolución es obligatorio para cerrar como RESUELTO.")
    }

    try {
      setIsSubmitting(true)
      const texto = requiereResumen
        ? `Resumen: ${resumen.trim()}\n\nDetalle: ${descripcion.trim()}`
        : descripcion.trim()

      await api.reclamos.actualizarEstado(reclamoId, estado as Estados, texto)

      setEstado("")
      setDescripcion("")
      setResumen("")
      onSuccess?.()
    } catch (e) {
      console.error(e)
      setError("No se pudo actualizar el estado del reclamo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="bg-card border border-border rounded-xl p-4 space-y-3">
      <div>
        <p className="font-semibold">Actualizar estado</p>
        <p className="text-sm text-muted-foreground">
          Estado actual: <span className="font-medium">{estadoActual}</span>
        </p>
      </div>

      {disabled && (
        <p className="text-sm text-muted-foreground">
          Este reclamo no puede modificarse (ya está RESUELTO).
        </p>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}

      <label className="grid gap-2">
        <span className="text-sm">Nuevo estado *</span>
        <select
          className="bg-input border border-border rounded-lg px-3 py-2"
          value={estado}
          onChange={(e) => setEstado(e.target.value as Estados | "")}
          disabled={disabled || isSubmitting}
        >
          <option value="">Seleccioná</option>
          {opciones.map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>
      </label>

      {requiereResumen && (
        <label className="grid gap-2">
          <span className="text-sm">Resumen de resolución *</span>
          <input
            className="bg-input border border-border rounded-lg px-3 py-2"
            value={resumen}
            onChange={(e) => setResumen(e.target.value)}
            disabled={isSubmitting}
            placeholder="Ej: Se resolvió reiniciando..."
          />
        </label>
      )}

      <label className="grid gap-2">
        <span className="text-sm">Descripción de lo realizado *</span>
        <textarea
          className="bg-input border border-border rounded-lg px-3 py-2 min-h-[110px]"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          disabled={isSubmitting}
        />
      </label>

      <button
        type="submit"
        disabled={disabled || isSubmitting}
        className="rounded-lg px-4 py-2 bg-primary text-primary-foreground disabled:opacity-50"
      >
        {isSubmitting ? "Guardando..." : "Guardar cambio"}
      </button>
    </form>
  )
}
