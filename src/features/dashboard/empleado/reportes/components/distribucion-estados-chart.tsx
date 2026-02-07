"use client"

import { Pie, PieChart, Cell } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/chart"
import { useReclamosPorEstado } from "../hooks/use-reportes"

type ReporteFiltros = {
  fechaDesde?: string
  fechaFin?: string
}

const chartConfig = {
  pendientes: {
    label: "Pendientes",
    color: "hsl(var(--chart-1))",
  },
  enProceso: {
    label: "En Proceso",
    color: "hsl(var(--chart-2))",
  },
  resueltos: {
    label: "Resueltos",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

const COLORS = [
  "#FF9500",
  "#0A84FF",
  "#32D74B",
]

export function DistribucionEstadosChart({ filtros }: { filtros?: ReporteFiltros }) {
  const { data, isLoading, error } = useReclamosPorEstado(filtros)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <p className="text-muted-foreground">Error al cargar datos</p>
      </div>
    )
  }

  const total = data.pendientes + data.enProceso + data.resueltos

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <p className="text-muted-foreground">No hay datos disponibles</p>
      </div>
    )
  }

  const chartData = [
    {
      name: "Pendientes",
      value: data.pendientes,
      percentage: Math.round((data.pendientes / total) * 100),
    },
    {
      name: "En Proceso",
      value: data.enProceso,
      percentage: Math.round((data.enProceso / total) * 100),
    },
    {
      name: "Resueltos",
      value: data.resueltos,
      percentage: Math.round((data.resueltos / total) * 100),
    },
  ].filter((item) => item.value > 0)

  return (
    <div className="space-y-4">
      <div className="[&_.recharts-pie-label-text]:!fill-white">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percentage, cx, cy, midAngle, innerRadius, outerRadius }) => {
                const RADIAN = Math.PI / 180
                const radius = outerRadius + 20
                const x = cx + radius * Math.cos(-midAngle * RADIAN)
                const y = cy + radius * Math.sin(-midAngle * RADIAN)

                return (
                  <text
                    x={x}
                    y={y}
                    fill="#FFFFFF"
                    textAnchor={x > cx ? "start" : "end"}
                    dominantBaseline="central"
                    style={{ fontSize: "13px", fontWeight: "bold" }}
                  >
                    {`${name}: ${percentage}%`}
                  </text>
                )
              }}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke="hsl(var(--background))"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, name) => (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{name}:</span>
                      <span className="font-mono">{value}</span>
                    </div>
                  )}
                />
              }
            />
          </PieChart>
        </ChartContainer>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[0] }}></div>
            <p className="text-2xl font-bold text-foreground">{data.pendientes}</p>
          </div>
          <p className="text-xs text-muted-foreground">Pendientes</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[1] }}></div>
            <p className="text-2xl font-bold text-foreground">{data.enProceso}</p>
          </div>
          <p className="text-xs text-muted-foreground">En Proceso</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[2] }}></div>
            <p className="text-2xl font-bold text-foreground">{data.resueltos}</p>
          </div>
          <p className="text-xs text-muted-foreground">Resueltos</p>
        </div>
      </div>
    </div>
  )
}
