"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { LineChart, TrendingUp, BarChart3, Bot, Moon, User, ChevronDown, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Dummy data for the line chart
const monthlyData = [
  { month: "Jan", value: 35000 },
  { month: "Feb", value: 38000 },
  { month: "Mar", value: 37500 },
  { month: "Apr", value: 42000 },
  { month: "May", value: 44500 },
  { month: "Jun", value: 48000 },
]

// Asset allocation data
const assetAllocation = [
  { name: "US Stocks", value: 45, color: "from-finance-500 to-finance-400" },
  { name: "Int'l Stocks", value: 30, color: "from-purple-500 to-purple-400" },
  { name: "Bonds", value: 25, color: "from-orange-500 to-orange-400" },
]

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
            trends, and make informed decisions with AI-powered insights.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative mx-auto max-w-6xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-finance-400/20 to-purple-400/20 rounded-xl blur-3xl" />

          {/* Mobile view - simplified dashboard */}
          <div className="md:hidden mb-6">
            <Card className="overflow-hidden border border-border/50 bg-card/80 backdrop-blur-sm shadow-xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="h-6 w-6 text-finance-500" />
                <span className="font-bold text-xl">Finara Dashboard</span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Card className="p-4 border-border/50">
                  <h3 className="text-sm font-medium text-muted-foreground">Portfolio Value</h3>
                  <p className="text-xl font-bold mt-1">$45,231</p>
                  <div className="flex items-center gap-1 text-sm text-green-500">
                    <TrendingUp className="h-3 w-3" />
                    <span>+20.1%</span>
                  </div>
                </Card>
                <Card className="p-4 border-border/50">
                  <h3 className="text-sm font-medium text-muted-foreground">Today's Change</h3>
                  <p className="text-xl font-bold mt-1">+$892</p>
                  <div className="flex items-center gap-1 text-sm text-green-500">
                    <TrendingUp className="h-3 w-3" />
                    <span>+2.3%</span>
                  </div>
                </Card>
              </div>
              <div className="relative h-[120px] bg-gradient-to-br from-finance-500/5 to-purple-500/5 rounded-lg mb-2">
                {/* Simplified chart representation */}
              </div>
              <p className="text-center text-sm text-muted-foreground">Portfolio Performance</p>
            </Card>
          </div>
          
          {/* Desktop view - full dashboard */}
          <Card className="overflow-hidden border border-border/50 bg-card/80 backdrop-blur-sm shadow-xl hidden md:block">
            {/* Header */}
            <div className="border-b border-border/50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-6 w-6 text-finance-500" />
                  <span className="font-bold text-xl">Finara</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="min-w-[180px]">
                    Main Portfolio
                  </Button>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon">
                    <Moon className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Keep original landscape layout but make it responsive */}
            <div className="hidden md:flex">
              {/* AI Chat Sidebar */}
              <div className="w-[300px] border-r border-border/50 bg-muted/30 flex flex-col">
                <div className="p-4 border-b border-border/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bot className="h-5 w-5 text-green-500" />
                      <span className="font-medium">Finara AI</span>
                    </div>
                    <Button variant="outline" size="sm">New Chat</Button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-auto p-4 space-y-4">
                  <div className="space-y-2">
                    <div className="p-3 rounded-lg bg-card/50 text-sm">
                      Hello! How can I help you with your investments today?
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-border/50 space-y-3">
                  <Button variant="outline" size="sm" className="w-full flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4" />
                      <span className="text-sm">gemini-2-flash</span>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Type your message..." 
                      className="flex-1"
                    />
                    <Button 
                      size="icon" 
                      className="shrink-0"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 p-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <Card className="p-4 border-border/50">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Portfolio Value</h3>
                    <div className="mt-2">
                      <p className="text-2xl font-bold">$45,231.89</p>
                      <div className="flex items-center gap-1 text-sm text-green-500">
                        <TrendingUp className="h-4 w-4" />
                        <span>+20.1%</span>
                        <span className="text-muted-foreground text-xs">from last month</span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 border-border/50">
                    <h3 className="text-sm font-medium text-muted-foreground">Today's Change</h3>
                    <div className="mt-2">
                      <p className="text-2xl font-bold">+$892.40</p>
                      <div className="flex items-center gap-1 text-sm text-green-500">
                        <TrendingUp className="h-4 w-4" />
                        <span>+2.3%</span>
                        <span className="text-muted-foreground text-xs">from yesterday</span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 border-border/50">
                    <h3 className="text-sm font-medium text-muted-foreground">Monthly Return</h3>
                    <div className="mt-2">
                      <p className="text-2xl font-bold">+$7,644.12</p>
                      <div className="flex items-center gap-1 text-sm text-green-500">
                        <TrendingUp className="h-4 w-4" />
                        <span>+16.8%</span>
                        <span className="text-muted-foreground text-xs">from last month</span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 border-border/50">
                    <h3 className="text-sm font-medium text-muted-foreground">Risk Level</h3>
                    <div className="mt-2">
                      <p className="text-2xl font-bold">Moderate</p>
                      <p className="text-muted-foreground text-xs">Based on your portfolio</p>
                    </div>
                  </Card>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-3 gap-4">
                  <Card className="col-span-2 p-4 border-border/50">
                    <h3 className="text-lg font-semibold mb-2">Portfolio Performance</h3>
                    <p className="text-sm text-muted-foreground mb-4">6-month portfolio value trend</p>
                    <div className="h-[300px] relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-finance-500/5 to-purple-500/5 rounded-lg" />
                    </div>
                  </Card>

                  <Card className="p-4 border-border/50">
                    <h3 className="text-lg font-semibold mb-2">Asset Allocation</h3>
                    <p className="text-sm text-muted-foreground mb-4">Current portfolio distribution</p>
                    <div className="h-[300px] relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-finance-500/5 to-purple-500/5 rounded-lg" />
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
