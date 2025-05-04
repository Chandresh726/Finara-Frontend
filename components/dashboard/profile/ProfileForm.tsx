import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AnimatePresence } from "framer-motion"
import { Loader2, ArrowRight, ArrowLeft, BarChart3, Circle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { onboardingSchema, type OnboardingFormValues } from "@/lib/validations"
import { RiskProfile, InvestmentType, Region } from "@/lib/constants/enums"
import { updateUserProfile, getUserProfile } from "@/lib/services/user"
import { UserError } from "@/lib/types/user"
import Link from "next/link"
import { useAuth } from "@/lib/contexts/auth-context"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import ProfileSkeleton from "./ProfileSkeleton"
import ProfileSlide1 from "./ProfileSlide1"
import ProfileSlide2 from "./ProfileSlide2"


export default function ProfileForm() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [profileLoading, setProfileLoading] = useState(true)
  const [hasProfile, setHasProfile] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
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

  useEffect(() => {
    if (!isAuthenticated) return
    async function fetchProfile() {
      setProfileLoading(true)
      try {
        const response = await getUserProfile()
        if (response.success && response.data) {
          const data = response.data
          setValue("firstName", data.firstName)
          setValue("lastName", data.lastName)
          setValue("age", data.age)
          setValue("income", data.income)
          setValue("occupation", data.occupation)
          setValue("country", data.country)
          setValue("riskProfile", data.riskProfile as RiskProfile)
          setValue(
            "preferredInvestmentTypes",
            (data.preferredInvestmentTypes || []).filter((type): type is InvestmentType => Object.values(InvestmentType).includes(type as InvestmentType))
          )
          setValue(
            "preferredRegions",
            (data.preferredRegions || []).filter((region): region is Region => Object.values(Region).includes(region as Region))
          )
          setHasProfile(!!data.firstName)
        } else {
          setHasProfile(false)
        }
      } catch (error) {
        // Optionally show a toast or ignore if no profile exists
        setHasProfile(false)
      } finally {
        setProfileLoading(false)
      }
    }
    fetchProfile()
  }, [isAuthenticated, setValue])

  const onSubmit = async (data: OnboardingFormValues) => {
    setIsLoading(true)
    try {
      const response = await updateUserProfile(data)
      if (response.success) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully",
        })
        router.push("/dashboard")
      } else {
        toast({
          variant: "destructive",
          title: "Update Failed",
          description: response.details?.message || "Failed to update profile",
        })
      }
    } catch (error) {
      if (error instanceof UserError) {
        toast({
          variant: "destructive",
          title: "Update Failed",
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

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!isAuthenticated) {
    // Show loader as dashboard page (not skeleton, as user is not logged in)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (profileLoading) {
    return <ProfileSkeleton />
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
            <CardTitle className="text-2xl font-bold">{hasProfile ? "Update Your Profile" : "Complete Your Profile"}</CardTitle>
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
          <form
            onKeyDown={e => {
              if (currentSlide === 1 && e.key === 'Enter') {
                e.preventDefault();
              }
            }}
          >
            <CardContent className="space-y-6 pt-6">
              <AnimatePresence mode="wait">
                {currentSlide === 1 ? (
                  <ProfileSlide1 register={register} errors={errors} watch={watch} setValue={setValue} trigger={trigger} />
                ) : (
                  <ProfileSlide2 watch={watch} setValue={setValue} />
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
                <Button type="button" className="ml-auto" disabled={isLoading} onClick={handleSubmit(onSubmit)}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    hasProfile ? "Update Profile" : "Complete Profile"
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