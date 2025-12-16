import { MainLayout } from "@/components/layout/main-layout"
import { ReclamoClienteDetail } from "@/features/dashboard/cliente/components/reclamos/reclamo-cliente-detail"

export default function ClienteReclamoDetailPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <MainLayout>
      <ReclamoClienteDetail id={params.id} />
    </MainLayout>
  )
}
