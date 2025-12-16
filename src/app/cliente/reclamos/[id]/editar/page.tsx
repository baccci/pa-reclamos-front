import { MainLayout } from "@/components/layout/main-layout"
import { ReclamoClienteEdit } from "@/features/dashboard/cliente/components/reclamos/reclamo-cliente-edit"

export default function ClienteReclamoEditPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <MainLayout>
      <ReclamoClienteEdit id={params.id} />
    </MainLayout>
  )
}
