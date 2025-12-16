"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import type { Area, Estados } from "@/types/reclamos-empleados"

type Props = {
  reclamoId: string
  estadoActual: Estados
  onSuccess?: () => void
}

export function ReasignarAreaForm({ reclamoId, estadoActual, onSuccess }: Props) {
  const [areas, setAreas] = useState<Area[]>([])
  const [areaId, setAreaId] = useState("")
  const [descripcion, setDescripcion] = useState("")

  const [isLoadingAreas, setIsLoadingAreas] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const disabled = estadoActual === "RESUELTO"

  useEffect(() => {
    const run = async () => {
      try {
        setIsLoadingAreas(true)
        setError(null)
        const data = await api.reclamos.listarAreas()
        setAreas(data)
      } catch (e) {
        console.error(e)
        setError("No se pudieron cargar las áreas")
      } finally {
        setIsLoadingAreas(false)
      }
    }
    run()
  }, [])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (disabled) return

    if (!areaId) {
      setError("Seleccioná un área destino.")
      return
    }

    if (!descripcion.trim()) {
      setError("La descripción de la reasignación es obligatoria.")
      return
    }

    try {
      setIsSubmitting(true)
      await api.reclamos.reasignarArea(reclamoId, areaId, descripcion.trim())
      setAreaId("")
      setDescripcion("")
      onSuccess?.()
    } catch (e) {
      console.error(e)
      setError("No se pudo reasignar el reclamo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="bg-card border border-border rounded-xl p-4 space-y-3">
      <div>
        <p className="font-semibold">Reasignar área</p>
        <p className="text-sm text-muted-foreground">
          Al reasignar, el reclamo vuelve a <span className="font-medium">PENDIENTE</span>.
        </p>
      </div>

      {disabled && (
        <p className="text-sm text-muted-foreground">
          No se puede reasignar un reclamo RESUELTO.
        </p>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}

      <label className="grid gap-2">
        <span className="text-sm">Área destino *</span>
        <select
          className="bg-input border border-border rounded-lg px-3 py-2"
          value={areaId}
          onChange={(e) => setAreaId(e.target.value)}
          disabled={disabled || isSubmitting}
        >
          <option value="">Seleccioná</option>

          {isLoadingAreas ? (
            <option value="" disabled>
              Cargando áreas...
            </option>
          ) : (
            areas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nombre}
              </option>
            ))
          )}
        </select>
      </label>

      <label className="grid gap-2">
        <span className="text-sm">Descripción *</span>
        <textarea
          className="bg-input border border-border rounded-lg px-3 py-2 min-h-[110px]"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          disabled={disabled || isSubmitting}
          placeholder="Motivo de la reasignación..."
        />
      </label>

      <button
        type="submit"
        disabled={disabled || isSubmitting}
        className="rounded-lg px-4 py-2 bg-primary text-primary-foreground disabled:opacity-50"
      >
        {isSubmitting ? "Reasignando..." : "Reasignar"}
      </button>
    </form>
  )
}
