"use client"

import { useState } from "react"
import { DayPicker } from "react-day-picker"
import { format } from "date-fns"
import { ReclamosPorEstadoChart } from "@/features/dashboard/empleado/reportes/components/reclamos-por-estado-chart"
import { EstadisticasPromedios } from "@/features/dashboard/empleado/reportes/components/estadisticas-promedios"
import { DistribucionEstadosChart } from "@/features/dashboard/empleado/reportes/components/distribucion-estados-chart"
import "@/features/dashboard/cliente/reportes/components/charts.css"
import "react-day-picker/dist/style.css"

export default function ReportesEmpleadoPage() {
  const [fechaDesde, setFechaDesde] = useState<Date | undefined>()
  const [fechaFin, setFechaFin] = useState<Date | undefined>()
  const [openMin, setOpenMin] = useState(false)
  const [openMax, setOpenMax] = useState(false)

  const filtros = {
    fechaDesde: fechaDesde ? format(fechaDesde, "yyyy-MM-dd") : undefined,
    fechaFin: fechaFin ? format(fechaFin, "yyyy-MM-dd") : undefined,
  }

  return (
    <div className="space-y-6 [&_text]:!fill-white [&_.recharts-text]:!fill-white"
      style={{
        // @ts-ignore
        '--chart-text-color': '#FFFFFF',
      }}
    >
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reportes</h1>
        <p className="text-muted-foreground">
          Visualiza estadisticas y metricas de tu area
        </p>
      </div>

      <div className="space-y-6">
        {/* Filtros por fecha */}
        <div className="rounded-lg border bg-card p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setOpenMin((prev) => !prev)
                  setOpenMax(false)
                }}
                className="h-10 rounded-md border bg-background px-4 text-sm text-foreground hover:bg-muted/40"
              >
                Fecha minima
                {fechaDesde ? `: ${format(fechaDesde, "dd/MM/yyyy")}` : ""}
              </button>
              {openMin && (
                <div className="absolute z-50 mt-2 w-fit rounded-md border bg-background p-2 shadow-lg">
                  <div className="flex items-center justify-between px-2 py-1">
                    <span className="text-xs text-muted-foreground">Selecciona fecha minima</span>
                    <button
                      type="button"
                      onClick={() => setOpenMin(false)}
                      className="h-6 w-6 rounded-md border bg-muted text-xs text-foreground hover:bg-muted/80"
                      aria-label="Cerrar"
                    >
                      x
                    </button>
                  </div>
                  <DayPicker
                    mode="single"
                    selected={fechaDesde}
                    onSelect={(date) => {
                      setFechaDesde(date)
                      if (date && fechaFin && date > fechaFin) {
                        setFechaFin(undefined)
                      }
                      setOpenMin(false)
                    }}
                    disabled={fechaFin ? { after: fechaFin } : undefined}
                    showOutsideDays
                    className="text-foreground"
                  />
                </div>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setOpenMax((prev) => !prev)
                  setOpenMin(false)
                }}
                className="h-10 rounded-md border bg-background px-4 text-sm text-foreground hover:bg-muted/40"
              >
                Fecha maxima
                {fechaFin ? `: ${format(fechaFin, "dd/MM/yyyy")}` : ""}
              </button>
              {openMax && (
                <div className="absolute z-50 mt-2 w-fit rounded-md border bg-background p-2 shadow-lg">
                  <div className="flex items-center justify-between px-2 py-1">
                    <span className="text-xs text-muted-foreground">Selecciona fecha maxima</span>
                    <button
                      type="button"
                      onClick={() => setOpenMax(false)}
                      className="h-6 w-6 rounded-md border bg-muted text-xs text-foreground hover:bg-muted/80"
                      aria-label="Cerrar"
                    >
                      x
                    </button>
                  </div>
                  <DayPicker
                    mode="single"
                    selected={fechaFin}
                    onSelect={(date) => {
                      setFechaFin(date)
                      if (date && fechaDesde && date < fechaDesde) {
                        setFechaDesde(undefined)
                      }
                      setOpenMax(false)
                    }}
                    disabled={fechaDesde ? { before: fechaDesde } : undefined}
                    showOutsideDays
                    className="text-foreground"
                  />
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setFechaDesde(undefined)
                setFechaFin(undefined)
              }}
              className="h-10 rounded-md border bg-muted px-4 text-sm text-foreground hover:bg-muted/80"
            >
              Limpiar
            </button>
          </div>
        </div>

        {/* Estadisticas de promedios */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-foreground">
            Estadisticas Generales
          </h2>
          <EstadisticasPromedios filtros={filtros} />
        </div>

        {/* Graficos de estado */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Grafico de barras */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">
              Reclamos por Estado
            </h2>
            <div className="rounded-lg border bg-card p-6">
              <ReclamosPorEstadoChart filtros={filtros} />
            </div>
          </div>

          {/* Grafico circular */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">
              Distribucion de Estados
            </h2>
            <div className="rounded-lg border bg-card p-6">
              <DistribucionEstadosChart filtros={filtros} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
