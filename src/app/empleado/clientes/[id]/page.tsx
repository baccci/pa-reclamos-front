import { MainLayout } from "@/components/layout/main-layout"
import { ClienteDetail } from "@/features/dashboard/empleado/components/clientes/clientes-detail"

export default function ClienteEmpleadoDetailPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <MainLayout>
      <ClienteDetail id={params.id} />
    </MainLayout>
  )
}
