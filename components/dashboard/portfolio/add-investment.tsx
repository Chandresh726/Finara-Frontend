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
import { searchMarketEquity, searchMarketCrypto } from "@/lib/services/market";
import { useDebounce } from "@/hooks/use-debounce";
import type { MarketSearchMatch } from "@/lib/types/portfolio";

const investmentTypes = [
  { value: "equity", label: "Equity" },
  { value: "crypto", label: "Cryptocurrency" },
]

const regionsByType: Record<string, { value: string; label: string }[]> = {
  equity: [
    { value: "us", label: "US" },
    { value: "india", label: "India" },
  ],
  crypto: [
    { value: "global", label: "Global" },
  ],
}

// Mock search results - in real app, this would come from an API
const mockSearchResults = {
  "equity-us": [
    { symbol: "AAPL", name: "Apple Inc.", price: 175.5, change: 2.5 },
    { symbol: "MSFT", name: "Microsoft Corp.", price: 380.2, change: 1.8 },
    { symbol: "GOOGL", name: "Alphabet Inc.", price: 2850.0, change: -0.8 },
    { symbol: "AMZN", name: "Amazon.com Inc.", price: 178.25, change: 1.2 },
    { symbol: "NVDA", name: "NVIDIA Corporation", price: 890.5, change: 3.5 },
    { symbol: "META", name: "Meta Platforms Inc.", price: 485.9, change: 2.1 },
  ],
  "equity-india": [
    { symbol: "RELIANCE", name: "Reliance Industries", price: 2800.0, change: -0.5 },
    { symbol: "TCS", name: "Tata Consultancy", price: 3200.0, change: 1.2 },
    { symbol: "HDFCBANK", name: "HDFC Bank", price: 1600.0, change: 0.8 },
    { symbol: "INFY", name: "Infosys Limited", price: 1450.75, change: -1.2 },
    { symbol: "WIPRO", name: "Wipro Limited", price: 450.25, change: 0.9 },
    { symbol: "BHARTIARTL", name: "Bharti Airtel", price: 890.5, change: 1.5 },
  ],
  "crypto-global": [
    { symbol: "BTC", name: "Bitcoin", price: 50000.0, change: 5.2 },
    { symbol: "ETH", name: "Ethereum", price: 3500.0, change: 3.8 },
    { symbol: "SOL", name: "Solana", price: 120.0, change: 7.5 },
    { symbol: "DOT", name: "Polkadot", price: 15.8, change: 4.2 },
    { symbol: "AVAX", name: "Avalanche", price: 35.6, change: 6.8 },
    { symbol: "MATIC", name: "Polygon", price: 0.85, change: -1.5 },
  ],
}

// Utility to format change percentage
function formatChangePercent(change: number | string): string {
  const num = typeof change === 'string' ? parseFloat(change) : change;
  if (isNaN(num)) return '-';
  return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`;
}

export function AddInvestment() {
  const [selectedType, setSelectedType] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<MarketSearchMatch[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const debouncedQuery = useDebounce(searchQuery, 300)

  // Reset search and results when type or region changes
  useEffect(() => {
    setSearchQuery("");
    setResults([]);
    setError(null);
    setLoading(false);
  }, [selectedType, selectedRegion]);

  useEffect(() => {
    if (!selectedType || !selectedRegion || !debouncedQuery) {
      setResults([])
      setError(null)
      setLoading(false)
      return
    }
    let cancelled = false
    async function fetchResults() {
      setLoading(true)
      setError(null)
      try {
        let res
        if (selectedType === "crypto") {
          res = await searchMarketCrypto(debouncedQuery)
        } else if (selectedType === "equity") {
          // Capitalize region for equity
          const regionCap = selectedRegion.toUpperCase()
          res = await searchMarketEquity(debouncedQuery, regionCap)
        } else {
          setResults([])
          setLoading(false)
          return
        }
        if (!cancelled) {
          if (!res?.data?.bestMatches) {
            setError("No results found or invalid response from server.")
            setResults([])
          } else {
            setResults(res.data.bestMatches)
          }
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message || "Failed to fetch search results. Please try again later.")
          setResults([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchResults()
    return () => {
      cancelled = true
      setLoading(false)
    }
  }, [selectedType, selectedRegion, debouncedQuery])

  // Set region to global when cryptocurrency is selected
  useEffect(() => {
    if (selectedType === "crypto") {
      setSelectedRegion("global")
    } else if (selectedType === "equity") {
      setSelectedRegion("")
    } else {
      setSelectedRegion("")
    }
  }, [selectedType])

  const availableRegions = selectedType ? regionsByType[selectedType] : []
  const isSearchEnabled = selectedType && selectedRegion
  
  const filteredResults = results

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
          disabled={selectedType === "crypto" || !selectedType}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select region" />
          </SelectTrigger>
          <SelectContent>
            {availableRegions.map((region) => (
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

      {loading && (
        <div className="text-center py-6 text-muted-foreground">Loading...</div>
      )}
      {error && (
        <div className="text-center py-6 text-red-500">{error}</div>
      )}
      {debouncedQuery && filteredResults.length > 0 && !loading && !error && (
        <div className="rounded-md border">
          <div className="max-h-[300px] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-background">
                <TableRow>
                  <TableHead className="text-left w-32">Symbol</TableHead>
                  <TableHead className="text-center w-24">Price</TableHead>
                  <TableHead className="text-center w-24">Change</TableHead>
                  <TableHead className="text-right w-32">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResults.map((result, idx) => {
                  const regionCap = result.region.charAt(0).toUpperCase() + result.region.slice(1).toLowerCase();
                  const investmentTypeCap = result.type.charAt(0).toUpperCase() + result.type.slice(1).toLowerCase();
                  const formattedChange = formatChangePercent(result.changePercentage);
                  return (
                    <TableRow key={result.symbol + '-' + result.name + '-' + idx} className="hover:bg-muted/50">
                      <TableCell className="text-left align-middle">
                        <div>
                          <div className="font-medium">{result.symbol}</div>
                          <div className="text-xs text-muted-foreground">{result.name}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center align-middle font-bold">
                        ${Number(result.price).toLocaleString()}
                      </TableCell>
                      <TableCell className={"text-center align-middle " + (Number(result.changePercentage) >= 0 ? 'text-green-500' : 'text-red-500')}>
                        {formattedChange}
                      </TableCell>
                      <TableCell className="text-right align-middle">
                        <TradeButton
                          key={result.symbol + '-' + result.name + '-' + idx + '-' + regionCap + '-' + investmentTypeCap}
                          type="buy"
                          symbol={result.symbol}
                          name={result.name}
                          price={Number(result.price)}
                          change={Number(result.changePercentage)}
                          region={regionCap}
                          investmentType={investmentTypeCap}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
      {debouncedQuery && filteredResults.length === 0 && !loading && !error && (
        <div className="text-center py-6 text-muted-foreground">
          No results found for your search
        </div>
      )}
    </div>
  )
} 