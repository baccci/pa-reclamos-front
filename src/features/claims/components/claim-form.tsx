"use client"

import type React from "react"

import { useState } from "react"
import {
  CLAIM_TYPES,
  CRITICALITY_OPTIONS,
  PRIORITY_OPTIONS,
} from "../constants/claim-options"
import type {
  ClaimType,
  CreateClaimPayload,
  Criticality,
  Priority,
} from "../types/claim"
import { FormFileUpload } from "./form/form-file-upload"
import { FormInput } from "./form/form-input"
import { FormRadioGroup } from "./form/form-radio-group"
import { FormSelect } from "./form/form-select"
import { FormTextarea } from "./form/form-textarea"

const INITIAL_STATE = {
  title: "",
  description: "",
  type: "" as ClaimType | "",
  priority: "" as Priority | "",
  criticality: "" as Criticality | "",
  attachments: [] as File[],
}

export function ClaimForm() {
  const [formData, setFormData] = useState(INITIAL_STATE)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const payload: CreateClaimPayload = {
      title: formData.title,
      description: formData.description,
      type: formData.type as ClaimType,
      priority: formData.priority as Priority,
      criticality: formData.criticality as Criticality,
      attachments: formData.attachments,
    }

    console.log("[API Payload]", JSON.stringify(payload, null, 2))

    await new Promise((resolve) => setTimeout(resolve, 500))

    setFormData(INITIAL_STATE)
    setIsSubmitting(false)
  }

  return (
    <div className="bg-card rounded-2xl p-8 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Registrar Nuevo Reclamo
        </h1>
        <p className="text-muted-foreground">
          Complete el formulario para registrar su reclamo
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          label="Título"
          id="title"
          value={formData.title}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, title: value }))
          }
          placeholder="Ingrese un título descriptivo"
          required
        />

        <FormTextarea
          label="Descripción Detallada"
          id="description"
          value={formData.description}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, description: value }))
          }
          placeholder="Describa su reclamo con el mayor detalle posible"
          required
          rows={4}
        />

        <FormSelect
          label="Tipo de Reclamo"
          id="type"
          value={formData.type}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, type: value as ClaimType }))
          }
          options={CLAIM_TYPES}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormRadioGroup
            label="Prioridad"
            name="priority"
            value={formData.priority}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, priority: value as Priority }))
            }
            options={PRIORITY_OPTIONS}
            required
          />

          <FormRadioGroup
            label="Criticidad"
            name="criticality"
            value={formData.criticality}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                criticality: value as Criticality,
              }))
            }
            options={CRITICALITY_OPTIONS}
            required
          />
        </div>

        <FormFileUpload
          label="Archivos Adjuntos"
          files={formData.attachments}
          onChange={(files) =>
            setFormData((prev) => ({ ...prev, attachments: files }))
          }
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-6 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Enviando..." : "Enviar Reclamo"}
        </button>
      </form>
    </div>
  )
}
