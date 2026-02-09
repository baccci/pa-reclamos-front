"use client"

import { useState } from "react"
import { toast } from "sonner"
import type { Proyecto } from "../hooks/use-proyectos"
import { useTipoProyecto } from "../hooks/use-tipo-proyecto"
import { useActualizarProyecto, useEliminarProyecto } from "../hooks/use-proyecto-mutations"
import { formatDate } from "@/helpers/format"

interface ProjectCardProps {
  project: Proyecto
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [nombre, setNombre] = useState(project.nombre)
  const [descripcion, setDescripcion] = useState(project.descripcion || "")
  const [tipoProyectoId, setTipoProyectoId] = useState(project.tipoProyectoId)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const { data: tiposProyecto = [] } = useTipoProyecto()
  const actualizar = useActualizarProyecto()
  const eliminar = useEliminarProyecto()

  const tipoNombre = tiposProyecto.find((t) => t.id === project.tipoProyectoId)?.nombre

  function handleSave() {
    if (!nombre.trim()) {
      toast.error("El nombre es requerido")
      return
    }
    actualizar.mutate(
      { id: project.id, data: { nombre: nombre.trim(), descripcion: descripcion.trim() || undefined, tipoProyectoId } },
      {
        onSuccess: () => {
          toast.success("Proyecto actualizado")
          setIsEditing(false)
        },
        onError: (err) => toast.error(err.message || "Error al actualizar"),
      },
    )
  }

  function handleDelete() {
    eliminar.mutate(project.id, {
      onSuccess: () => toast.success("Proyecto eliminado"),
      onError: (err) => toast.error(err.message || "Error al eliminar"),
    })
  }

  function handleCancel() {
    setNombre(project.nombre)
    setDescripcion(project.descripcion || "")
    setTipoProyectoId(project.tipoProyectoId)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="bg-card rounded-xl p-6 space-y-4">
        <div className="space-y-3">
          <div>
            <label htmlFor={`nombre-${project.id}`} className="text-sm font-medium text-muted-foreground">Nombre *</label>
            <input
              id={`nombre-${project.id}`}
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              maxLength={40}
              className="w-full mt-1 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </div>
          <div>
            <label htmlFor={`desc-${project.id}`} className="text-sm font-medium text-muted-foreground">Descripción</label>
            <textarea
              id={`desc-${project.id}`}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              maxLength={150}
              rows={2}
              className="w-full mt-1 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground resize-none"
            />
          </div>
          <div>
            <label htmlFor={`tipo-${project.id}`} className="text-sm font-medium text-muted-foreground">Tipo de Proyecto *</label>
            <select
              id={`tipo-${project.id}`}
              value={tipoProyectoId}
              onChange={(e) => setTipoProyectoId(e.target.value)}
              className="w-full mt-1 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
            >
              {tiposProyecto.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={actualizar.isPending}
            className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 cursor-pointer"
          >
            {actualizar.isPending ? "Guardando..." : "Guardar"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-muted cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-xl p-6 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold text-foreground">{project.nombre}</h3>
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
          {tipoNombre || "Proyecto"}
        </span>
      </div>

      {project.descripcion && (
        <p className="text-muted-foreground text-sm line-clamp-2">{project.descripcion}</p>
      )}

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <span className="text-xs text-muted-foreground">{formatDate(new Date())}</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="px-3 py-1.5 text-xs font-medium text-primary hover:text-primary/80 border border-primary/20 rounded hover:bg-primary/5 transition-colors cursor-pointer"
          >
            Editar
          </button>
          {showDeleteConfirm ? (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleDelete}
                disabled={eliminar.isPending}
                className="px-3 py-1.5 text-xs font-medium text-red-400 hover:text-red-300 border border-red-500/20 rounded hover:bg-red-500/10 transition-colors cursor-pointer disabled:opacity-50"
              >
                {eliminar.isPending ? "..." : "Confirmar"}
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1.5 text-xs font-medium border border-border rounded hover:bg-muted transition-colors cursor-pointer"
              >
                No
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="px-3 py-1.5 text-xs font-medium text-red-400 hover:text-red-300 border border-red-500/20 rounded hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              Eliminar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
