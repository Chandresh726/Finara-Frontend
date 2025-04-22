import { OnboardingFormValues } from "@/lib/validations"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export class UserError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "UserError"
  }
}

function getAuthToken(): string | null {
  const cookies = document.cookie.split(';')
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=')
    if (name === 'auth_token') {
      return value
    }
  }
  return null
}

export async function updateUserProfile(data: OnboardingFormValues): Promise<void> {
  try {
    const token = getAuthToken()
    if (!token) {
      throw new UserError("Authentication token not found. Please login again.")
    }

    const response = await fetch(`${API_URL}/user/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new UserError(errorData.details?.message || errorData.message || "Failed to update profile")
    }
  } catch (error) {
    if (error instanceof UserError) {
      throw error
    }
    throw new UserError("Failed to connect to the server. Please try again later.")
  }
} 