import { ReclamoDetailShell } from "@/features/dashboard/empleado/reclamos/components/reclamo-detail-shell"

interface DetalleReclamoPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function DetalleReclamoPage({ params }: DetalleReclamoPageProps) {
  const { id } = await params

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Detalle del Reclamo</h1>
      </div>
      <ReclamoDetailShell reclamoId={id} variant="detalle" />
    </div>
  )
}
