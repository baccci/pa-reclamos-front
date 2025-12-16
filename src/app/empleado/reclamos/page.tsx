import { MainLayout } from "@/components/layout/main-layout"
import { ReclamosPorArea } from "@/features/dashboard/empleado/components/reclamos/reclamos-por-area"

export default function ReclamosEmpleadoPage() {
  return (
    <MainLayout>
      <ReclamosPorArea />
    </MainLayout>
  )
}
