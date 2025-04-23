import { OnboardingFormValues } from "@/lib/validations"
import { apiRequest, ApiError } from "./api-client"
import { UserResponse, UserError } from "@/lib/types/user"

export async function updateUserProfile(data: OnboardingFormValues): Promise<UserResponse> {
  try {
    const response = await apiRequest<UserResponse>("/user/profile", {
      method: "POST",
      body: JSON.stringify(data),
    })
    return response
  } catch (error) {
    if (error instanceof ApiError) {
      throw new UserError(error.message)
    }
    throw new UserError("Failed to connect to the server. Please try again later.")
  }
} 