"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import type { Claim } from "@/features/dashboard/cliente/reclamos/types/claim"
import { useUpdateEstado } from "@/features/dashboard/cliente/reclamos/hooks/use-update-estado"
import { FormSelect } from "@/features/dashboard/cliente/reclamos/components/form/form-select"
import { FormTextarea } from "@/features/dashboard/cliente/reclamos/components/form/form-textarea"

interface CambioEstadoFormProps {
  reclamoId: string
  currentStatus: Claim["status"]
}

const STATUS_OPTIONS = [
  { value: "PENDIENTE", label: "Pendiente" },
  { value: "EN_PROCESO", label: "En Proceso" },
  { value: "RESUELTO", label: "Resuelto" },
] as const

export function CambioEstadoForm({ reclamoId, currentStatus }: CambioEstadoFormProps) {
  const [descripcion, setDescripcion] = useState("")
  const [estado, setEstado] = useState("")
  const { mutateAsync: actualizarEstado, isPending } = useUpdateEstado(reclamoId)

  const availableOptions = useMemo(() => {
    if (currentStatus === "pending") {
      return STATUS_OPTIONS.filter((option) => option.value !== "PENDIENTE")
    }
    if (currentStatus === "in_progress") {
      return STATUS_OPTIONS.filter(
        (option) => option.value !== "PENDIENTE" && option.value !== "EN_PROCESO",
      )
    }
    return []
  }, [currentStatus])

  useEffect(() => {
    if (!estado && availableOptions.length > 0) {
      setEstado(availableOptions[0].value)
    }
  }, [availableOptions, estado])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!estado) return

    try {
      await actualizarEstado({
        estado,
        descripcion,
      })
      toast.success("Estado actualizado", {
        description: "El cambio de estado se registró correctamente.",
      })
      setDescripcion("")
    } catch (error) {
      toast.error("Error al actualizar el estado", {
        description:
          error instanceof Error
            ? error.message
            : "No se pudo actualizar el estado. Intentá nuevamente.",
      })
    }
  }

  if (availableOptions.length === 0) {
    return (
      <div className="bg-card rounded-xl p-6 space-y-2">
        <h3 className="text-lg font-semibold text-foreground">Cambiar estado</h3>
        <p className="text-sm text-muted-foreground">
          Este reclamo ya está resuelto y no admite más cambios.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-xl p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Cambiar estado</h3>
        <p className="text-sm text-muted-foreground">
          Registrá el nuevo estado del reclamo y su descripción.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormTextarea
          label="Descripción"
          id="descripcion-estado"
          value={descripcion}
          onChange={setDescripcion}
          placeholder="Detalle del cambio de estado"
          required
          rows={4}
        />

        <FormSelect
          label="Nuevo estado"
          id="estado"
          value={estado}
          onChange={setEstado}
          options={availableOptions}
          required
        />

        <button
          type="submit"
          disabled={isPending || !descripcion.trim() || !estado}
          className="w-full py-3 px-6 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Guardando..." : "Guardar cambio"}
        </button>
      </form>
    </div>
  )
}
