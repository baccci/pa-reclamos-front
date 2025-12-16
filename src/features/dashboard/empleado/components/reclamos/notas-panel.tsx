"use client"

import { useMemo, useState } from "react"
import { useNotasReclamo } from "@/features/dashboard/empleado/hooks/use-notas-reclamo"
import type { NotaReclamo } from "@/types/notas-empleados"

function formatDate(value?: string | Date) {
  if (!value) return "-"
  const d = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(d.getTime())) return "-"
  return d.toLocaleString("es-AR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function NotaItem({
  nota,
  onEdit,
  onDelete,
}: {
  nota: NotaReclamo
  onEdit: (notaId: string, contenido: string) => Promise<void>
  onDelete: (notaId: string) => Promise<void>
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [txt, setTxt] = useState(nota.contenido)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function save() {
    setErr(null)
    try {
      setBusy(true)
      await onEdit(nota.id, txt)
      setIsEditing(false)
    } catch (e) {
      console.error(e)
      setErr("No se pudo editar la nota")
    } finally {
      setBusy(false)
    }
  }

  async function del() {
    setErr(null)
    if (!confirm("¿Eliminar esta nota?")) return
    try {
      setBusy(true)
      await onDelete(nota.id)
    } catch (e) {
      console.error(e)
      setErr("No se pudo eliminar la nota")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="border border-border rounded-xl p-3 space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-xs text-muted-foreground">
          {nota.empleado?.nombre ? `Por ${nota.empleado.nombre} • ` : ""}
          {formatDate(nota.createdAt)}
          {nota.updatedAt && String(nota.updatedAt) !== String(nota.createdAt)
            ? ` (editado ${formatDate(nota.updatedAt)})`
            : ""}
        </div>

        <div className="flex gap-2">
          {!isEditing ? (
            <button
              type="button"
              className="text-xs underline text-primary"
              onClick={() => setIsEditing(true)}
              disabled={busy}
            >
              Editar
            </button>
          ) : (
            <button
              type="button"
              className="text-xs underline text-primary"
              onClick={() => {
                setTxt(nota.contenido)
                setIsEditing(false)
              }}
              disabled={busy}
            >
              Cancelar
            </button>
          )}

          <button
            type="button"
            className="text-xs underline text-red-400"
            onClick={del}
            disabled={busy}
          >
            Eliminar
          </button>
        </div>
      </div>

      {err && <p className="text-xs text-red-400">{err}</p>}

      {!isEditing ? (
        <p className="text-sm whitespace-pre-wrap">{nota.contenido}</p>
      ) : (
        <div className="space-y-2">
            <textarea
            aria-label="Editar nota interna"
            className="bg-input border border-border rounded-lg px-3 py-2 w-full min-h-[100px]"
            value={txt}
            onChange={(e) => setTxt(e.target.value)}
            disabled={busy}
            />
          <button
            type="button"
            className="rounded-lg px-3 py-2 bg-primary text-primary-foreground text-sm disabled:opacity-50"
            onClick={save}
            disabled={busy || !txt.trim()}
          >
            {busy ? "Guardando..." : "Guardar"}
          </button>
        </div>
      )}
    </div>
  )
}

export function NotasPanel({ reclamoId }: { reclamoId: string }) {
  const { notas, isLoading, error, refetch, crear, editar, eliminar } = useNotasReclamo(reclamoId)

  const [nuevo, setNuevo] = useState("")
  const [busy, setBusy] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const ordenadas = useMemo(() => {
    return [...notas].sort((a, b) => {
      const da = new Date(a.createdAt as any).getTime()
      const db = new Date(b.createdAt as any).getTime()
      return db - da
    })
  }, [notas])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitError(null)
    const txt = nuevo.trim()
    if (!txt) return

    try {
      setBusy(true)
      await crear(txt)
      setNuevo("")
    } catch (e) {
      console.error(e)
      setSubmitError("No se pudo crear la nota")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold">Notas internas</p>
          <p className="text-sm text-muted-foreground">
            Solo visibles para empleados del área asignada.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-lg px-3 py-2 bg-primary text-primary-foreground text-sm"
        >
          Recargar
        </button>
      </div>

      <form onSubmit={submit} className="space-y-2">
        {submitError && <p className="text-sm text-red-400">{submitError}</p>}
        <textarea
        className="bg-input border border-border rounded-lg px-3 py-2 w-full min-h-[110px]"
        placeholder="Escribí una nota interna..."
        value={nuevo}
        onChange={(e) => setNuevo(e.target.value)}
        disabled={busy}
        />

        <button
          type="submit"
          disabled={busy || !nuevo.trim()}
          className="rounded-lg px-4 py-2 bg-primary text-primary-foreground disabled:opacity-50"
        >
          {busy ? "Guardando..." : "Agregar nota"}
        </button>
      </form>

      {isLoading && (
        <div className="flex items-center justify-center py-6">
          <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-primary" />
        </div>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}

      {!isLoading && !error && ordenadas.length === 0 && (
        <p className="text-sm text-muted-foreground">Todavía no hay notas.</p>
      )}

      {!isLoading && !error && ordenadas.length > 0 && (
        <div className="space-y-3">
          {ordenadas.map((n) => (
            <NotaItem
              key={n.id}
              nota={n}
              onEdit={editar}
              onDelete={eliminar}
            />
          ))}
        </div>
      )}
    </div>
  )
}
