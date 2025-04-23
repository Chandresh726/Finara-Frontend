export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  ONBOARD: '/onboard',
} as const

export const PROTECTED_ROUTES = [ROUTES.DASHBOARD, ROUTES.ONBOARD] as const 