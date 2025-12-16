"use client"

import { useCallback, useEffect, useState } from "react"
import { claimService } from "../services/claim-service"
import type { Claim, CreateClaimPayload } from "../types/claim"

export function useClaims() {
  const [claims, setClaims] = useState<Claim[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchClaims = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await claimService.getClaims()
      setClaims(data)
      setError(null)
    } catch (err) {
      setError("Error al cargar los reclamos")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchClaims()
  }, [fetchClaims])

  const createClaim = async (payload: CreateClaimPayload): Promise<boolean> => {
    try {
      const newClaim = await claimService.createClaim(payload)
      setClaims((prev) => [newClaim, ...prev])
      return true
    } catch (err) {
      setError("Error al crear el reclamo")
      console.error(err)
      return false
    }
  }

  return {
    claims,
    isLoading,
    error,
    createClaim,
    refetch: fetchClaims,
  }
}
