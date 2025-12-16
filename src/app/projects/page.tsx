import { MainLayout } from "@/components/layout/main-layout"
import { ProyectoList } from "@/features/dashboard/cliente/components/proyectos/proyectos-list"

export default function ProjectsPage() {
  return (
    <MainLayout>
      <ProyectoList />
    </MainLayout>
  )
}
