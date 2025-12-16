import { MainLayout } from "@/components/layout/main-layout"
import { ReclamoDetail } from "@/features/dashboard/empleado/components/reclamos/reclamo-detail"

export default function ReclamoEmpleadoDetailPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <MainLayout>
      <ReclamoDetail id={params.id} />
    </MainLayout>
  )
}
