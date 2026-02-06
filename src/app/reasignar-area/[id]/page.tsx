import { ReasignarAreaForm } from "@/features/dashboard/empleado/reclamos/components/reasignar-area-form"
import { ReclamoDetailShell } from "@/features/dashboard/empleado/reclamos/components/reclamo-detail-shell"

interface ReasignarAreaPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ReasignarAreaPage({ params }: ReasignarAreaPageProps) {
  const { id } = await params

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Reasignar área</h1>
      </div>
      <ReclamoDetailShell
        reclamoId={id}
        renderForm={(reclamo, currentCambioEstado) => (
          <ReasignarAreaForm
            reclamoId={id}
            currentAreaId={reclamo.areaId || currentCambioEstado?.area?.id}
          />
        )}
      />
    </div>
  )
}
