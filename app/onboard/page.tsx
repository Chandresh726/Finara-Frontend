"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, ArrowRight, ArrowLeft, BarChart3, Circle } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { onboardingSchema, type OnboardingFormValues, RiskProfile, InvestmentType, Region } from "@/lib/validations"
import { updateUserProfile, UserError } from "@/lib/services/user"

export default function OnboardingPage() {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    trigger,
  } = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    mode: "onChange",
  })

  // Watch form 1 fields for validation
  const firstName = watch("firstName")
  const lastName = watch("lastName")
  const age = watch("age")
  const income = watch("income")
  const occupation = watch("occupation")
  const country = watch("country")

  const isForm1Valid = Boolean(firstName && lastName && age && income && occupation && country)

  const handleCountryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setValue("country", value)
    if (value) {
      trigger("country")
    }
  }

  const onSubmit = async (data: OnboardingFormValues) => {
    setIsLoading(true)
    try {
      await updateUserProfile(data)
      toast({
        title: "Profile updated successfully",
        description: "Redirecting to dashboard...",
      })
      router.push("/dashboard")
    } catch (error) {
      if (error instanceof UserError) {
        toast({
          variant: "destructive",
          title: "Error",
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

  const nextSlide = () => {
    setCurrentSlide(2)
  }

  const prevSlide = () => {
    setCurrentSlide(1)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-muted/20">
      <div className="absolute top-4 right-4 flex items-center gap-4">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-2xl space-y-8">
        <div className="flex items-center gap-2 absolute top-4 left-4">
          <Link href="/" className="flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-finance-500 dark:text-finance-400" />
            <span className="font-bold text-2xl">Finara</span>
          </Link>
        </div>

        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Complete Your Profile</CardTitle>
            <CardDescription>Help us understand your investment preferences</CardDescription>
          </CardHeader>

          {/* Progress Indicator */}
          <div className="flex justify-center gap-2 px-4">
            {[1, 2].map((slide) => (
              <Circle
                key={slide}
                className={`h-2 w-2 ${
                  currentSlide === slide
                    ? "text-finance-500 fill-finance-500"
                    : "text-muted-foreground"
                }`}
              />
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-6 pt-6">
              <AnimatePresence mode="wait">
                {currentSlide === 1 ? (
                  <motion.div
                    key="slide1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input 
                          id="firstName" 
                          {...register("firstName")} 
                          className="bg-background/50"
                        />
                        {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName" 
                          {...register("lastName")} 
                          className="bg-background/50"
                        />
                        {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="age">Age</Label>
                        <Input
                          id="age"
                          type="number"
                          {...register("age", { valueAsNumber: true })}
                          className="bg-background/50"
                        />
                        {errors.age && <p className="text-sm text-destructive">{errors.age.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="income">Annual Income ($)</Label>
                        <Input
                          id="income"
                          type="number"
                          {...register("income", { valueAsNumber: true })}
                          className="bg-background/50"
                        />
                        {errors.income && <p className="text-sm text-destructive">{errors.income.message}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="occupation">Occupation</Label>
                      <Input 
                        id="occupation" 
                        {...register("occupation")} 
                        className="bg-background/50"
                      />
                      {errors.occupation && <p className="text-sm text-destructive">{errors.occupation.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input 
                        id="country" 
                        {...register("country")} 
                        className="bg-background/50"
                        onChange={handleCountryChange}
                      />
                      {errors.country && country && <p className="text-sm text-destructive">{errors.country.message}</p>}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="slide2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <Label>Risk Profile</Label>
                      <div className="relative h-12 rounded-md overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 opacity-10" />
                        <div className="relative flex h-full">
                          {Object.values(RiskProfile).map((profile, index) => (
                            <Button
                              key={profile}
                              type="button"
                              variant="ghost"
                              className={`flex-1 h-full rounded-none border-0 transition-all duration-300 ${
                                watch("riskProfile") === profile
                                  ? "bg-blue-500/90 text-white shadow-lg"
                                  : "hover:bg-background/20"
                              }`}
                              onClick={() => setValue("riskProfile", profile)}
                            >
                              {profile}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-4">
                        <Label>Preferred Investment Options</Label>
                        <div className="flex flex-wrap gap-2">
                          {Object.values(InvestmentType).map((type) => (
                            <Button
                              key={type}
                              type="button"
                              variant="outline"
                              className={`h-10 px-4 text-xs rounded-full transition-all duration-300 ${
                                watch("preferredInvestmentTypes")?.includes(type)
                                  ? "bg-blue-500 text-white hover:bg-blue-600 border-blue-500"
                                  : "hover:bg-muted"
                              }`}
                              onClick={() => {
                                const currentTypes = watch("preferredInvestmentTypes") || []
                                if (currentTypes.includes(type)) {
                                  setValue(
                                    "preferredInvestmentTypes",
                                    currentTypes.filter((t) => t !== type)
                                  )
                                } else {
                                  setValue("preferredInvestmentTypes", [...currentTypes, type])
                                }
                              }}
                            >
                              {type}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Label>Preferred Investment Regions</Label>
                        <div className="flex flex-wrap gap-2">
                          {Object.values(Region).map((region) => (
                            <Button
                              key={region}
                              type="button"
                              variant="outline"
                              className={`h-10 px-4 text-xs rounded-full transition-all duration-300 ${
                                watch("preferredRegions")?.includes(region)
                                  ? "bg-blue-500 text-white hover:bg-blue-600 border-blue-500"
                                  : "hover:bg-muted"
                              }`}
                              onClick={() => {
                                const currentRegions = watch("preferredRegions") || []
                                if (currentRegions.includes(region)) {
                                  setValue(
                                    "preferredRegions",
                                    currentRegions.filter((r) => r !== region)
                                  )
                                } else {
                                  setValue("preferredRegions", [...currentRegions, region])
                                }
                              }}
                            >
                              {region}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
            <CardFooter className="flex justify-between">
              {currentSlide === 2 && (
                <Button type="button" variant="outline" onClick={prevSlide}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              )}
              {currentSlide === 1 ? (
                <Button 
                  type="button" 
                  onClick={nextSlide} 
                  className="ml-auto"
                  disabled={!isForm1Valid}
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" className="ml-auto" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Complete Profile"
                  )}
                </Button>
              )}
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
} 