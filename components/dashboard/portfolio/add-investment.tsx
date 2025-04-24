"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus } from "lucide-react"
import { TradeButton } from "./trade-button"

const investmentTypes = [
  { value: "gold", label: "Gold" },
  { value: "crypto", label: "Cryptocurrency" },
  { value: "equity", label: "Equity" },
  { value: "bonds", label: "Bonds" },
  { value: "etf", label: "ETF" },
  { value: "real-estate", label: "Real Estate" },
  { value: "commodities", label: "Commodities" },
]

const regions = [
  { value: "us", label: "US" },
  { value: "india", label: "India" },
  { value: "global", label: "Global" },
  { value: "europe", label: "Europe" },
  { value: "asia", label: "Asia" },
  { value: "latin-america", label: "Latin America" },
]

// Mock search results - in real app, this would come from an API
const mockSearchResults = {
  "equity-us": [
    { symbol: "AAPL", name: "Apple Inc.", price: 175.50, change: 2.5 },
    { symbol: "MSFT", name: "Microsoft Corp.", price: 380.20, change: 1.8 },
    { symbol: "GOOGL", name: "Alphabet Inc.", price: 2850.00, change: -0.8 },
    { symbol: "AMZN", name: "Amazon.com Inc.", price: 178.25, change: 1.2 },
    { symbol: "NVDA", name: "NVIDIA Corporation", price: 890.50, change: 3.5 },
    { symbol: "META", name: "Meta Platforms Inc.", price: 485.90, change: 2.1 },
  ],
  "equity-india": [
    { symbol: "RELIANCE", name: "Reliance Industries", price: 2800.00, change: -0.5 },
    { symbol: "TCS", name: "Tata Consultancy", price: 3200.00, change: 1.2 },
    { symbol: "HDFCBANK", name: "HDFC Bank", price: 1600.00, change: 0.8 },
    { symbol: "INFY", name: "Infosys Limited", price: 1450.75, change: -1.2 },
    { symbol: "WIPRO", name: "Wipro Limited", price: 450.25, change: 0.9 },
    { symbol: "BHARTIARTL", name: "Bharti Airtel", price: 890.50, change: 1.5 },
  ],
  "crypto-global": [
    { symbol: "BTC", name: "Bitcoin", price: 50000.00, change: 5.2 },
    { symbol: "ETH", name: "Ethereum", price: 3500.00, change: 3.8 },
    { symbol: "SOL", name: "Solana", price: 120.00, change: 7.5 },
    { symbol: "DOT", name: "Polkadot", price: 15.80, change: 4.2 },
    { symbol: "AVAX", name: "Avalanche", price: 35.60, change: 6.8 },
    { symbol: "MATIC", name: "Polygon", price: 0.85, change: -1.5 },
  ],
  "gold-global": [
    { symbol: "GLD", name: "SPDR Gold Shares", price: 185.20, change: 0.8 },
    { symbol: "IAU", name: "iShares Gold Trust", price: 38.45, change: 0.6 },
    { symbol: "SGOL", name: "Aberdeen Standard Physical Gold", price: 18.90, change: 0.7 },
    { symbol: "BAR", name: "GraniteShares Gold Trust", price: 19.25, change: 0.5 },
    { symbol: "GLDM", name: "SPDR Gold MiniShares Trust", price: 20.15, change: 0.9 },
  ],
}

export function AddInvestment() {
  const [selectedType, setSelectedType] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  
  // Set region to global when cryptocurrency is selected
  useEffect(() => {
    if (selectedType === "crypto") {
      setSelectedRegion("global")
    }
  }, [selectedType])

  const isSearchEnabled = selectedType && selectedRegion
  const searchKey = isSearchEnabled ? `${selectedType}-${selectedRegion}` : ""
  
  const filteredResults = isSearchEnabled && searchQuery
    ? mockSearchResults[searchKey as keyof typeof mockSearchResults]?.filter(
        item => item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
               item.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5) // Limit to 5 results
    : []

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger>
            <SelectValue placeholder="Select investment type" />
          </SelectTrigger>
          <SelectContent>
            {investmentTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select 
          value={selectedRegion} 
          onValueChange={setSelectedRegion}
          disabled={selectedType === "crypto"}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select region" />
          </SelectTrigger>
          <SelectContent>
            {regions.map((region) => (
              <SelectItem key={region.value} value={region.value}>
                {region.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Input
        placeholder="Search by symbol or name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        disabled={!isSearchEnabled}
        className="w-full"
      />

      {searchQuery && filteredResults.length > 0 && (
        <div className="rounded-md border">
          <div className="max-h-[300px] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-background">
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Change</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResults.map((result) => (
                  <TableRow key={result.symbol}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{result.symbol}</div>
                        <div className="text-xs text-muted-foreground">{result.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>${result.price.toLocaleString()}</TableCell>
                    <TableCell className={result.change >= 0 ? 'text-green-500' : 'text-red-500'}>
                      {result.change >= 0 ? '+' : ''}{result.change}%
                    </TableCell>
                    <TableCell className="text-right">
                      <TradeButton
                        type="buy"
                        symbol={result.symbol}
                        name={result.name}
                        price={result.price}
                        change={result.change}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {searchQuery && filteredResults.length === 0 && (
        <div className="text-center py-6 text-muted-foreground">
          No results found for your search
        </div>
      )}
    </div>
  )
} 