import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RiskProfile, InvestmentType, Region } from "@/lib/constants/enums"

export default function ProfileSlide2({ watch, setValue }: any) {
  // Define enabled investment types and regions
  const enabledInvestmentTypes = [InvestmentType.Equity, InvestmentType.Cryptocurrency]
  const enabledRegions = [Region.US, Region.India, Region.Global]

  return (
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
            {Object.values(RiskProfile).map((profile) => (
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
      
      <div className="space-y-4">
        <Label>Preferred Investment Options</Label>
        <div className="flex flex-wrap gap-2">
          {Object.values(InvestmentType).map((type) => {
            const isEnabled = enabledInvestmentTypes.includes(type)
            return (
              <Button
                key={type}
                type="button"
                variant="outline"
                disabled={!isEnabled}
                className={`h-10 px-4 text-xs rounded-full transition-all duration-300 ${
                  watch("preferredInvestmentTypes")?.includes(type)
                    ? "bg-blue-500 text-white hover:bg-blue-600 border-blue-500"
                    : isEnabled 
                      ? "hover:bg-muted" 
                      : "opacity-50 cursor-not-allowed"
                }`}
                onClick={() => {
                  if (!isEnabled) return
                  const currentTypes = watch("preferredInvestmentTypes") || []
                  if (currentTypes.includes(type)) {
                    setValue(
                      "preferredInvestmentTypes",
                      currentTypes.filter((t: string) => t !== type)
                    )
                  } else {
                    setValue("preferredInvestmentTypes", [...currentTypes, type])
                  }
                }}
              >
                {type}
              </Button>
            )
          })}
        </div>
      </div>
      
      <div className="space-y-4">
        <Label>Preferred Investment Regions</Label>
        <div className="flex flex-wrap gap-2">
          {Object.values(Region).map((region) => {
            const isEnabled = enabledRegions.includes(region)
            return (
              <Button
                key={region}
                type="button"
                variant="outline"
                disabled={!isEnabled}
                className={`h-10 px-4 text-xs rounded-full transition-all duration-300 ${
                  watch("preferredRegions")?.includes(region)
                    ? "bg-blue-500 text-white hover:bg-blue-600 border-blue-500"
                    : isEnabled 
                      ? "hover:bg-muted" 
                      : "opacity-50 cursor-not-allowed"
                }`}
                onClick={() => {
                  if (!isEnabled) return
                  const currentRegions = watch("preferredRegions") || []
                  if (currentRegions.includes(region)) {
                    setValue(
                      "preferredRegions",
                      currentRegions.filter((r: string) => r !== region)
                    )
                  } else {
                    setValue("preferredRegions", [...currentRegions, region])
                  }
                }}
              >
                {region}
              </Button>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
} 