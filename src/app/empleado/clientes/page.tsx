import { MainLayout } from "@/components/layout/main-layout"
import { ClienteList } from "@/features/dashboard/empleado/components/clientes/clientes-list"

export default function ClientesEmpleadoPage() {
  return (
    <MainLayout>
      <ClienteList />
    </MainLayout>
  )
}
