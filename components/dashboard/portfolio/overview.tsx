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
  ResponsiveContainer,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartLegend } from "@/components/ui/chart"
import { usePortfolio } from "@/lib/contexts/portfolio-context"
import { OverviewSkeleton } from "@/components/skeleton/overview-skeleton"

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
  "Equity": {
    label: "Equity",
    color: "hsl(200 80% 60%)",
  },
  "Cryptocurrency": {
    label: "Cryptocurrency",
    color: "hsl(32 95% 44%)",
  },
}

export function PortfolioOverview() {
  const { overviewData, loadingStates } = usePortfolio();

  if (loadingStates.isInitialLoad && loadingStates.overview) {
    return <OverviewSkeleton />;
  }

  if (!overviewData) {
    return <OverviewSkeleton />;
  }

  // Transform distribution data for pie chart
  const allocationData = Object.entries(overviewData.distribution.investmentType)
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

  // Debug: log allocationData and investmentType
  console.log('Asset Allocation Debug:', {
    allocationData,
    investmentType: overviewData.distribution.investmentType
  });

  const EmptyChartState = ({ title }: { title: string }) => (
    <div className="flex flex-col items-center justify-center h-[200px] sm:h-[250px] lg:h-[300px] text-muted-foreground">
      <BarChart3 className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 mb-2 sm:mb-4" />
      <p className="text-xs sm:text-sm text-center px-4">Not enough historical data to display {title}.</p>
      <p className="text-xs text-center mt-1 sm:mt-2 px-4">Continue making investments to see your portfolio analytics.</p>
    </div>
  )

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-0">
      {/* Stats Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold break-all">
              {formatCurrency(overviewData.totalValue)}
            </div>
            {overviewData.monthlyChangePercentage !== undefined && (
              <p className="text-xs text-muted-foreground mt-1">
                <span className={overviewData.monthlyChangePercentage >= 0 ? "text-green-500" : "text-red-500"}>
                  {overviewData.monthlyChangePercentage >= 0 ? (
                    <ArrowUp className="mr-1 h-3 w-3 inline" />
                  ) : (
                    <ArrowDown className="mr-1 h-3 w-3 inline" />
                  )}
                  {formatPercentage(overviewData.monthlyChangePercentage)}
                </span>{" "}
                from last month
              </p>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit/Loss</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold break-all">
              {formatCurrency(overviewData.totalProfitLoss)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className={overviewData.totalProfitLossPercentage >= 0 ? "text-green-500" : "text-red-500"}>
                {overviewData.totalProfitLossPercentage >= 0 ? (
                  <ArrowUp className="mr-1 h-3 w-3 inline" />
                ) : (
                  <ArrowDown className="mr-1 h-3 w-3 inline" />
                )}
                {formatPercentage(overviewData.totalProfitLossPercentage)}
              </span>{" "}
              total return
            </p>
          </CardContent>
        </Card>
        
        <Card className="col-span-1 sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
            <PieChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold break-all">
              {formatCurrency(overviewData.totalInvested)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Current investment</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 xl:grid-cols-7">
        {/* Performance Chart */}
        <Card className="col-span-1 xl:col-span-4">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Portfolio Performance</CardTitle>
            <CardDescription className="text-sm">Portfolio value trend showing growth rates</CardDescription>
          </CardHeader>
          <CardContent className="pt-2 sm:pt-4">
            {overviewData.performance && overviewData.performance.history && overviewData.performance.history.length > 1 ? (
              <div className="w-full h-[250px] sm:h-[300px] lg:h-[350px]">
                <ChartContainer config={chartConfig}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={overviewData.performance.history.map((h: any) => ({
                      date: new Date(h.timestamp).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      }),
                      fullDate: new Date(h.timestamp).toLocaleDateString(),
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
                        fontSize={11}
                        interval="preserveStartEnd"
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={10}
                        fontSize={11}
                        tickFormatter={(value) => {
                          if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
                          if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`
                          return `$${value}`
                        }}
                      />
                      <ChartTooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const d = payload[0].payload;
                            return (
                              <div className="rounded-lg border bg-background p-3 shadow-sm">
                                <div className="grid gap-2">
                                  <div className="flex flex-col">
                                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                                      {d.fullDate}
                                    </span>
                                    <span className="font-bold text-sm sm:text-base">
                                      {formatCurrency(d.value)}
                                    </span>
                                    <span className={`text-sm ${d.profitLossPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                      {formatPercentage(d.profitLossPercentage)}
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
                        dot={{ r: 3, fill: "hsl(var(--chart-1))" }}
                        activeDot={{ r: 5, fill: "hsl(var(--chart-1))" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            ) : (
              <EmptyChartState title="performance chart" />
            )}
          </CardContent>
        </Card>

        {/* Asset Allocation Chart */}
        <Card className="col-span-1 xl:col-span-3">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Asset Allocation</CardTitle>
            <CardDescription className="text-sm">Distribution across investment types</CardDescription>
          </CardHeader>
          <CardContent className="pt-2 sm:pt-4">
            {hasAllocationData ? (
              <div className="h-[250px] sm:h-[300px]">
                <ChartContainer config={chartConfig}>
                  <ResponsiveContainer width="100%" height="70%">
                    <PieChart>
                      <Pie
                        data={allocationData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius="80%"
                        innerRadius={0}
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
                  </ResponsiveContainer>
                </ChartContainer>
                
                {/* Legend */}
                <div className="flex flex-wrap gap-2 sm:gap-4 pt-2 justify-center">
                  {allocationData.map((entry, index) => (
                    <div key={`legend-${index}`} className="flex items-center gap-2">
                      <div 
                        className="h-3 w-3 rounded-full flex-shrink-0" 
                        style={{
                          backgroundColor: chartConfig[entry.id as keyof typeof chartConfig]?.color || 
                            `hsl(${index * 45}, 70%, 50%)`
                        }}
                      />
                      <span className="text-xs sm:text-sm truncate">{entry.name}</span>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        ({entry.value.toFixed(1)}%)
                      </span>
                    </div>
                  ))}
                </div>
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