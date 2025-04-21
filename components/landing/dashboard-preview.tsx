"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"

export function DashboardPreview() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Your <span className="text-gradient">Financial Dashboard</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get a comprehensive view of your investments with our intuitive dashboard. Track performance, analyze
            trends, and make informed decisions.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative mx-auto max-w-5xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-finance-400/20 to-purple-400/20 rounded-xl blur-3xl" />

          <Card className="overflow-hidden border border-border/50 bg-card/80 backdrop-blur-sm shadow-xl">
            <div className="aspect-[16/9] bg-muted rounded-t-lg overflow-hidden">
              {/* Dashboard mockup image would go here */}
              <div className="w-full h-full bg-gradient-to-br from-finance-900/10 to-purple-900/10 dark:from-finance-400/10 dark:to-purple-400/10 flex items-center justify-center">
                <div className="grid grid-cols-3 gap-4 p-8 w-full">
                  <div className="col-span-2 space-y-4">
                    <div className="h-8 bg-finance-200 dark:bg-finance-700 rounded-md w-1/3 animate-pulse-slow" />
                    <div className="h-40 bg-finance-100 dark:bg-finance-800 rounded-lg animate-pulse-slow" />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-24 bg-finance-100 dark:bg-finance-800 rounded-lg animate-pulse-slow" />
                      <div className="h-24 bg-finance-100 dark:bg-finance-800 rounded-lg animate-pulse-slow" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-8 bg-finance-200 dark:bg-finance-700 rounded-md w-2/3 animate-pulse-slow" />
                    <div className="h-24 bg-finance-100 dark:bg-finance-800 rounded-lg animate-pulse-slow" />
                    <div className="h-40 bg-finance-100 dark:bg-finance-800 rounded-lg animate-pulse-slow" />
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold">Portfolio Overview</h3>
                <p className="text-muted-foreground">Real-time analytics and insights</p>
              </div>
              <motion.div
                className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center">
                  <div className="h-6 w-6 rounded-full bg-gradient-primary" />
                </div>
              </motion.div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
