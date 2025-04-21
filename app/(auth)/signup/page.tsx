"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { Check, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signupSchema, type SignupFormValues } from "@/lib/validations"

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const totalSteps = 2

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  })

  const nextStep = async () => {
    const isValid = await trigger(["name", "email"])
    if (isValid) setStep(2)
  }

  const prevStep = () => {
    setStep(1)
  }

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    console.log(data)
    setIsLoading(false)

    // Here you would normally redirect to dashboard
  }

  return (
    <div className="w-full max-w-md">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 w-8 rounded-full ${
                      i + 1 === step
                        ? "bg-finance-500 dark:bg-finance-400"
                        : i + 1 < step
                          ? "bg-finance-300 dark:bg-finance-600"
                          : "bg-muted"
                    }`}
                  />
                ))}
              </div>
            </div>
            <CardDescription>
              {step === 1
                ? "Enter your information to create an account"
                : "Set up your password to secure your account"}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              {step === 1 ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      {...register("name")}
                      className={errors.name ? "border-destructive" : ""}
                    />
                    {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      {...register("email")}
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      {...register("password")}
                      className={errors.password ? "border-destructive" : ""}
                    />
                    {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...register("confirmPassword")}
                      className={errors.confirmPassword ? "border-destructive" : ""}
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Password strength:</p>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`h-1 flex-1 rounded-full ${watch("password")?.length >= 8 ? "bg-green-500" : "bg-muted"}`}
                        />
                        <div
                          className={`h-1 flex-1 rounded-full ${/[A-Z]/.test(watch("password") || "") ? "bg-green-500" : "bg-muted"}`}
                        />
                        <div
                          className={`h-1 flex-1 rounded-full ${/[0-9]/.test(watch("password") || "") ? "bg-green-500" : "bg-muted"}`}
                        />
                        <div
                          className={`h-1 flex-1 rounded-full ${/[^A-Za-z0-9]/.test(watch("password") || "") ? "bg-green-500" : "bg-muted"}`}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center">
                          <Check
                            className={`mr-1 h-3 w-3 ${watch("password")?.length >= 8 ? "text-green-500" : "text-muted-foreground"}`}
                          />
                          <span
                            className={watch("password")?.length >= 8 ? "text-foreground" : "text-muted-foreground"}
                          >
                            At least 8 characters
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Check
                            className={`mr-1 h-3 w-3 ${/[A-Z]/.test(watch("password") || "") ? "text-green-500" : "text-muted-foreground"}`}
                          />
                          <span
                            className={
                              /[A-Z]/.test(watch("password") || "") ? "text-foreground" : "text-muted-foreground"
                            }
                          >
                            Uppercase letter
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Check
                            className={`mr-1 h-3 w-3 ${/[0-9]/.test(watch("password") || "") ? "text-green-500" : "text-muted-foreground"}`}
                          />
                          <span
                            className={
                              /[0-9]/.test(watch("password") || "") ? "text-foreground" : "text-muted-foreground"
                            }
                          >
                            Number
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Check
                            className={`mr-1 h-3 w-3 ${/[^A-Za-z0-9]/.test(watch("password") || "") ? "text-green-500" : "text-muted-foreground"}`}
                          />
                          <span
                            className={
                              /[^A-Za-z0-9]/.test(watch("password") || "") ? "text-foreground" : "text-muted-foreground"
                            }
                          >
                            Special character
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              {step === 1 ? (
                <Button
                  type="button"
                  className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                  onClick={nextStep}
                >
                  Continue
                </Button>
              ) : (
                <div className="flex w-full space-x-2">
                  <Button type="button" variant="outline" className="flex-1" onClick={prevStep}>
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-primary hover:opacity-90 transition-opacity"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </div>
              )}
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
