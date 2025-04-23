"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Minus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface PortfolioHoldingsProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

type AssetType = {
  id: string
  symbol: string
  name: string
  type: string
  value: number
  change: number
  aov: number
  ltp: number
  quantity: number
}

const mockHoldings: Record<string, AssetType[]> = {
  "Equity - US": [
    { id: "1", symbol: "AAPL", name: "Apple Inc.", type: "Stock", value: 15000, change: 2.5, aov: 150, ltp: 175, quantity: 100 },
    { id: "2", symbol: "MSFT", name: "Microsoft Corp.", type: "Stock", value: 12000, change: 1.8, aov: 200, ltp: 380, quantity: 60 },
    { id: "7", symbol: "GOOGL", name: "Alphabet Inc.", type: "Stock", value: 9500, change: -0.8, aov: 2800, ltp: 2850, quantity: 3 },
    { id: "8", symbol: "AMZN", name: "Amazon.com Inc.", type: "Stock", value: 8500, change: 1.2, aov: 170, ltp: 180, quantity: 50 },
  ],
  "Equity - India": [
    { id: "3", symbol: "RELIANCE", name: "Reliance Industries", type: "Stock", value: 8000, change: -0.5, aov: 2500, ltp: 2800, quantity: 3 },
    { id: "4", symbol: "TCS", name: "Tata Consultancy", type: "Stock", value: 6000, change: 1.2, aov: 3000, ltp: 3200, quantity: 2 },
    { id: "9", symbol: "HDFCBANK", name: "HDFC Bank", type: "Stock", value: 4500, change: 0.8, aov: 1500, ltp: 1600, quantity: 3 },
    { id: "10", symbol: "INFY", name: "Infosys", type: "Stock", value: 3500, change: -1.2, aov: 1400, ltp: 1350, quantity: 2 },
  ],
  "Cryptocurrency": [
    { id: "5", symbol: "BTC", name: "Bitcoin", type: "Crypto", value: 25000, change: 5.2, aov: 45000, ltp: 50000, quantity: 0.5 },
    { id: "6", symbol: "ETH", name: "Ethereum", type: "Crypto", value: 15000, change: 3.8, aov: 3000, ltp: 3500, quantity: 5 },
    { id: "11", symbol: "SOL", name: "Solana", type: "Crypto", value: 8000, change: 7.5, aov: 100, ltp: 120, quantity: 80 },
    { id: "12", symbol: "ADA", name: "Cardano", type: "Crypto", value: 3000, change: -2.1, aov: 0.5, ltp: 0.45, quantity: 6000 },
  ],
}

export function PortfolioHoldings({ searchQuery, onSearchChange }: PortfolioHoldingsProps) {
  const filteredHoldings = Object.entries(mockHoldings).reduce((acc, [category, holdings]) => {
    const filtered = holdings.filter(holding => 
      holding.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      holding.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    )
    if (filtered.length > 0) {
      acc[category] = filtered
    }
    return acc
  }, {} as Record<string, AssetType[]>)

  const getCategoryStats = (holdings: AssetType[]) => {
    const totalValue = holdings.reduce((sum, h) => sum + h.value, 0)
    const totalChange = holdings.reduce((sum, h) => sum + h.change, 0) / holdings.length
    return { totalValue, totalChange, count: holdings.length }
  }

  return (
    <div className="space-y-3">
      {Object.entries(filteredHoldings).map(([category, holdings]) => {
        const stats = getCategoryStats(holdings)
        return (
          <Card key={category}>
            <CardHeader className="flex flex-row items-center justify-between py-3">
              <div>
                <CardTitle className="text-lg">{category}</CardTitle>
                <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Value: ${stats.totalValue.toLocaleString()}</span>
                  <span>Items: {stats.count}</span>
                  <span className={stats.totalChange >= 0 ? 'text-green-500' : 'text-red-500'}>
                    {stats.totalChange >= 0 ? '+' : ''}{stats.totalChange.toFixed(2)}%
                  </span>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Investment to {category}</DialogTitle>
                  </DialogHeader>
                  <div className="relative mt-4">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search assets..."
                      className="pl-8"
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="py-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Symbol</TableHead>
                    <TableHead>AOV</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Change</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {holdings.map((holding) => (
                    <TableRow key={holding.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{holding.symbol}</div>
                          <div className="text-xs text-muted-foreground">{holding.name}</div>
                        </div>
                      </TableCell>
                      <TableCell>${holding.aov.toLocaleString()}</TableCell>
                      <TableCell>{holding.quantity}</TableCell>
                      <TableCell>${holding.ltp.toLocaleString()}</TableCell>
                      <TableCell>${holding.value.toLocaleString()}</TableCell>
                      <TableCell className={holding.change >= 0 ? 'text-green-500' : 'text-red-500'}>
                        {holding.change >= 0 ? '+' : ''}{holding.change}%
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="default" size="sm" className="h-7 px-2">
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button variant="destructive" size="sm" className="h-7 px-2">
                            <Minus className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
