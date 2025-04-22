export interface SignUpRequest {
  email: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface UserMetadata {
  email: string
  email_verified: boolean
  phone_verified: boolean
  sub: string
}

export interface AppMetadata {
  provider: string
  providers: string[]
}

export interface Identity {
  identity_id: string
  id: string
  user_id: string
  identity_data: {
    email: string
    email_verified: boolean
    phone_verified: boolean
    sub: string
  }
  provider: string
  last_sign_in_at: string
  created_at: string
  updated_at: string
  email: string
}

export interface User {
  id: string
  email: string
  email_verified: boolean
  user_metadata: {
    email: string
    email_verified: boolean
    phone_verified: boolean
    sub: string
  }
}

export interface Session {
  access_token: string
  token_type: string
  expires_in: number
  expires_at: number
  refresh_token: string
  user: User
}

export interface AuthResponse {
  success: boolean
  message?: string
  code?: string
  details?: {
    message: string
  }
  data?: {
    user?: User
    session?: Session
    onboard?: boolean
  }
} 