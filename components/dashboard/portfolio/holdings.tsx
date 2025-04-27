"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ArrowUpDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddInvestment } from "./add-investment";
import { usePortfolio } from "@/lib/contexts/portfolio-context";
import { Skeleton } from "@/components/ui/skeleton";
import { getPortfolioHoldings, getPortfolioHoldingsByCategory } from "@/lib/services/portfolio";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { TradeButton } from "./trade-button";
import { HoldingsSkeleton } from "@/components/skeleton/holdings-skeleton";
import type { HoldingCategory, Asset } from "@/lib/types/portfolio";

export function PortfolioHoldings() {
  const { selectedPortfolio } = usePortfolio();
  const [categories, setCategories] = useState<HoldingCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("");
  const [assets, setAssets] = useState<Asset[]>([]);
  const [assetsLoading, setAssetsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    assetSymbol: "",
    purchasePrice: "",
    quantity: "",
    currentPrice: "",
    marketValue: "",
    percentageChange24h: "",
  });
  const [sort, setSort] = useState<{ key: keyof Asset | null; direction: "asc" | "desc" }>({ key: null, direction: "asc" });

  // Fetch categories for tabs
  useEffect(() => {
    if (!selectedPortfolio) return;
    setLoading(true);
    getPortfolioHoldings(selectedPortfolio.id)
      .then(setCategories)
      .finally(() => setLoading(false));
  }, [selectedPortfolio]);

  // Set initial active tab
  useEffect(() => {
    if (!activeTab && categories.length > 0) {
      setActiveTab(categories[0].categoryKey);
    }
  }, [categories, activeTab]);

  // Fetch assets for selected tab
  useEffect(() => {
    if (!selectedPortfolio || !activeTab) return;
    const category = categories.find(c => c.categoryKey === activeTab);
    if (!category) return;
    setAssetsLoading(true);
    getPortfolioHoldingsByCategory(selectedPortfolio.id, category.investmentType, category.region)
      .then(data => {
        // Find the correct category and extract its assets
        const cat = data.find(c => c.categoryKey === activeTab);
        setAssets(cat && Array.isArray(cat.assets) ? cat.assets : []);
      })
      .finally(() => setAssetsLoading(false));
  }, [selectedPortfolio, activeTab, categories]);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Format percentage
  const formatPercentage = (value: number | undefined | null) => {
    if (typeof value !== "number" || isNaN(value)) return "-";
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
  };

  // Filter assets by search and column filters
  const filteredAssets = assets.filter(asset => {
    const matchesSearch =
      search.trim() === "" ||
      asset.assetSymbol.toLowerCase().includes(search.toLowerCase());
    const matchesSymbol =
      filters.assetSymbol.trim() === "" ||
      asset.assetSymbol.toLowerCase().includes(filters.assetSymbol.toLowerCase());
    const matchesAOV =
      filters.purchasePrice.trim() === "" ||
      asset.purchasePrice.toString().includes(filters.purchasePrice);
    const matchesQuantity =
      filters.quantity.trim() === "" ||
      asset.quantity.toString().includes(filters.quantity);
    const matchesLTP =
      filters.currentPrice.trim() === "" ||
      asset.currentPrice.toString().includes(filters.currentPrice);
    const matchesValue =
      filters.marketValue.trim() === "" ||
      asset.marketValue.toString().includes(filters.marketValue);
    const matchesChange =
      filters.percentageChange24h.trim() === "" ||
      asset.percentageChange24h.toString().includes(filters.percentageChange24h);
    return (
      matchesSearch &&
      matchesSymbol &&
      matchesAOV &&
      matchesQuantity &&
      matchesLTP &&
      matchesValue &&
      matchesChange
    );
  });

  // Sorting logic
  const sortedAssets = useMemo(() => {
    if (!sort.key) return filteredAssets;
    return [...filteredAssets].sort((a, b) => {
      const aValue = a[sort.key!];
      const bValue = b[sort.key!];
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sort.direction === "asc" ? aValue - bValue : bValue - aValue;
      }
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sort.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      return 0;
    });
  }, [filteredAssets, sort]);

  // Helper to toggle sort
  const handleSort = (key: keyof Asset) => {
    setSort(prev => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  if (loading) {
    return <HoldingsSkeleton />
  }

  if (!selectedPortfolio || categories.length === 0) {
    return <div>No holdings data available</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col">
            <CardTitle>Holdings</CardTitle>
            <CardDescription>Your investment holdings</CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
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
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-4 gap-2">
            <TabsList className="flex w-auto">
              {categories.map((cat) => (
                <TabsTrigger key={cat.categoryKey} value={cat.categoryKey} className="whitespace-nowrap">
                  {cat.categoryKey}
                </TabsTrigger>
              ))}
            </TabsList>
            <Input
              type="text"
              placeholder="Search assets..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-56 ml-4"
            />
          </div>
          {categories.map((cat) => (
            <TabsContent key={cat.categoryKey} value={cat.categoryKey}>
              <div className="space-y-4">
                {/* Stat cards for the category */}
                <div className="flex flex-wrap gap-4 mb-4">
                  <Card className="flex-1 min-w-[180px]">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs font-medium">Total Value</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-lg font-bold">{formatCurrency(cat.totalValue)}</div>
                    </CardContent>
                  </Card>
                  <Card className="flex-1 min-w-[180px]">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs font-medium">Total Invested</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-lg font-bold">{formatCurrency(cat.totalInvested)}</div>
                    </CardContent>
                  </Card>
                  <Card className="flex-1 min-w-[180px]">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs font-medium">P/L %</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className={cat.profitLossPercentage >= 0 ? "text-green-500 font-bold text-lg" : "text-red-500 font-bold text-lg"}>{formatPercentage(cat.profitLossPercentage)}</div>
                    </CardContent>
                  </Card>
                </div>
                {/* Table view for assets */}
                {assetsLoading ? (
                  <div className="w-full flex flex-col gap-2">
                    {[...Array(6)].map((_, i) => (
                      <Skeleton key={i} className="h-8 w-full rounded" />
                    ))}
                  </div>
                ) : sortedAssets.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">No assets in this category</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="cursor-pointer select-none text-center">Symbol <ArrowUpDown className="inline w-4 h-4 ml-1 align-text-bottom" /></TableHead>
                        <TableHead className="cursor-pointer select-none text-center" onClick={() => handleSort("purchasePrice")}>AOV <ArrowUpDown className="inline w-4 h-4 ml-1 align-text-bottom" /></TableHead>
                        <TableHead className="cursor-pointer select-none text-center" onClick={() => handleSort("quantity")}>Quantity <ArrowUpDown className="inline w-4 h-4 ml-1 align-text-bottom" /></TableHead>
                        <TableHead className="cursor-pointer select-none text-center" onClick={() => handleSort("currentPrice")}>LTP <ArrowUpDown className="inline w-4 h-4 ml-1 align-text-bottom" /></TableHead>
                        <TableHead className="cursor-pointer select-none text-center" onClick={() => handleSort("marketValue")}>Value <ArrowUpDown className="inline w-4 h-4 ml-1 align-text-bottom" /></TableHead>
                        <TableHead className="cursor-pointer select-none text-center" onClick={() => handleSort("percentageChange24h")}>P/L Today <ArrowUpDown className="inline w-4 h-4 ml-1 align-text-bottom" /></TableHead>
                        <TableHead className="cursor-pointer select-none text-center" onClick={() => handleSort("profitLossPercentage")}>P/L Overall <ArrowUpDown className="inline w-4 h-4 ml-1 align-text-bottom" /></TableHead>
                        <TableHead className="text-center w-28"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedAssets.map((asset) => (
                        <TableRow key={asset.id}>
                          <TableCell className="font-bold text-center">{asset.assetSymbol || '-'}</TableCell>
                          <TableCell className="text-center">{typeof asset.purchasePrice === 'number' && !isNaN(asset.purchasePrice) ? formatCurrency(asset.purchasePrice) : '-'}</TableCell>
                          <TableCell className="text-center">{typeof asset.quantity === 'number' && !isNaN(asset.quantity) ? asset.quantity : '-'}</TableCell>
                          <TableCell className="text-center">{typeof asset.currentPrice === 'number' && !isNaN(asset.currentPrice) ? formatCurrency(asset.currentPrice) : '-'}</TableCell>
                          <TableCell className="text-center">{typeof asset.marketValue === 'number' && !isNaN(asset.marketValue) ? formatCurrency(asset.marketValue) : '-'}</TableCell>
                          <TableCell className={"text-center " + (typeof asset.percentageChange24h === 'number' && !isNaN(asset.percentageChange24h) ? (asset.percentageChange24h >= 0 ? "text-green-500" : "text-red-500") : '')}>{formatPercentage(asset.percentageChange24h)}</TableCell>
                          <TableCell className={"text-center " + (typeof asset.profitLossPercentage === 'number' && !isNaN(asset.profitLossPercentage) ? (asset.profitLossPercentage >= 0 ? "text-green-500" : "text-red-500") : '')}>{formatPercentage(asset.profitLossPercentage)}</TableCell>
                          <TableCell className="text-right w-28">
                            <div className="flex justify-end space-x-1">
                              <TradeButton type="buy" symbol={asset.assetSymbol} name={asset.assetSymbol} price={asset.currentPrice} change={asset.percentageChange24h} />
                              <TradeButton type="sell" symbol={asset.assetSymbol} name={asset.assetSymbol} price={asset.currentPrice} change={asset.percentageChange24h} />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
