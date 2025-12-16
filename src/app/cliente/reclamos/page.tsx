import { MainLayout } from "@/components/layout/main-layout"
import { MisReclamos } from "@/features/dashboard/cliente/components/reclamos/mis-reclamos"

export default function ClienteReclamosPage() {
  return (
    <MainLayout>
      <MisReclamos />
    </MainLayout>
  )
}
