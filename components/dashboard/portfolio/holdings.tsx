"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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
import { InvestmentType, Region, AssetHolding } from "@/lib/types/portfolio";
import { Skeleton } from "@/components/ui/skeleton";

interface HoldingsByType {
  [key: string]: {
    holdings: AssetHolding[];
    totalValue: number;
  };
}

export function PortfolioHoldings() {
  const { portfolioDetails, isLoading } = usePortfolio();
  const [activeTab, setActiveTab] = useState<string>("");

  const LoadingSkeleton = () => (
    <Card>
      <CardHeader>
        <CardTitle>Holdings</CardTitle>
        <CardDescription>Your investment holdings by type</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-10 w-[200px]" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
              <Skeleton className="h-10 hidden lg:block" />
              <Skeleton className="h-10 hidden lg:block" />
            </div>
          </div>
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-[200px]" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-[100px]" />
                      <Skeleton className="h-8 w-[150px]" />
                    </div>
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-[100px]" />
                      <Skeleton className="h-8 w-[100px]" />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="flex justify-between">
                        <Skeleton className="h-4 w-[100px]" />
                        <Skeleton className="h-4 w-[100px]" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!portfolioDetails) {
    return <div>No portfolio data available</div>;
  }

  // Group holdings by investment type and region for equities
  const holdingsByType = useMemo(() => {
    const holdings = portfolioDetails.holdings.assets;
    if (!holdings || holdings.length === 0) {
      return {};
    }

    return holdings.reduce<HoldingsByType>((acc, holding) => {
      const baseKey = holding.investmentType;

      // For equities, combine with region
      const key =
        holding.investmentType === InvestmentType.Equity
          ? `${InvestmentType.Equity} - ${holding.region}`
          : baseKey;

      if (!acc[key]) {
        acc[key] = {
          holdings: [],
          totalValue: 0,
        };
      }

      acc[key].holdings.push(holding);
      acc[key].totalValue += holding.marketValue;

      return acc;
    }, {});
  }, [portfolioDetails.holdings.assets]);

  // Set initial active tab if not set
  if (!activeTab && Object.keys(holdingsByType).length > 0) {
    setActiveTab(Object.keys(holdingsByType)[0]);
  }

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
  const formatPercentage = (value: number) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
  };

  // Get display name for tab
  const getTabDisplayName = (key: string) => {
    return key; // The key is already formatted correctly now
  };

  // If no holdings at all, show empty state with add button
  if (Object.keys(holdingsByType).length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
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
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">
            You don't have any investments yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
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
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 lg:grid-cols-4">
            {Object.keys(holdingsByType).map((type) => (
              <TabsTrigger key={type} value={type}>
                {getTabDisplayName(type)}
              </TabsTrigger>
            ))}
          </TabsList>
          {Object.entries(holdingsByType).map(([type, data]) => (
            <TabsContent key={type} value={type}>
              <div className="space-y-4">
                <div className="grid gap-4">
                  {data.holdings.map((holding, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                          {holding.assetSymbol}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Market Value</p>
                            <p className="text-2xl font-bold">
                              {formatCurrency(holding.marketValue)}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Profit/Loss</p>
                            <p
                              className={`text-xl font-bold ${
                                holding.profitLossPercentage >= 0
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}
                            >
                              {formatPercentage(holding.profitLossPercentage)}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Quantity
                            </span>
                            <span>{holding.quantity}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Average Cost
                            </span>
                            <span>{formatCurrency(holding.purchasePrice)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Current Price
                            </span>
                            <span>{formatCurrency(holding.currentPrice)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
