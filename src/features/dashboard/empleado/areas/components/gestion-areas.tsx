"use client"

import type React from "react"
import { useState } from "react"
import { toast } from "sonner"

import { useAreas, type Area } from "@/features/dashboard/cliente/reclamos/hooks/use-areas"
import { FormInput } from "@/features/dashboard/cliente/reclamos/components/form/form-input"
import { FormTextarea } from "@/features/dashboard/cliente/reclamos/components/form/form-textarea"

import { useCreateArea, useDeleteArea, useUpdateArea } from "../hooks/use-area-mutations"

function AreaForm({
  initialData,
  onSubmit,
  onCancel,
  isPending,
  submitLabel,
}: {
  initialData?: { nombre: string; descripcion: string }
  onSubmit: (data: { nombre: string; descripcion?: string }) => void
  onCancel?: () => void
  isPending: boolean
  submitLabel: string
}) {
  const [nombre, setNombre] = useState(initialData?.nombre ?? "")
  const [descripcion, setDescripcion] = useState(initialData?.descripcion ?? "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ nombre, descripcion: descripcion || undefined })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormInput
        label="Nombre"
        id="area-nombre"
        value={nombre}
        onChange={setNombre}
        placeholder="Nombre del área"
        required
      />
      <FormTextarea
        label="Descripción"
        id="area-descripcion"
        value={descripcion}
        onChange={setDescripcion}
        placeholder="Descripción del área (opcional)"
        rows={3}
      />
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isPending || !nombre.trim()}
          className="flex-1 py-3 px-6 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Guardando..." : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 text-muted-foreground border border-border rounded-lg hover:bg-muted transition-colors"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}

function AreaCard({
  area,
  onEdit,
  onDelete,
  isDeleting,
}: {
  area: Area
  onEdit: () => void
  onDelete: () => void
  isDeleting: boolean
}) {
  return (
    <div className="bg-card rounded-xl p-5 flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-foreground">{area.nombre}</h3>
        {area.descripcion && (
          <p className="text-sm text-muted-foreground mt-1">{area.descripcion}</p>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onEdit}
          className="px-3 py-1.5 text-xs font-medium text-primary hover:text-primary/80 border border-primary/20 rounded hover:bg-primary/5 transition-colors"
        >
          Editar
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={isDeleting}
          className="px-3 py-1.5 text-xs font-medium text-red-400 hover:text-red-300 border border-red-400/20 rounded hover:bg-red-400/5 transition-colors disabled:opacity-50"
        >
          {isDeleting ? "..." : "Eliminar"}
        </button>
      </div>
    </div>
  )
}

export function GestionAreas() {
  const { data: areas = [], isLoading, error } = useAreas()
  const { mutateAsync: crearArea, isPending: isCreating } = useCreateArea()
  const { mutateAsync: actualizarArea, isPending: isUpdating } = useUpdateArea()
  const { mutateAsync: eliminarArea, isPending: isDeletingAny } = useDeleteArea()

  const [editingArea, setEditingArea] = useState<Area | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleCreate = async (data: { nombre: string; descripcion?: string }) => {
    try {
      await crearArea(data)
      toast.success("Área creada correctamente")
      setShowCreateForm(false)
    } catch {
      toast.error("Error al crear el área")
    }
  }

  const handleUpdate = async (data: { nombre: string; descripcion?: string }) => {
    if (!editingArea) return
    try {
      await actualizarArea({ id: editingArea.id, data })
      toast.success("Área actualizada correctamente")
      setEditingArea(null)
    } catch {
      toast.error("Error al actualizar el área")
    }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await eliminarArea(id)
      toast.success("Área eliminada correctamente")
    } catch {
      toast.error("Error al eliminar el área")
    } finally {
      setDeletingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">Error al cargar las áreas.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gestión de Áreas</h2>
        {!showCreateForm && !editingArea && (
          <button
            type="button"
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-colors text-sm"
          >
            Nueva Área
          </button>
        )}
      </div>

      {showCreateForm && (
        <div className="bg-card rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Crear nueva área</h3>
          <AreaForm
            onSubmit={handleCreate}
            onCancel={() => setShowCreateForm(false)}
            isPending={isCreating}
            submitLabel="Crear área"
          />
        </div>
      )}

      {editingArea && (
        <div className="bg-card rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            Editar: {editingArea.nombre}
          </h3>
          <AreaForm
            initialData={{
              nombre: editingArea.nombre,
              descripcion: editingArea.descripcion ?? "",
            }}
            onSubmit={handleUpdate}
            onCancel={() => setEditingArea(null)}
            isPending={isUpdating}
            submitLabel="Guardar cambios"
          />
        </div>
      )}

      {areas.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No hay áreas registradas</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {areas.map((area) => (
            <AreaCard
              key={area.id}
              area={area}
              onEdit={() => {
                setEditingArea(area)
                setShowCreateForm(false)
              }}
              onDelete={() => handleDelete(area.id)}
              isDeleting={deletingId === area.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}
