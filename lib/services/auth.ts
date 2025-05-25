import { AuthRequest, AuthResponse, AuthError } from "@/lib/types/auth"
import { apiRequest, ApiError } from "./api-client"

export async function register(credentials: AuthRequest): Promise<AuthResponse> {
  try {
    const data = await apiRequest<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(credentials),
    })

    return data
  } catch (error) {
    if (error instanceof ApiError) {
      throw new AuthError(error.message)
    }
    throw new AuthError("Failed to connect to the server. Please try again later.")
  }
}

export async function login(credentials: AuthRequest): Promise<AuthResponse> {
  try {
    const data = await apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })

    if (data.data?.session) {
      setAuthToken(data.data.session.access_token, data.data.session.expires_in)
    }

    return data
  } catch (error) {
    if (error instanceof ApiError) {
      throw new AuthError(error.message)
    }
    throw new AuthError("Failed to connect to the server. Please try again later.")
  }
}

export function setAuthToken(token: string, expiresIn: number) {
  if (typeof document !== "undefined") {
    document.cookie = `auth_token=${token}; path=/; max-age=${expiresIn}; secure; samesite=strict`;
  }
}

export function getAuthToken(): string | null {
  if (typeof document !== "undefined") {
    const cookies = document.cookie.split(";")
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split("=")
      if (name === "auth_token") {
        return value
      }
    }
  }
  return null
}

export function removeAuthToken() {
  if (typeof document !== "undefined") {
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict";
  }
}

export function isAuthenticated(): boolean {
  return getAuthToken() !== null
}

export async function logout(): Promise<void> {
  removeAuthToken()
} 