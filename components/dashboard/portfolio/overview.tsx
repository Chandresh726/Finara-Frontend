"use client"

import { use } from "react"
import { ArrowUp, BarChart3, DollarSign} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Line,
  LineChart,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"

const performanceData = [
  { name: 'Jan 2024', value: 42000, growth: '+2.5%' },
  { name: 'Feb 2024', value: 44500, growth: '+5.9%' },
  { name: 'Mar 2024', value: 43800, growth: '-1.6%' },
  { name: 'Apr 2024', value: 46200, growth: '+5.5%' },
  { name: 'May 2024', value: 48100, growth: '+4.1%' },
  { name: 'Jun 2024', value: 52000, growth: '+8.1%' },
]

type ChartConfigKey = keyof typeof chartConfig;

const allocationData = [
  { id: 'stocks-us' as ChartConfigKey, name: 'US Stocks', value: 45, amount: '$20,354.35' },
  { id: 'stocks-india' as ChartConfigKey, name: 'India Stocks', value: 25, amount: '$11,307.97' },
  { id: 'cryptocurrency' as ChartConfigKey, name: 'Cryptocurrency', value: 20, amount: '$9,046.38' },
  { id: 'cash' as ChartConfigKey, name: 'Cash', value: 10, amount: '$4,523.19' },
]

const recentTransactions = [
  { type: 'Buy', asset: 'AAPL', amount: '$2,450.00', date: '2024-03-15', change: '+2.3%' },
  { type: 'Sell', asset: 'BTC', amount: '$1,200.00', date: '2024-03-14', change: '-1.5%' },
  { type: 'Buy', asset: 'GOOGL', amount: '$3,100.00', date: '2024-03-13', change: '+1.8%' },
  { type: 'Buy', asset: 'ETH', amount: '$900.00', date: '2024-03-12', change: '+3.2%' },
]

const categoryStats = [
  { category: 'Stocks', allocation: '70%', value: '$31,662.32', change: '+15.3%' },
  { category: 'Cryptocurrency', allocation: '20%', value: '$9,046.38', change: '+25.7%' },
  { category: 'Cash', allocation: '10%', value: '$4,523.19', change: '0%' },
]

const chartConfig = {
  performance: {
    label: "Portfolio Value",
    color: "hsl(var(--chart-1))",
  },
  "stocks-us": {
    label: "US Stocks",
    color: "hsl(151 55% 41.5%)",
  },
  "stocks-india": {
    label: "India Stocks",
    color: "hsl(242 71% 64%)",
  },
  "cryptocurrency": {
    label: "Crypto",
    color: "hsl(32 95% 44%)",
  },
  "cash": {
    label: "Cash",
    color: "hsl(339 90% 51%)",
  },
}

const portfolioDataPromise = Promise.resolve({
  totalValue: "$45,231.89",
  totalChange: "+20.1%",
  dailyValue: "+$892.40",
  dailyChange: "+2.3%",
  monthlyValue: "+$7,644.12",
  monthlyChange: "+16.8%",
  riskLevel: "Moderate",
})

export function PortfolioOverview() {
  const portfolioData = use(portfolioDataPromise)

  return (
    <div className="space-y-6">
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
            <p className="text-xs text-muted-foreground">Based on your portfolio</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Portfolio Performance</CardTitle>
            <CardDescription>6-month portfolio value trend showing monthly growth rates</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="w-full">
              <ChartContainer config={chartConfig}>
                <LineChart accessibilityLayer data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    fontSize={12}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    fontSize={12}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                  />
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <div className="grid gap-2">
                              <div className="flex flex-col">
                                <span className="text-[0.70rem] uppercase text-muted-foreground">
                                  {payload[0].payload.name}
                                </span>
                                <span className="font-bold">
                                  ${payload[0]?.value?.toLocaleString() ?? 0}
                                </span>
                                <span className={`text-sm ${payload[0]?.payload?.growth?.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                                  {payload[0]?.payload?.growth}
                                </span>
                              </div>
                            </div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Asset Allocation</CardTitle>
            <CardDescription>Current portfolio distribution across asset classes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full">
              <ChartContainer config={chartConfig}>
                <PieChart accessibilityLayer>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    innerRadius={70}
                    dataKey="value"
                    nameKey="id"
                    paddingAngle={2}
                  >
                    {allocationData.map((entry) => (
                      <Cell
                        key={entry.id}
                        fill={chartConfig[entry.id].color}
                        stroke="transparent"
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4">
              {allocationData.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <div 
                    className="h-3 w-3 rounded-full" 
                    style={{ backgroundColor: chartConfig[item.id].color }}
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="text-xs text-muted-foreground">{item.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Asset Category Stats</CardTitle>
            <CardDescription>Breakdown by asset category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryStats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">{stat.category}</p>
                    <p className="text-sm text-muted-foreground">Allocation: {stat.allocation}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{stat.value}</p>
                    <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                      {stat.change}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest portfolio activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">{transaction.asset}</p>
                    <p className="text-sm text-muted-foreground">{transaction.type} • {transaction.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{transaction.amount}</p>
                    <p className={`text-sm ${transaction.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                      {transaction.change}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}