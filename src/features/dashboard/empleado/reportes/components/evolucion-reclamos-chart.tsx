"use client"

import { useMemo, useState } from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/chart"

import { useReclamosParaEvolucion } from "../hooks/use-empleado-reportes"

const chartConfig = {
  cantidad: {
    label: "Cantidad",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

const PERIODOS = [
  { key: "7dias", label: "7 días", dias: 7 },
  { key: "30dias", label: "30 días", dias: 30 },
  { key: "90dias", label: "90 días", dias: 90 },
] as const

type Periodo = (typeof PERIODOS)[number]["key"]

export function EvolucionReclamosChart() {
  const [periodo, setPeriodo] = useState<Periodo>("30dias")
  const { data: reclamos = [], isLoading, error } = useReclamosParaEvolucion()

  const chartData = useMemo(() => {
    const diasAtras = PERIODOS.find((p) => p.key === periodo)?.dias ?? 30
    const desde = new Date()
    desde.setDate(desde.getDate() - diasAtras)

    const filtrados = reclamos.filter((r: Record<string, unknown>) => {
      if (!r.createdAt) return false
      const fecha = new Date(r.createdAt as string)
      return !Number.isNaN(fecha.getTime()) && fecha >= desde
    })

    const porFecha: Record<string, number> = {}
    for (const r of filtrados) {
      const fecha = new Date((r as Record<string, unknown>).createdAt as string).toISOString().split("T")[0]
      porFecha[fecha] = (porFecha[fecha] || 0) + 1
    }

    return Object.entries(porFecha)
      .map(([fecha, cantidad]) => ({
        fecha: new Date(fecha).toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "short",
        }),
        fechaCompleta: fecha,
        cantidad,
      }))
      .sort((a, b) => a.fechaCompleta.localeCompare(b.fechaCompleta))
  }, [reclamos, periodo])

  const periodoButtons = (
    <div className="flex gap-2">
      {PERIODOS.map((p) => (
        <button
          key={p.key}
          type="button"
          onClick={() => setPeriodo(p.key)}
          className={`px-3 py-1 rounded-md text-sm cursor-pointer ${
            periodo === p.key
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  )

  if (isLoading) {
    return (
      <div className="space-y-4">
        {periodoButtons}
        <div className="flex items-center justify-center h-[300px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        {periodoButtons}
        <div className="flex items-center justify-center h-[300px]">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">Error al cargar datos</p>
            <p className="text-xs text-red-400">{error.message}</p>
          </div>
        </div>
      </div>
    )
  }

  if (chartData.length === 0) {
    return (
      <div className="space-y-4">
        {periodoButtons}
        <div className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground">No hay reclamos en este periodo</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {periodoButtons}
      <div className="[&_.recharts-cartesian-axis-tick_text]:!fill-[#E5E7EB]">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="fecha"
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
            <Line
              type="monotone"
              dataKey="cantidad"
              stroke="#FF9500"
              strokeWidth={3}
              dot={{ fill: "#FF9500", r: 5, strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ChartContainer>
      </div>
    </div>
  )
}
