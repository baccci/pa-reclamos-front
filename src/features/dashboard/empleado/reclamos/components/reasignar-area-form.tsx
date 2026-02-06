"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { useAreas } from "@/features/dashboard/cliente/reclamos/hooks/use-areas"
import { useReassignArea } from "@/features/dashboard/cliente/reclamos/hooks/use-reassign-area"
import { FormSelect } from "@/features/dashboard/cliente/reclamos/components/form/form-select"

interface ReasignarAreaFormProps {
  reclamoId: string
  currentAreaId?: string
}

const DEFAULT_DESCRIPTION = "Reasignación de área"

export function ReasignarAreaForm({ reclamoId, currentAreaId }: ReasignarAreaFormProps) {
  const [areaId, setAreaId] = useState("")
  const { data: areas = [], isLoading: areasLoading } = useAreas()
  const { mutateAsync: reasignarArea, isPending } = useReassignArea(reclamoId)

  const areaOptions = useMemo(
    () =>
      areas
        .filter((area) => area.id !== currentAreaId)
        .map((area) => ({ value: area.id, label: area.nombre })),
    [areas, currentAreaId],
  )

  useEffect(() => {
    if (!areaId && areaOptions.length > 0) {
      setAreaId(areaOptions[0].value)
    }
  }, [areaOptions, areaId])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!areaId) return

    try {
      await reasignarArea({
        areaId,
        descripcion: DEFAULT_DESCRIPTION,
      })
      toast.success("Reclamo reasignado", {
        description: "El reclamo se reasignó correctamente.",
      })
    } catch (error) {
      toast.error("Error al reasignar", {
        description:
          error instanceof Error
            ? error.message
            : "No se pudo reasignar el reclamo. Intentá nuevamente.",
      })
    }
  }

  if (areasLoading) {
    return (
      <div className="bg-card rounded-xl p-6">
        <p className="text-sm text-muted-foreground">Cargando áreas...</p>
      </div>
    )
  }

  if (areaOptions.length === 0) {
    return (
      <div className="bg-card rounded-xl p-6 space-y-2">
        <h3 className="text-lg font-semibold text-foreground">Reasignar área</h3>
        <p className="text-sm text-muted-foreground">
          No hay áreas disponibles para reasignar este reclamo.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-xl p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Reasignar área</h3>
        <p className="text-sm text-muted-foreground">
          Seleccioná el área destino para reasignar el reclamo.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormSelect
          label="Área"
          id="area"
          value={areaId}
          onChange={setAreaId}
          options={areaOptions}
          required
        />

        <button
          type="submit"
          disabled={isPending || !areaId}
          className="w-full py-3 px-6 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Reasignando..." : "Reasignar"}
        </button>
      </form>
    </div>
  )
}
