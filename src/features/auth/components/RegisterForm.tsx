"use client"
import { Lock, Mail, Phone, User } from "lucide-react"
import { Button } from "@/components/button"
import { Field } from "@/components/field"
import { FieldSeparator } from "@/components/field-wrapper"
import { Label } from "@/components/label"
import { useRegisterForm } from "../hooks/useRegisterForm"

export function RegisterForm() {
  const { handleSubmit, loading, error } = useRegisterForm()

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-5">
      <FieldSeparator>
        <Label htmlFor="email">
          <Mail width={16} />
          Email
        </Label>
        <Field
          type="email"
          placeholder="tu@email.com"
          name="email"
          id="email"
        />
      </FieldSeparator>

      <FieldSeparator>
        <Label htmlFor="password">
          <Lock width={16} /> Contraseña
        </Label>
        <Field
          type="password"
          placeholder="••••••••"
          name="password"
          id="password"
        />
      </FieldSeparator>

      <FieldSeparator>
        <Label htmlFor="nombre">
          <User width={16} /> Nombre
        </Label>
        <Field
          type="text"
          placeholder="Thomas Nahuel Moreno"
          name="nombre"
          id="nombre"
        />
      </FieldSeparator>

      <FieldSeparator>
        <Label htmlFor="telefono">
          <Phone width={16} /> Número de Teléfono
        </Label>
        <Field
          type="tel"
          placeholder="3534436472"
          name="telefono"
          id="telefono"
        />
      </FieldSeparator>

      <Button size={"lg"} type="submit" className="mt-6" loading={loading}>
        Crear Cuenta
      </Button>
      {error && <p className="text-center mt-4 text-sm">{error}</p>}
    </form>
  )
}
