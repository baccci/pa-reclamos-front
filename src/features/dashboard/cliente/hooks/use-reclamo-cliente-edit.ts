"use client"

import { useCallback, useEffect, useState } from "react"
import { api } from "@/lib/api"
import type { Area, ReclamoDetalle, TipoReclamo } from "@/types/reclamos-empleados"

type FormState = {
  descripcion: string
  prioridad: string
  criticidad: string
  tipoReclamoId: string
  areaId: string
  archivo: string
}

export function useReclamoClienteEdit(id: string) {
  const [reclamo, setReclamo] = useState<ReclamoDetalle | null>(null)
  const [tipos, setTipos] = useState<TipoReclamo[]>([])
  const [areas, setAreas] = useState<Area[]>([])

  const [form, setForm] = useState<FormState>({
    descripcion: "",
    prioridad: "",
    criticidad: "",
    tipoReclamoId: "",
    areaId: "",
    archivo: "",
  })

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const [detalle, tiposData, areasData] = await Promise.all([
        api.reclamos.obtener(id),
        api.reclamos.listarTiposReclamo(),
        api.reclamos.listarAreas(),
      ])

      setReclamo(detalle as ReclamoDetalle)
      setTipos(tiposData)
      setAreas(areasData)

      setForm({
        descripcion: (detalle as any).descripcion ?? "",
        prioridad: (detalle as any).prioridad ?? "",
        criticidad: (detalle as any).criticidad ?? "",
        tipoReclamoId: (detalle as any).tipoReclamoId ?? "",
        areaId: ((detalle as any).areaActual?.id ?? "") as string,
        archivo: (detalle as any).archivo ?? "",
      })
    } catch (e) {
      console.error(e)
      setError("Error al cargar datos para editar el reclamo")
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    load()
  }, [load])

  const update = useCallback((patch: Partial<FormState>) => {
    setForm((prev) => ({ ...prev, ...patch }))
  }, [])

  const save = useCallback(async () => {
    if (!reclamo) return
    if (reclamo.estado === "RESUELTO") {
      setError("No se puede modificar un reclamo RESUELTO.")
      return
    }

    if (!form.descripcion.trim()) return setError("La descripción es obligatoria.")
    if (!form.prioridad.trim()) return setError("La prioridad es obligatoria.")
    if (!form.criticidad.trim()) return setError("La criticidad es obligatoria.")
    if (!form.tipoReclamoId) return setError("Seleccioná un tipo de reclamo.")

    try {
      setIsSaving(true)
      setError(null)

      await api.reclamos.modificar(id, {
        descripcion: form.descripcion.trim(),
        prioridad: form.prioridad.trim(),
        criticidad: form.criticidad.trim(),
        tipoReclamoId: form.tipoReclamoId,
        areaId: form.areaId || undefined,
        archivo: form.archivo.trim() || undefined,
      })

      await load()
      return { ok: true as const }
    } catch (e) {
      console.error(e)
      setError("No se pudo guardar el reclamo")
      return { ok: false as const }
    } finally {
      setIsSaving(false)
    }
  }, [form, id, load, reclamo])

  return { reclamo, tipos, areas, form, update, isLoading, isSaving, error, reload: load, save }
}
