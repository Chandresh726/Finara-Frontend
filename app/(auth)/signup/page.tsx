"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { Check, Loader2, Mail, Lock } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signupSchema, type SignupFormValues } from "@/lib/validations"
import { register } from "@/lib/services/auth"
import { useToast } from "@/components/ui/use-toast"
import { AuthError, AuthRequest } from "@/lib/types/auth"
import { useAuth } from "@/lib/contexts/auth-context"

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [email, setEmail] = useState("")
  const { toast } = useToast()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()

  const {
    register: registerForm,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  })

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace("/dashboard")
    }
  }, [authLoading, isAuthenticated, router])

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true)
    setEmail(data.email)

    try {
      const credentials: AuthRequest = {
        email: data.email,
        password: data.password,
      }
      const response = await register(credentials)

      if (response.success) {
        setIsSuccess(true)
        toast({
          title: "Registration successful",
          description: "Please check your email to verify your account",
        })
      } else {
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: response.details?.message || "Failed to create account",
        })
      }
    } catch (error) {
      if (error instanceof AuthError) {
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: error.message,
        })
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading || isAuthenticated) {
    return null // or a spinner if you want
  }

  if (isSuccess) {
    return (
      <div className="w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-center">
                <div className="rounded-full bg-finance-100 dark:bg-finance-900 p-3">
                  <Check className="h-6 w-6 text-finance-600 dark:text-finance-400" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center">Check your email</CardTitle>
              <CardDescription className="text-center">
                We've sent a verification link to {email}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <Button asChild variant="link">
                <Link href="/login">Go to login</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
            <CardDescription>Enter your email and password to get started</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                    {...registerForm("email")}
                  />
                </div>
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    className={`pl-10 ${errors.password ? "border-destructive" : ""}`}
                    {...registerForm("password")}
                  />
                </div>
                {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Input
                    id="confirmPassword"
                    type="password"
                    className={`pl-10 ${errors.confirmPassword ? "border-destructive" : ""}`}
                    {...registerForm("confirmPassword")}
                  />
                </div>
                {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-finance-500 dark:text-finance-400 hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}
