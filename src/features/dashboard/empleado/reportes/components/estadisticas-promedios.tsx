"use client"

import { useEmpleadoProfile } from "@/features/dashboard/empleado/hooks/use-empleado-profile"

import {
  usePorcentajeResolucion,
  useTiempoPromedioResolucion,
} from "../hooks/use-empleado-reportes"

export function EstadisticasPromedios() {
  const { data: empleado, isLoading: isLoadingProfile } = useEmpleadoProfile()
  const areaId = empleado?.area ?? null

  const { data: tiempoPromedio, isLoading: isLoadingTiempo, error: errorTiempo } =
    useTiempoPromedioResolucion(areaId)
  const { data: porcentaje, isLoading: isLoadingPorcentaje, error: errorPorcentaje } =
    usePorcentajeResolucion(areaId)

  if (isLoadingProfile || isLoadingTiempo || isLoadingPorcentaje) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!areaId) {
    return (
      <div className="rounded-lg border bg-card p-6">
        <p className="text-sm text-muted-foreground">
          No tenés un área asignada. Las estadísticas de promedios requieren un área.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-lg border bg-card p-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Tiempo Promedio de Resolución
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-foreground">
              {errorTiempo
                ? "Error"
                : tiempoPromedio != null
                  ? `${tiempoPromedio.toFixed(2)} días`
                  : "N/A"}
            </p>
          </div>
          {errorTiempo && (
            <p className="text-xs text-red-400">
              {errorTiempo.message || "Error al cargar datos"}
            </p>
          )}
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Porcentaje de Resolución
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-foreground">
              {errorPorcentaje
                ? "Error"
                : porcentaje != null
                  ? `${Math.round(porcentaje * 100)}%`
                  : "N/A"}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Reclamos resueltos sobre el total del área
          </p>
          {errorPorcentaje && (
            <p className="text-xs text-red-400">
              {errorPorcentaje.message || "Error al cargar datos"}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
