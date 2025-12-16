type SimpleHeaders = Record<string, string>

export interface ApiClientOptions extends Omit<RequestInit, "headers"> {
  skipAuth?: boolean
  headers?: SimpleHeaders
}

export class ApiError extends Error {
  status: number
  data?: unknown

  constructor(message: string, status: number, data?: unknown) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.data = data
  }
}

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL

function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("access_token")
}

export async function apiClient<T = unknown>(
  endpoint: string,
  options: ApiClientOptions = {},
): Promise<T> {
  if (!API_URL) {
    throw new Error("Falta NEXT_PUBLIC_BACKEND_URL en tu .env")
  }

  const { skipAuth, ...fetchOptions } = options
  const token = skipAuth ? null : getToken()

  const headers: SimpleHeaders = {
    ...(fetchOptions.headers ?? {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  // Solo seteo Content-Type si NO es FormData
  const body = fetchOptions.body
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData
  if (!isFormData) {
    headers["Content-Type"] = headers["Content-Type"] ?? "application/json"
  }

  const url = `${API_URL}${endpoint}`

  const res = await fetch(url, {
    ...fetchOptions,
    headers,
  })

  const contentType = res.headers.get("content-type") ?? ""
  const isJson = contentType.includes("application/json")

  const data = isJson ? await res.json().catch(() => null) : await res.text().catch(() => "")

  if (!res.ok) {
    const message =
      (typeof data === "object" && data && "message" in (data as any) && (data as any).message) ||
      `Request failed (${res.status})`

    throw new ApiError(String(message), res.status, data)
  }

  return data as T
}
