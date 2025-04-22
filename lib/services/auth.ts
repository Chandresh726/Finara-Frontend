import { SignUpRequest, LoginRequest, AuthResponse } from "@/types/auth"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export class AuthError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "AuthError"
  }
}

export async function register(credentials: SignUpRequest): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(credentials),
    })

    const data = await response.json()

    if (!response.ok || !data.success) {
      throw new AuthError(data.details?.message || data.message || "Registration failed")
    }

    return data
  } catch (error) {
    if (error instanceof AuthError) {
      throw error
    }
    throw new AuthError("Failed to connect to the server. Please try again later.")
  }
}

export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(credentials),
    })

    const data = await response.json()

    if (!response.ok || !data.success) {
      throw new AuthError(data.details?.message || data.message || "Login failed")
    }

    if (data.data?.session) {
      setAuthToken(data.data.session.access_token, data.data.session.expires_in)
    }

    return data
  } catch (error) {
    if (error instanceof AuthError) {
      throw error
    }
    throw new AuthError("Failed to connect to the server. Please try again later.")
  }
}

export function setAuthToken(token: string, expiresIn: number) {
  // Store token in cookies with HttpOnly flag
  document.cookie = `auth_token=${token}; path=/; max-age=${expiresIn}; secure; samesite=strict`
}

export function getAuthToken(): string | null {
  const cookies = document.cookie.split(";")
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=")
    if (name === "auth_token") {
      return value
    }
  }
  return null
}

export function removeAuthToken() {
  // Clear the auth token cookie by setting it to expire immediately
  document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict"
  console.log("Auth token cookie cleared")
}

export function isAuthenticated(): boolean {
  return getAuthToken() !== null
}

export async function logout(): Promise<void> {
  // Simply clear the auth token from cookies
  removeAuthToken()
} 