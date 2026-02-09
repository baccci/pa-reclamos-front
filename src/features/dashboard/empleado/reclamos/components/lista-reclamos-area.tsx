"use client"

import { useMemo, useState } from "react"

import { useAreaClaims } from "@/features/dashboard/cliente/reclamos/hooks/use-area-reclamo"
import { useAreas } from "@/features/dashboard/cliente/reclamos/hooks/use-areas"
import type { ClaimStatus } from "@/features/dashboard/cliente/reclamos/types/claim"
import { useEmpleadoProfile } from "@/features/dashboard/empleado/hooks/use-empleado-profile"

import { ClaimCardEmployee } from "./claim-card-employee"

const STATUS_TABS: { label: string; value: ClaimStatus | "all" }[] = [
  { label: "Todos", value: "all" },
  { label: "Pendientes", value: "pending" },
  { label: "En Proceso", value: "in_progress" },
  { label: "Resueltos", value: "resolved" },
]

export function ListaReclamosArea() {
  const { data: claims = [], isLoading, error } = useAreaClaims()
  const { data: empleado } = useEmpleadoProfile()
  const { data: areas = [] } = useAreas()
  const [activeTab, setActiveTab] = useState<ClaimStatus | "all">("all")

  const areaNombre = useMemo(() => {
    if (!empleado?.area) return null
    return areas.find((a) => a.id === empleado.area)?.nombre ?? null
  }, [empleado?.area, areas])

  const filteredClaims = useMemo(() => {
    if (activeTab === "all") return claims
    return claims.filter((claim) => claim.status === activeTab)
  }, [claims, activeTab])

  const counts = useMemo(() => ({
    all: claims.length,
    pending: claims.filter((c) => c.status === "pending").length,
    in_progress: claims.filter((c) => c.status === "in_progress").length,
    resolved: claims.filter((c) => c.status === "resolved").length,
  }), [claims])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">Error al cargar los reclamos del área.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 w-full">
      <div>
        <h2 className="text-2xl font-bold">Reclamos de mi Área</h2>
        {areaNombre ? (
          <p className="text-sm text-muted-foreground mt-1">
            Área: <span className="text-foreground font-medium">{areaNombre}</span>
          </p>
        ) : empleado && !empleado.area ? (
          <p className="text-sm text-yellow-400 mt-1">No tenés un área asignada</p>
        ) : null}
      </div>

      <div className="flex gap-2 flex-wrap">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${activeTab === tab.value
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
          >
            {tab.label}
            <span className="ml-2 px-1.5 py-0.5 rounded-full text-xs bg-background/20">
              {counts[tab.value as keyof typeof counts]}
            </span>
          </button>
        ))}
      </div>

      {filteredClaims.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {activeTab === "all"
              ? "No hay reclamos asignados al área"
              : "No hay reclamos con este estado"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredClaims.map((claim) => (
            <ClaimCardEmployee key={claim.id} claim={claim} />
          ))}
        </div>
      )}
    </div>
  )
}
