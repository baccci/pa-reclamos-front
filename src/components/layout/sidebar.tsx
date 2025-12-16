"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { NAVIGATION_ITEMS } from "@/constants/navigation"
import { UserCard } from "./user-card"

const Icons = {
  plus: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  list: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
      />
    </svg>
  ),
} as const

type NavItem = {
  label: string
  href: string
  icon: keyof typeof Icons
  section?: "cliente" | "empleado" | "base"
}

const EXTRA_CLIENTE: NavItem[] = [
  { label: "Cliente • Mis reclamos", href: "/cliente/reclamos", icon: "list", section: "cliente" },
  // Si no existe, borrá esta línea:
  { label: "Cliente • Mis proyectos", href: "/cliente/proyectos", icon: "list", section: "cliente" },
]

const EXTRA_EMPLEADO: NavItem[] = [
  { label: "Empleado • Reclamos", href: "/empleado/reclamos", icon: "list", section: "empleado" },
  { label: "Empleado • Clientes", href: "/empleado/clientes", icon: "list", section: "empleado" },
]

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/")
}

function dedupeByHref(items: NavItem[]) {
  const seen = new Set<string>()
  const out: NavItem[] = []
  for (const it of items) {
    if (seen.has(it.href)) continue
    seen.add(it.href)
    out.push(it)
  }
  return out
}

function normalizeNavItems(input: Array<{ label: string; href: string; icon: string }>): NavItem[] {
  // Si tu NAVIGATION_ITEMS tiene icon strings que no existen, cae a "list"
  return input.map((i) => ({
    label: i.label,
    href: i.href,
    icon: (i.icon in Icons ? (i.icon as keyof typeof Icons) : "list"),
    section: "base",
  }))
}

export function Sidebar() {
  const pathname = usePathname()

  const base = normalizeNavItems(NAVIGATION_ITEMS as any)

  // ✅ Siempre mostramos Cliente + Empleado para navegar sin Auth
  const combinedItems = dedupeByHref([...base, ...EXTRA_CLIENTE, ...EXTRA_EMPLEADO])

  return (
    <aside className="w-64 bg-card h-screen flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold text-foreground">Reclamos</h1>
        <p className="text-sm text-muted-foreground">Sistema de gestión</p>
      </div>

      <nav className="flex-1 px-4 overflow-auto">
        <ul className="space-y-2">
          {combinedItems.map((item) => {
            const active = isActivePath(pathname, item.href)

            return (
              <li key={item.href}>
                <Link
                  href={{ pathname: item.href }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {Icons[item.icon]}
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="mt-4 text-xs text-muted-foreground px-4">
          * Se muestran accesos de Cliente y Empleado para navegar sin login (Auth lo hace Salvador).
        </div>
      </nav>

      <div className="p-4 mt-auto">
        <UserCard />
      </div>
    </aside>
  )
}
