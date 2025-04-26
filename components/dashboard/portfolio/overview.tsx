"use client"

import { ArrowUp, ArrowDown, BarChart3, DollarSign, PieChart as PieChartIcon } from "lucide-react"
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
import { usePortfolio } from "@/lib/contexts/portfolio-context"

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

export function PortfolioOverview() {
  const { portfolioDetails, isLoading } = usePortfolio()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!portfolioDetails) {
    return <div>No portfolio data available</div>
  }

  const { overview } = portfolioDetails

  // Transform distribution data for pie chart
  const allocationData = Object.entries(overview.distribution.investmentType).map(([type, data]) => ({
    id: type,
    name: type,
    value: data.percentage,
    amount: `$${data.marketValue.toLocaleString()}`
  }))

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }

  // Format percentage
  const formatPercentage = (value: number | null) => {
    if (value === null) return '0%'
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
  }

  // Check if we have enough data for charts
  const hasPerformanceData = overview.totalValue > 0
  const hasAllocationData = allocationData.length > 0

  const EmptyChartState = ({ title }: { title: string }) => (
    <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
      <BarChart3 className="h-12 w-12 mb-4" />
      <p>Not enough data to display {title}</p>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(overview.totalValue)}</div>
            <p className="text-xs text-muted-foreground">
              <span className={overview.monthlyChangePercentage >= 0 ? "text-green-500" : "text-red-500"}>
                {overview.monthlyChangePercentage >= 0 ? (
                  <ArrowUp className="mr-1 h-3 w-3 inline" />
                ) : (
                  <ArrowDown className="mr-1 h-3 w-3 inline" />
                )}
                {formatPercentage(overview.monthlyChangePercentage)}
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
            <div className="text-2xl font-bold">{formatCurrency(overview.dailyChange)}</div>
            <p className="text-xs text-muted-foreground">
              <span className={overview.dailyChangePercentage >= 0 ? "text-green-500" : "text-red-500"}>
                {overview.dailyChangePercentage >= 0 ? (
                  <ArrowUp className="mr-1 h-3 w-3 inline" />
                ) : (
                  <ArrowDown className="mr-1 h-3 w-3 inline" />
                )}
                {formatPercentage(overview.dailyChangePercentage)}
              </span>{" "}
              from yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit/Loss</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(overview.totalProfitLoss)}</div>
            <p className="text-xs text-muted-foreground">
              <span className={overview.totalProfitLossPercentage >= 0 ? "text-green-500" : "text-red-500"}>
                {overview.totalProfitLossPercentage >= 0 ? (
                  <ArrowUp className="mr-1 h-3 w-3 inline" />
                ) : (
                  <ArrowDown className="mr-1 h-3 w-3 inline" />
                )}
                {formatPercentage(overview.totalProfitLossPercentage)}
              </span>{" "}
              total return
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
            <PieChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(overview.totalInvested)}</div>
            <p className="text-xs text-muted-foreground">Current investment</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Portfolio Performance</CardTitle>
            <CardDescription>Portfolio value trend showing growth rates</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {hasPerformanceData ? (
            <div className="w-full">
              <ChartContainer config={chartConfig}>
                  <LineChart accessibilityLayer data={[
                    { name: 'Current', value: overview.totalValue, growth: formatPercentage(overview.totalProfitLossPercentage) }
                  ]}>
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
                      tickFormatter={(value) => formatCurrency(value)}
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
                                    {formatCurrency(Number(payload[0]?.value ?? 0))}
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
                      dot={{
                        r: 4,
                        fill: "hsl(var(--chart-1))",
                      }}
                  />
                </LineChart>
              </ChartContainer>
            </div>
            ) : (
              <EmptyChartState title="performance chart" />
            )}
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Asset Allocation</CardTitle>
            <CardDescription>Distribution across investment types</CardDescription>
          </CardHeader>
          <CardContent>
            {hasAllocationData ? (
              <div className="h-[300px]">
              <ChartContainer config={chartConfig}>
                <div>
                  <PieChart>
                  <Pie
                    data={allocationData}
                      dataKey="value"
                      nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                  >
                      {allocationData.map((entry, index) => (
                      <Cell
                          key={`cell-${index}`}
                          fill={chartConfig[entry.id as keyof typeof chartConfig]?.color || `hsl(${index * 45}, 70%, 50%)`}
                      />
                    ))}
                  </Pie>
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                              <div className="grid gap-2">
                                <div className="flex flex-col">
                                  <span className="text-[0.70rem] uppercase text-muted-foreground">
                                    {data.name}
                                  </span>
                                  <span className="font-bold">{data.amount}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {data.value.toFixed(2)}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                </PieChart>
                  <ChartLegend
                    content={({ payload }) => {
                      if (payload && payload.length) {
                        return (
                          <div className="flex flex-wrap gap-4 pt-4">
                            {allocationData.map((entry, index) => (
                              <div key={`legend-${index}`} className="flex items-center gap-2">
                  <div 
                    className="h-3 w-3 rounded-full" 
                                  style={{
                                    backgroundColor: chartConfig[entry.id as keyof typeof chartConfig]?.color || 
                                      `hsl(${index * 45}, 70%, 50%)`
                                  }}
                  />
                                <span className="text-sm">{entry.name}</span>
                </div>
              ))}
            </div>
                        )
                      }
                      return null
                    }}
                  />
                </div>
              </ChartContainer>
              </div>
            ) : (
              <EmptyChartState title="allocation chart" />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}