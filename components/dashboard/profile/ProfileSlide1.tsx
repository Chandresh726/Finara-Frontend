import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ProfileSlide1({ register, errors, watch, setValue, trigger }: any) {
  const firstName = watch("firstName")
  const lastName = watch("lastName")
  const age = watch("age")
  const income = watch("income")
  const occupation = watch("occupation")
  const country = watch("country")

  const handleCountryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setValue("country", value)
    if (value) {
      trigger("country")
    }
  }

  return (
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
  )
} 