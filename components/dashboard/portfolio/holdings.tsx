"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Minus, ArrowUpDown } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AddInvestment } from "./add-investment"
import { TradeButton } from "./trade-button"

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
    { id: "13", symbol: "DOT", name: "Polkadot", type: "Crypto", value: 4500, change: 4.2, aov: 15, ltp: 16.5, quantity: 300 },
    { id: "14", symbol: "AVAX", name: "Avalanche", type: "Crypto", value: 5200, change: 6.8, aov: 35, ltp: 38, quantity: 150 },
    { id: "15", symbol: "MATIC", name: "Polygon", type: "Crypto", value: 2800, change: -1.5, aov: 0.8, ltp: 0.75, quantity: 3500 },
    { id: "16", symbol: "LINK", name: "Chainlink", type: "Crypto", value: 3600, change: 3.2, aov: 12, ltp: 13.5, quantity: 300 },
    { id: "17", symbol: "UNI", name: "Uniswap", type: "Crypto", value: 1800, change: -0.8, aov: 5, ltp: 4.8, quantity: 360 },
    { id: "18", symbol: "ATOM", name: "Cosmos", type: "Crypto", value: 2200, change: 2.4, aov: 8, ltp: 8.5, quantity: 275 },
    { id: "19", symbol: "ALGO", name: "Algorand", type: "Crypto", value: 1500, change: 1.2, aov: 0.3, ltp: 0.32, quantity: 5000 },
    { id: "20", symbol: "XRP", name: "Ripple", type: "Crypto", value: 4200, change: 5.5, aov: 0.6, ltp: 0.65, quantity: 7000 },
  ],
}

export function PortfolioHoldings() {
  const [activeTab, setActiveTab] = useState(Object.keys(mockHoldings)[0])
  const [searchQuery, setSearchQuery] = useState("")
  const [sortConfig, setSortConfig] = useState<{ key: keyof AssetType; direction: 'asc' | 'desc' } | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredHoldings = mockHoldings[activeTab]?.filter(holding => 
    holding.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    holding.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  const sortedHoldings = [...filteredHoldings].sort((a, b) => {
    if (!sortConfig) return 0
    const { key, direction } = sortConfig
    if (a[key] < b[key]) return direction === 'asc' ? -1 : 1
    if (a[key] > b[key]) return direction === 'asc' ? 1 : -1
    return 0
  })

  const totalPages = Math.ceil(sortedHoldings.length / itemsPerPage)
  const paginatedHoldings = sortedHoldings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleSort = (key: keyof AssetType) => {
    setSortConfig(current => ({
      key,
      direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const categoryStats = {
    totalValue: mockHoldings[activeTab]?.reduce((sum, h) => sum + h.value, 0) || 0,
    totalChange: (mockHoldings[activeTab]?.reduce((sum, h) => sum + h.change, 0) || 0) / 
                (mockHoldings[activeTab]?.length || 1),
    count: mockHoldings[activeTab]?.length || 0
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <TabsList className="w-full sm:w-auto overflow-x-auto">
              {Object.keys(mockHoldings).map((category) => (
                <TabsTrigger key={category} value={category} className="min-w-[120px] sm:min-w-32">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Input
                placeholder="Search assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-[200px]"
              />
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Investment
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Add New Investment</DialogTitle>
                  </DialogHeader>
                  <AddInvestment />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {Object.entries(mockHoldings).map(([category, _]) => (
            <TabsContent key={category} value={category} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <Card className="p-3 sm:p-4">
                  <div className="text-sm text-muted-foreground">Total Value</div>
                  <div className="text-xl sm:text-2xl font-bold mt-1">
                    ${categoryStats.totalValue.toLocaleString()}
                  </div>
                </Card>
                <Card className="p-3 sm:p-4">
                  <div className="text-sm text-muted-foreground">Total Assets</div>
                  <div className="text-xl sm:text-2xl font-bold mt-1">{categoryStats.count}</div>
                </Card>
                <Card className="p-3 sm:p-4">
                  <div className="text-sm text-muted-foreground">Average Change</div>
                  <div className={`text-xl sm:text-2xl font-bold mt-1 ${categoryStats.totalChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {categoryStats.totalChange >= 0 ? '+' : ''}{categoryStats.totalChange.toFixed(2)}%
                  </div>
                </Card>
              </div>

              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[180px] lg:w-[250px]">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="flex items-center gap-1">
                            Symbol
                            <ArrowUpDown className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleSort('symbol')}>Sort by Symbol</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSort('name')}>Sort by Name</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" size="sm" onClick={() => handleSort('aov')} className="flex items-center gap-1">
                          AOV
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" size="sm" onClick={() => handleSort('quantity')} className="flex items-center gap-1">
                          Qty
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" size="sm" onClick={() => handleSort('ltp')} className="flex items-center gap-1">
                          Price
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" size="sm" onClick={() => handleSort('value')} className="flex items-center gap-1">
                          Value
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" size="sm" onClick={() => handleSort('change')} className="flex items-center gap-1">
                          Change
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedHoldings.map((holding) => (
                      <TableRow key={holding.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{holding.symbol}</div>
                            <div className="text-xs text-muted-foreground hidden sm:block">{holding.name}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">${holding.aov.toLocaleString()}</TableCell>
                        <TableCell className="text-center">{holding.quantity}</TableCell>
                        <TableCell className="text-center">${holding.ltp.toLocaleString()}</TableCell>
                        <TableCell className="text-center">${holding.value.toLocaleString()}</TableCell>
                        <TableCell className={holding.change >= 0 ? 'text-center text-green-500' : ' text-center text-red-500'}>
                          {holding.change >= 0 ? '+' : ''}{holding.change}%
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-col sm:flex-row justify-end gap-2">
                            <TradeButton 
                              type="buy"
                              symbol={holding.symbol}
                              name={holding.name}
                              price={holding.ltp}
                              change={holding.change}
                            />
                            <TradeButton 
                              type="sell"
                              symbol={holding.symbol}
                              name={holding.name}
                              price={holding.ltp}
                              change={holding.change}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4">
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedHoldings.length)} of {sortedHoldings.length} entries
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map(page => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="hidden sm:inline-flex"
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages || 1, p + 1))}
                    disabled={currentPage === (totalPages || 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
