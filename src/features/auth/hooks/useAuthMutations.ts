'use client'
import { useMutation } from "@tanstack/react-query"
import { useAuthStore } from "@/stores/auth"
import type {
  LoginCredentials,
  RegisterCredentials,
} from "../services/authService"
import { authApi } from "../services/authService"
import type { AuthData } from "../types/auth"

/**
 * Hook for login mutation using TanStack Query
 */
export function useLoginMutation() {
  const setAuth = useAuthStore((state) => state.setAuth)

  return useMutation<AuthData, Error, LoginCredentials>({
    mutationFn: (credentials) => authApi.login.call(credentials),
    onSuccess: (data) => {
      setAuth(data)
      localStorage.setItem("access_token", data.access_token)
    },
  })
}

/**
 * Hook for register mutation using TanStack Query
 */
export function useRegisterMutation() {
  return useMutation<AuthData, Error, RegisterCredentials>({
    mutationFn: (credentials) => authApi.register.call(credentials),
  })
}
