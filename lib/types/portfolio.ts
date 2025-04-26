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
  Gold = "Gold",
  Cryptocurrency = "Cryptocurrency",
  Equity = "Equity",
  Bonds = "Bonds",
  ETF = "ETF",
  RealEstate = "RealEstate",
  Commodities = "Commodities"
}

export enum Region {
  US = "US",
  India = "India",
  Global = "Global",
  Europe = "Europe",
  Asia = "Asia",
  LatinAmerica = "LatinAmerica"
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

export interface PortfolioOverview {
  totalValue: number
  totalInvested: number
  totalProfitLoss: number
  totalProfitLossPercentage: number
  dailyChange: number
  dailyChangePercentage: number
  weeklyChange: number
  weeklyChangePercentage: number
  monthlyChange: number
  monthlyChangePercentage: number
  yearlyChange: number
  yearlyChangePercentage: number
  distribution: {
    investmentType: {
      [key in InvestmentType]?: {
        percentage: number
        marketValue: number
        count: number
      }
    }
    region: {
      [key in Region]?: {
        percentage: number
        marketValue: number
        count: number
      }
    }
  }
}

export interface PortfolioHoldings {
  assets: AssetHolding[]
  totalAssets: number
  recentTransactions: Transaction[]
}

export interface PortfolioDetailsResponse {
  portfolio: Portfolio
  overview: PortfolioOverview
  holdings: PortfolioHoldings
}

export interface ApiPortfolioDetailsResponse {
  success: boolean
  data: PortfolioDetailsResponse
}

// Error Types
export class PortfolioError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "PortfolioError"
  }
} 