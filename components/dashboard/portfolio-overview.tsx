"use client"

import { use } from "react"
import { ArrowDown, ArrowUp, BarChart3, DollarSign, LineChart, PieChart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Simulate fetching portfolio data
async function getPortfolioData() {
  // In a real app, this would be an API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    totalValue: "$45,231.89",
    totalChange: "+20.1%",
    dailyValue: "+$892.40",
    dailyChange: "+2.3%",
    monthlyValue: "+$7,644.12",
    monthlyChange: "+16.8%",
    riskLevel: "Moderate",
  }
}

// Simulate fetching transactions
async function getTransactions() {
  await new Promise((resolve) => setTimeout(resolve, 300))

  return [
    {
      name: "Apple Inc.",
      symbol: "AAPL",
      type: "Buy",
      amount: "$2,500.00",
      date: "Today, 10:30 AM",
      change: "+1.2%",
      isPositive: true,
    },
    {
      name: "Tesla Inc.",
      symbol: "TSLA",
      type: "Sell",
      amount: "$1,800.00",
      date: "Yesterday, 3:15 PM",
      change: "-0.8%",
      isPositive: false,
    },
    {
      name: "Microsoft Corp.",
      symbol: "MSFT",
      type: "Buy",
      amount: "$3,200.00",
      date: "Jul 15, 2023",
      change: "+2.3%",
      isPositive: true,
    },
  ]
}

// Simulate fetching recommendations
async function getRecommendations() {
  await new Promise((resolve) => setTimeout(resolve, 200))

  return [
    {
      title: "Diversify Tech Holdings",
      description: "Your tech allocation is high. Consider diversifying into other sectors.",
      action: "View Suggestions",
    },
    {
      title: "Rebalance Portfolio",
      description: "Your portfolio has drifted from target allocation. Consider rebalancing.",
      action: "Rebalance Now",
    },
    {
      title: "Tax-Loss Harvesting",
      description: "Opportunity to harvest losses in your energy sector investments.",
      action: "Learn More",
    },
  ]
}

// Create promises for data
const portfolioDataPromise = getPortfolioData()
const transactionsPromise = getTransactions()
const recommendationsPromise = getRecommendations()

export function PortfolioOverview() {
  // Use React 19's `use` hook to handle promises
  const portfolioData = use(portfolioDataPromise)
  const transactions = use(transactionsPromise)
  const recommendations = use(recommendationsPromise)

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolioData.totalValue}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 font-medium flex items-center">
                <ArrowUp className="mr-1 h-3 w-3" />
                {portfolioData.totalChange}
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Change</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolioData.dailyValue}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 font-medium flex items-center">
                <ArrowUp className="mr-1 h-3 w-3" />
                {portfolioData.dailyChange}
              </span>{" "}
              from yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Return</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolioData.monthlyValue}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 font-medium flex items-center">
                <ArrowUp className="mr-1 h-3 w-3" />
                {portfolioData.monthlyChange}
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolioData.riskLevel}</div>
            <p className="text-xs text-muted-foreground">Based on your preferences</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Portfolio Performance</CardTitle>
                <CardDescription>Your portfolio performance over time</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px] w-full bg-muted rounded-md flex items-center justify-center">
                  <div className="text-center">
                    <LineChart className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Performance Chart</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Asset Allocation</CardTitle>
                <CardDescription>Current distribution of your assets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full bg-muted rounded-md flex items-center justify-center">
                  <div className="text-center">
                    <PieChart className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Allocation Chart</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your recent investment activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((transaction, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="rounded-full w-10 h-10 bg-muted flex items-center justify-center">
                          {transaction.symbol.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{transaction.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {transaction.type} • {transaction.date}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{transaction.amount}</p>
                        <p
                          className={`text-xs ${
                            transaction.isPositive ? "text-green-500" : "text-red-500"
                          } flex items-center justify-end`}
                        >
                          {transaction.isPositive ? (
                            <ArrowUp className="mr-1 h-3 w-3" />
                          ) : (
                            <ArrowDown className="mr-1 h-3 w-3" />
                          )}
                          {transaction.change}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>AI Recommendations</CardTitle>
                <CardDescription>Personalized investment suggestions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendations.map((recommendation, i) => (
                    <div key={i} className="space-y-2">
                      <h4 className="text-sm font-medium">{recommendation.title}</h4>
                      <p className="text-xs text-muted-foreground">{recommendation.description}</p>
                      <button className="text-xs text-finance-500 dark:text-finance-400 font-medium">
                        {recommendation.action}
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="assets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Assets</CardTitle>
              <CardDescription>A detailed breakdown of your investment assets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full bg-muted rounded-md flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Assets Breakdown</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analysis</CardTitle>
              <CardDescription>Detailed analysis of your portfolio performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full bg-muted rounded-md flex items-center justify-center">
                <div className="text-center">
                  <LineChart className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Performance Analysis</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Complete history of your investment transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full bg-muted rounded-md flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Transaction History</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
