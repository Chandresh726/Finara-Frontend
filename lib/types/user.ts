export interface UserResponse {
  success: boolean
  message?: string
  details?: {
    message: string
  }
}

export class UserError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "UserError"
  }
} 