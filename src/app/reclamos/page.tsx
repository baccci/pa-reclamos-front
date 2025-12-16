import { MainLayout } from "@/components/layout/main-layout"
import { ListaReclamos } from "@/features/dashboard/cliente/reclamos/components/lista-reclamos"

export default function ClaimsPage() {
  return (
    <MainLayout>
      <ListaReclamos />
    </MainLayout>
  )
}
