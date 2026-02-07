"use client"

import {
  useTiempoPromedioResolucion,
  useCantidadPromedioResolucion,
} from "../hooks/use-reportes"

type ReporteFiltros = {
  fechaDesde?: string
  fechaFin?: string
}

export function EstadisticasPromedios({ filtros }: { filtros?: ReporteFiltros }) {
  const { data: tiempoPromedio, isLoading: isLoadingTiempo, error: errorTiempo } =
    useTiempoPromedioResolucion(filtros)
  const { data: cantidadPromedio, isLoading: isLoadingCantidad, error: errorCantidad } =
    useCantidadPromedioResolucion(filtros)

  if (isLoadingTiempo || isLoadingCantidad) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const getTiempoPromedio = () => {
    if (!tiempoPromedio) return null
    if (typeof tiempoPromedio === "number") return tiempoPromedio
    if (typeof tiempoPromedio === "object" && "promedio" in tiempoPromedio) {
      return tiempoPromedio.promedio
    }
    const obj = tiempoPromedio as any
    return obj.avg || obj.average || obj.tiempo || obj.dias || null
  }

  const getCantidadPromedio = () => {
    if (!cantidadPromedio) return null
    if (typeof cantidadPromedio === "number") return cantidadPromedio
    if (typeof cantidadPromedio === "object" && "promedio" in cantidadPromedio) {
      return cantidadPromedio.promedio
    }
    const obj = cantidadPromedio as any
    return obj.avg || obj.average || obj.cantidad || obj.total || null
  }

  const tiempoValor = getTiempoPromedio()
  const cantidadValor = getCantidadPromedio()

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-lg border bg-card p-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Tiempo Promedio de Resolucion
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-foreground">
              {tiempoValor !== null && tiempoValor !== undefined
                ? `${Math.round(tiempoValor)} dias`
                : errorTiempo
                ? "Error"
                : "N/A"}
            </p>
          </div>
          {errorTiempo && (
            <p className="text-xs text-red-400">
              {errorTiempo.message || "Error al cargar datos"}
            </p>
          )}
          {tiempoPromedio && typeof tiempoPromedio === "object" && "total" in tiempoPromedio && tiempoPromedio.total && (
            <p className="text-xs text-muted-foreground">
              Basado en {tiempoPromedio.total} reclamo(s) resuelto(s)
            </p>
          )}
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Cantidad Promedio de Resoluciones
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-foreground">
              {cantidadValor !== null && cantidadValor !== undefined
                ? Math.round(cantidadValor)
                : errorCantidad
                ? "Error"
                : "N/A"}
            </p>
            <p className="text-sm text-muted-foreground">/ mes</p>
          </div>
          {errorCantidad && (
            <p className="text-xs text-red-400">
              {errorCantidad.message || "Error al cargar datos"}
            </p>
          )}
          {cantidadPromedio && typeof cantidadPromedio === "object" && "total" in cantidadPromedio && cantidadPromedio.total && (
            <p className="text-xs text-muted-foreground">
              Total: {cantidadPromedio.total} reclamo(s)
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
