import { ReclamosPorEstadoChart } from "@/features/dashboard/empleado/reportes/components/reclamos-por-estado-chart"
import { EstadisticasPromedios } from "@/features/dashboard/empleado/reportes/components/estadisticas-promedios"
import { EvolucionReclamosChart } from "@/features/dashboard/empleado/reportes/components/evolucion-reclamos-chart"
import { DistribucionEstadosChart } from "@/features/dashboard/empleado/reportes/components/distribucion-estados-chart"
import "@/features/dashboard/cliente/reportes/components/charts.css"

export default function EmpleadoReportesPage() {
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
          Estadísticas y métricas de reclamos del área
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-foreground">
            Estadísticas del Área
          </h2>
          <EstadisticasPromedios />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">
              Reclamos por Estado
            </h2>
            <div className="rounded-lg border bg-card p-6">
              <ReclamosPorEstadoChart />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">
              Distribución de Estados
            </h2>
            <div className="rounded-lg border bg-card p-6">
              <DistribucionEstadosChart />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-foreground">
            Evolución de Reclamos
          </h2>
          <div className="rounded-lg border bg-card p-6">
            <EvolucionReclamosChart />
          </div>
        </div>
      </div>
    </div>
  )
}
