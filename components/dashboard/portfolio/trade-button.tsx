"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Plus, Minus } from "lucide-react"

interface TradeButtonProps {
  type: "buy" | "sell"
  symbol: string
  name: string
  price: number
  change: number
}

export function TradeButton({ type, symbol, name, price, change }: TradeButtonProps) {
  const [quantity, setQuantity] = useState("")
  const amount = quantity ? parseFloat(quantity) * price : 0

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`h-8 w-full sm:w-auto ${
            type === "buy" 
              ? "bg-green-200 hover:bg-green-300 text-green-800" 
              : "bg-red-100 hover:bg-red-200 text-red-700"
          }`}
        >
          {type === "buy" ? (
            <Plus className="h-4 w-4 mr-1" />
          ) : (
            <Minus className="h-4 w-4 mr-1" />
          )}
          {type === "buy" ? "Buy" : "Sell"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-6">
          {/* Header with symbol and price */}
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium text-lg">{symbol}</h4>
              <p className="text-sm text-muted-foreground">{name}</p>
            </div>
            <div className="text-right">
              <div className="font-medium">${price.toLocaleString()}</div>
              <div className={`text-sm ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {change >= 0 ? '+' : ''}{change}%
              </div>
            </div>
          </div>

          {/* Quantity Input */}
          <div className="space-y-4">
            <div className="grid gap-2">
              <label htmlFor="quantity" className="text-sm font-medium">
                Quantity
              </label>
              <Input
                id="quantity"
                type="number"
                className="h-9"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="0"
                step="0.000001"
                placeholder="Enter quantity"
              />
            </div>

            {/* Total Amount */}
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-sm font-medium">Total Amount</span>
              <span className="text-lg font-bold">
                ${amount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuantity("")}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className={`px-6 ${type === "buy" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
              disabled={!quantity || parseFloat(quantity) <= 0}
            >
              Confirm {type === "buy" ? "Buy" : "Sell"}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
} 