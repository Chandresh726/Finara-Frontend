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
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { getPortfolioOverview } from "@/lib/services/portfolio"
import { OverviewSkeleton } from "@/components/skeleton/overview-skeleton"
import type { OverviewDistributionType, OverviewDistribution, OverviewData } from "@/lib/types/portfolio"

const chartConfig = {
  performance: {
    label: "Portfolio Value",
    color: "hsl(var(--chart-1))",
  },
  "Equity - US": {
    label: "US Equity",
    color: "hsl(151 55% 41.5%)",
  },
  "Equity - India": {
    label: "India Equity",
    color: "hsl(242 71% 64%)",
  },
  "Cryptocurrency": {
    label: "Cryptocurrency",
    color: "hsl(32 95% 44%)",
  },
}

export function PortfolioOverview() {
  const { selectedPortfolio } = usePortfolio()
  const [overview, setOverview] = useState<OverviewData | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!selectedPortfolio) return
    setLoading(true)
    getPortfolioOverview(selectedPortfolio.id)
      .then(setOverview)
      .finally(() => setLoading(false))
  }, [selectedPortfolio])

  if (loading) {
    return <OverviewSkeleton />
  }
  if (!overview) {
    return <div>No portfolio data available</div>
  }

  // Transform distribution data for pie chart
  const allocationData = Object.entries(overview.distribution.investmentType)
    .filter(([type]) => type in chartConfig) // Only include supported types
    .map(([type, data]) => ({
      id: type,
      name: chartConfig[type as keyof typeof chartConfig]?.label || type,
      value: (data as { percentage: number }).percentage,
      amount: `$${(data as { marketValue: number }).marketValue.toLocaleString()}`
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
  const hasAllocationData = allocationData.some(item => item.value > 0)

  const EmptyChartState = ({ title }: { title: string }) => (
    <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
      <BarChart3 className="h-12 w-12 mb-4" />
      <p className="text-sm text-center">Not enough historical data to display {title}.</p>
      <p className="text-xs text-center mt-2">Continue making investments to see your portfolio analytics.</p>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(overview.totalValue)}</div>
            {overview.monthlyChangePercentage !== undefined && (
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
            )}
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
            {overview.performance && overview.performance.history && overview.performance.history.length > 1 ? (
              <div className="w-full">
                <ChartContainer config={chartConfig}>
                  <LineChart data={overview.performance.history.map((h: any) => ({
                    date: new Date(h.timestamp).toLocaleDateString(),
                    value: h.totalValue,
                    profitLoss: h.profitLoss,
                    profitLossPercentage: h.profitLossPercentage,
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="date"
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
                          const d = payload[0].payload;
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                              <div className="grid gap-2">
                                <div className="flex flex-col">
                                  <span className="text-[0.70rem] uppercase text-muted-foreground">
                                    {d.date}
                                  </span>
                                  <span className="font-bold">
                                    {formatCurrency(d.value)}
                                  </span>
                                  <span className={`text-sm ${d.profitLossPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>{formatPercentage(d.profitLossPercentage)}</span>
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
                      dot={{ r: 4, fill: "hsl(var(--chart-1))" }}
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
                            fill={chartConfig[entry.id as keyof typeof chartConfig]?.color}
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
              <EmptyChartState title={allocationData.length === 1 ? "allocation chart (only one asset type, chart not meaningful)" : "allocation chart"} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}