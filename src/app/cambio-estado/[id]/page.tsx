import { CambioEstadoForm } from "@/features/dashboard/empleado/reclamos/components/cambio-estado-form"
import { ReclamoDetailShell } from "@/features/dashboard/empleado/reclamos/components/reclamo-detail-shell"

interface CambioEstadoPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function CambioEstadoPage({ params }: CambioEstadoPageProps) {
  const { id } = await params

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Cambiar estado</h1>
      </div>
      <ReclamoDetailShell
        reclamoId={id}
        renderForm={(reclamo) => (
          <CambioEstadoForm reclamoId={id} currentStatus={reclamo.status} />
        )}
      />
    </div>
  )
}
