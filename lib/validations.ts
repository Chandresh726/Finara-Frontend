import * as z from "zod"
import { RiskProfile, InvestmentType, Region } from "@/lib/constants/enums"

export const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
})

export const signupSchema = z
  .object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
      .regex(/[0-9]/, { message: "Password should contain at least one number" })
      .regex(/[^A-Za-z0-9]/, { message: "Password should contain at least one special character" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type LoginFormValues = z.infer<typeof loginSchema>
export type SignupFormValues = z.infer<typeof signupSchema>

export const onboardingSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  age: z.number().min(18, "You must be at least 18 years old").max(100, "Please enter a valid age"),
  income: z.number().min(0, "Income must be a positive number"),
  occupation: z.string().min(2, "Occupation must be at least 2 characters"),
  riskProfile: z.nativeEnum(RiskProfile),
  country: z.string().min(2, "Country must be at least 2 characters"),
  preferredInvestmentTypes: z.array(z.nativeEnum(InvestmentType)).min(1, "Select at least one investment type"),
  preferredRegions: z.array(z.nativeEnum(Region)).min(1, "Select at least one region"),
})

export type OnboardingFormValues = z.infer<typeof onboardingSchema>
