"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

const pricingPlans = [
  {
    name: "Starter",
    price: "$0",
    description: "Perfect for beginners and individual investors",
    features: [
      "AI-powered portfolio suggestions",
      "Basic market insights",
      "Up to 3 investment portfolios",
      "Email support",
      "Mobile app access",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$49",
    description: "For serious investors who want more control",
    features: [
      "Everything in Starter",
      "Advanced AI trading signals",
      "Unlimited portfolios",
      "Real-time market data",
      "Priority support",
      "Tax optimization",
    ],
    cta: "Go Pro",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$199",
    description: "For professional traders and institutions",
    features: [
      "Everything in Pro",
      "Custom AI models",
      "API access",
      "Dedicated account manager",
      "Custom reporting",
      "White-label options",
      "Advanced security features",
    ],
    cta: "Contact Sales",
    popular: false,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-gradient">Pricing Plans</span> for Every Investor
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your investment strategy and goals. All plans include our core AI-powered
            features.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex h-full"
            >
              <Card
                className={`flex flex-col h-full w-full border border-border/50 ${
                  plan.popular
                    ? "relative shadow-lg shadow-finance-500/10 dark:shadow-finance-400/10 scale-105 lg:scale-110 z-10"
                    : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-0 right-0 flex justify-center">
                    <span className="bg-finance-500 text-white text-xs font-semibold px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg sm:text-xl">{plan.name}</CardTitle>
                  <div className="flex items-baseline mt-2">
                    <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold">{plan.price}</span>
                    <span className="ml-1 text-muted-foreground text-sm">/month</span>
                  </div>
                  <CardDescription className="mt-2 text-sm sm:text-base">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow pb-4">
                  <ul className="space-y-2 sm:space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <Check className="h-4 w-4 sm:h-5 sm:w-5 text-finance-500 dark:text-finance-400 mr-2 shrink-0 mt-0.5" />
                        <span className="text-sm sm:text-base">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pt-4">
                  <Link href="/signup" className="w-full">
                    <Button
                      className={`w-full ${
                        plan.popular
                          ? "bg-gradient-primary hover:opacity-90 transition-opacity"
                          : "bg-secondary hover:bg-secondary/80"
                      }`}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
