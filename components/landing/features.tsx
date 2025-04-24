"use client"

import { motion } from "framer-motion"
import { BarChart3, Bot, LineChart, RefreshCw, TrendingUp, Shield, Globe } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    title: "AI-Powered Portfolio Management",
    description: "Our advanced algorithms analyze market trends and optimize your portfolio for maximum returns while minimizing risks.",
    icon: <BarChart3 className="h-8 w-8 text-finance-500 dark:text-finance-400" />,
  },
  {
    title: "Real-Time Market Analysis",
    description: "Get instant insights into market movements and make informed decisions with our real-time analysis tools.",
    icon: <TrendingUp className="h-8 w-8 text-finance-500 dark:text-finance-400" />,
  },
  {
    title: "Risk Assessment",
    description: "Comprehensive risk analysis tools help you understand and manage your investment risks effectively.",
    icon: <Shield className="h-8 w-8 text-finance-500 dark:text-finance-400" />,
  },
  {
    title: "Automated Trading",
    description: "Set your investment strategy and let our AI execute trades automatically based on your preferences.",
    icon: <Bot className="h-8 w-8 text-finance-500 dark:text-finance-400" />,
  },
  {
    title: "Performance Analytics",
    description: "Detailed analytics and reporting tools to track your portfolio's performance and growth over time.",
    icon: <LineChart className="h-8 w-8 text-finance-500 dark:text-finance-400" />,
  },
  {
    title: "Global Diversification",
    description: "Access diverse investment opportunities across multiple regions and asset types, from stocks and bonds to ETFs and cryptocurrencies.",
    icon: <Globe className="h-8 w-8 text-finance-500 dark:text-finance-400" />,
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 bg-gradient-secondary">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powered by <span className="text-gradient">Advanced AI</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our platform combines cutting-edge artificial intelligence with financial expertise to provide you with the
            best investment experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full border border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
