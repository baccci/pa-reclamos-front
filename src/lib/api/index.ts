/**
 * API Client Global
 * 
 * Este archivo combina todos los módulos de API de las diferentes features
 * en un objeto global único usando el patrón "barrel export".
 * 
 * Cada feature exporta su módulo de API desde su carpeta services/,
 * y aquí se importan y combinan en el objeto `api`.
 * 
 * Estructura:
 * - api.auth.* - Autenticación y registro
 * - api.reclamos.* - Funcionalidades de reclamos (combinado de cliente, empleado, admin)
 * - api.proyectos.* - Funcionalidades de proyectos (principalmente cliente)
 * - api.clientes.* - Funcionalidades de clientes (empleado, admin)
 * - api.areas.* - Funcionalidades de áreas (admin)
 * - api.usuarios.* - Funcionalidades de usuarios (admin)
 */

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
// import { reclamosClienteApi } from '@/features/dashboard/cliente/services/reclamos-api'
// import { proyectosClienteApi } from '@/features/dashboard/cliente/services/proyectos-api'
const reclamosClienteApi = {} // Placeholder
const proyectosClienteApi = {} // Placeholder

// ============================================
// EMPLEADO - Funcionalidades del Dashboard Empleado
// ============================================
// TODO: Importar cuando estén listos
// import { reclamosEmpleadoApi } from '@/features/dashboard/empleado/services/reclamos-api'
// import { clientesEmpleadoApi } from '@/features/dashboard/empleado/services/clientes-api'
const reclamosEmpleadoApi = {} // Placeholder
const clientesEmpleadoApi = {} // Placeholder

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
  // Autenticación
  auth: authApi,

  // Reclamos - Combinado de cliente, empleado y admin
  reclamos: {
    // Métodos del cliente
    ...reclamosClienteApi,
    // Métodos del empleado
    ...reclamosEmpleadoApi,
    // Métodos compartidos o de admin (agregar aquí)
    // obtener: (id: string) => { /* ... */ },
    // listarTodos: (filtros?: any) => { /* ... */ },
  },

  // Proyectos - Principalmente cliente
  proyectos: {
    ...proyectosClienteApi,
    // Métodos compartidos o de admin (agregar aquí si es necesario)
  },

  // Clientes - Empleado y admin
  clientes: {
    ...clientesEmpleadoApi,
    // Métodos de admin (agregar aquí si es necesario)
  },

  // Áreas - Admin
  areas: {
    ...areasAdminApi,
  },

  // Usuarios - Admin
  usuarios: {
    ...usuariosAdminApi,
  },
} as const

