/**
 * API Client Global
 *
 * Este archivo combina todos los módulos de API de las diferentes features
 * en un objeto global único usando el patrón "barrel export".
 */

// ✅ Proyectos (cliente)
import { proyectosClienteApi } from "@/features/dashboard/cliente/services/proyectos-api"

// ============================================
// AUTH - Autenticación y Registro
// ============================================
// TODO: Importar cuando esté listo
// import { authApi } from '@/features/auth/services/api'
const authApi = {} // Placeholder

// ============================================
// CLIENTE - Funcionalidades del Dashboard Cliente
// ============================================
// TODO: Importar cuando estén listos
import { reclamosClienteApi } from '@/features/dashboard/cliente/services/reclamos-api'

// ============================================
// EMPLEADO - Funcionalidades del Dashboard Empleado
// ============================================
// TODO: Importar cuando estén listos
// import { reclamosEmpleadoApi } from '@/features/dashboard/empleado/services/reclamos-api'
import { clientesEmpleadoApi } from '@/features/dashboard/empleado/services/clientes-api'
import { reclamosEmpleadoApi } from "@/features/dashboard/empleado/services/reclamos-api"


// ============================================
// ADMIN - Funcionalidades del Dashboard Admin
// ============================================
// TODO: Importar cuando estén listos
// import { areasAdminApi } from '@/features/dashboard/admin/services/areas-api'
// import { usuariosAdminApi } from '@/features/dashboard/admin/services/usuarios-api'
const areasAdminApi = {} // Placeholder
const usuariosAdminApi = {} // Placeholder

// ============================================
// API GLOBAL - Combinación de todos los módulos
// ============================================
export const api = {
  auth: authApi,

  reclamos: {
    ...reclamosClienteApi,
    ...reclamosEmpleadoApi,
  },

  proyectos: {
    ...proyectosClienteApi,
  },

  clientes: {
    ...clientesEmpleadoApi,
  },

  areas: {
    ...areasAdminApi,
  },

  usuarios: {
    ...usuariosAdminApi,
  },
} as const
