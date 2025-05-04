export interface UserResponse {
  success: boolean
  message?: string
  details?: {
    message: string
  }
  data?: {
    id: string
    email: string
    firstName: string
    lastName: string
    occupation: string
    age: number
    income: number
    riskProfile: string
    preferredInvestmentTypes: string[]
    preferredRegions: string[]
    country: string
    createdAt: string
    updatedAt: string
  }
}

export class UserError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "UserError"
  }
} 