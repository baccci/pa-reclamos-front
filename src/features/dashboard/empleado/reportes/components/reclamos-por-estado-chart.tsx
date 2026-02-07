"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
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
  cantidad: {
    label: "Cantidad de Reclamos",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function ReclamosPorEstadoChart({ filtros }: { filtros?: ReporteFiltros }) {
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

  const chartData = [
    {
      estado: "Pendientes",
      cantidad: data.pendientes,
      fill: "#FF9500",
    },
    {
      estado: "En Proceso",
      cantidad: data.enProceso,
      fill: "#0A84FF",
    },
    {
      estado: "Resueltos",
      cantidad: data.resueltos,
      fill: "#32D74B",
    },
  ]

  return (
    <div className="[&_.recharts-cartesian-axis-tick_text]:!fill-[#E5E7EB] [&_.recharts-label]:!fill-white">
      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis
            dataKey="estado"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tick={{ fill: "#E5E7EB", fontSize: 13 }}
          />
          <YAxis
            tick={{ fill: "#E5E7EB", fontSize: 13 }}
            axisLine={false}
            tickLine={false}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar
            dataKey="cantidad"
            radius={8}
            label={{
              position: "top",
              fill: "#FFFFFF",
              fontSize: 14,
              fontWeight: "bold",
            }}
          />
        </BarChart>
      </ChartContainer>
    </div>
  )
}
