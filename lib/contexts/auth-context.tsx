"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getAuthToken, isAuthenticated, logout as authLogout } from "@/lib/services/auth"
import { useToast } from "@/components/ui/use-toast"

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  logout: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const checkAuth = () => {
      const token = getAuthToken()
      setIsAuthenticated(!!token)
      setIsLoading(false)
      
      // Redirect to login if not authenticated
      if (!token) {
        router.push("/login")
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = async () => {
    try {
      console.log("Starting logout process...")
      await authLogout()
      console.log("Auth token cleared")
      setIsAuthenticated(false)
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      })
      console.log("Redirecting to login page...")
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to logout. Please try again.",
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