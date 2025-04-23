"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getAuthToken, isAuthenticated, logout as authLogout } from "@/lib/services/auth"
import { useToast } from "@/components/ui/use-toast"
import { AuthContextType, AuthError } from "@/lib/types/auth"
import { PROTECTED_ROUTES, ROUTES } from "@/lib/constants/routes"

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  logout: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  useEffect(() => {
    const checkAuth = () => {
      const token = getAuthToken()
      setIsAuthenticated(!!token)
      setIsLoading(false)
      
      if (!token && PROTECTED_ROUTES.some(route => pathname?.startsWith(route))) {
        router.push(ROUTES.LOGIN)
      }
    }

    checkAuth()
  }, [router, pathname])

  const handleLogout = async () => {
    try {
      await authLogout()
      setIsAuthenticated(false)
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      })
      router.push(ROUTES.LOGIN)
    } catch (error) {
      const authError = error as AuthError
      toast({
        variant: "destructive",
        title: "Error",
        description: authError.message || "Failed to logout. Please try again.",
      })
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
} 