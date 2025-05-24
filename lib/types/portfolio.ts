// Base Types
export interface Portfolio {
  id: string
  title: string
  description: string
  createdAt: string
  updatedAt: string
}

// Enums
export enum InvestmentType {
  Equity = "Equity",
  Cryptocurrency = "Cryptocurrency",
}

export enum Region {
  US = "US",
  India = "India",
  Global = "Global",
}

export enum TransactionType {
  buy = "buy",
  sell = "sell"
}

// Portfolio List Types
export interface GetPortfoliosResponse {
  portfolios: Portfolio[]
}

export interface ApiPortfoliosResponse {
  success: boolean
  data: Portfolio[]
}

// Portfolio Creation Types
export interface CreatePortfolioRequest {
  title: string
  description: string
}

export interface ApiCreatePortfolioResponse {
  success: boolean
  data: Portfolio
}

export interface CreatePortfolioResponse {
  portfolio: Portfolio
}

// Portfolio Details Types
export interface AssetHolding {
  id: string
  assetSymbol: string
  investmentType: InvestmentType
  region: Region
  quantity: number
  purchasePrice: number
  currentPrice: number
  amountInvested: number
  marketValue: number
  profitLoss: number
  profitLossPercentage: number
  lastUpdated: string
}

// Error Types
export class PortfolioError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "PortfolioError"
  }
}

// Portfolio view type
export type PortfolioView = "overview" | "holdings" | "transactions";

// Portfolio Header Props
export interface PortfolioHeaderProps {
  currentView: PortfolioView;
  onViewChange: (view: PortfolioView) => void;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

// Trade Button Props
export interface TradeButtonProps {
  type: "buy" | "sell";
  symbol: string;
  name: string;
  price: number;
  change: string;
  region: string;
  investmentType: string;
}

// Holdings
export interface HoldingCategory {
  categoryKey: string;
  investmentType: string;
  region: string;
  totalValue: number;
  totalInvested: number;
  profitLossPercentage: number;
  assets?: Asset[];
}

export interface Asset {
  id: string;
  assetSymbol: string;
  investmentType: string;
  region: string;
  quantity: number;
  purchasePrice: number;
  amountInvested: number;
  currentPrice: number;
  currentValue: number;
  priceChange24h: number;
  percentageChange24h: number;
  marketValue: number;
  profitLoss: number;
  profitLossPercentage: number;
}

// Overview
export interface OverviewDistributionType {
  [type: string]: {
    marketValue: number;
    count: number;
    percentage: number;
  };
}
export interface OverviewDistribution {
  investmentType: OverviewDistributionType;
  region: any;
}
export interface OverviewData {
  totalValue: number;
  totalInvested: number;
  totalProfitLoss: number;
  totalProfitLossPercentage: number;
  monthlyChangePercentage?: number;
  dailyChange?: number;
  dailyChangePercentage?: number;
  performance?: any;
  distribution: OverviewDistribution;
}

// Transactions
export interface Transaction {
  id: string
  type: TransactionType
  assetSymbol: string
  investmentType: InvestmentType
  region: Region
  quantity: number
  price: number
  amount: number
  timestamp: string
}

export interface TransactionsResponse {
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
}

// Market Search Types
export interface MarketSearchMatch {
  symbol: string;
  name: string;
  type: string;
  region: string;
  currency: string;
  price: string;
  changePercentage: string;
}

export interface MarketSearchResponse {
  success: boolean;
  data: {
    bestMatches: MarketSearchMatch[];
  };
}

export interface TradeRequest {
  portfolioId: string;
  assetSymbol: string;
  investmentType: string;
  region: string;
  quantity: number;
  price: number;
} 