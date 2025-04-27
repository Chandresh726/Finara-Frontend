import { 
  CreatePortfolioRequest, 
  CreatePortfolioResponse, 
  GetPortfoliosResponse, 
  ApiPortfoliosResponse,
  ApiCreatePortfolioResponse,
  PortfolioError,
} from "../types/portfolio"
import { apiRequest, ApiError } from "./api-client"
import type { HoldingCategory, OverviewData, TransactionsResponse } from "../types/portfolio"

export async function getPortfolios(): Promise<GetPortfoliosResponse> {
  try {
    const response = await apiRequest<ApiPortfoliosResponse>("/portfolio", {
      method: "GET",
    })
    // Transform API response to match our type
    return {
      portfolios: response.data || []
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw new PortfolioError(error.message)
    }
    throw new PortfolioError("Failed to connect to the server. Please try again later.")
  }
}

export async function createPortfolio(data: CreatePortfolioRequest): Promise<CreatePortfolioResponse> {
  try {
    const response = await apiRequest<ApiCreatePortfolioResponse>("/portfolio/create", {
      method: "POST",
      body: JSON.stringify(data),
    })
    // Transform API response to match our type
    return {
      portfolio: response.data
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw new PortfolioError(error.message)
    }
    throw new PortfolioError("Failed to connect to the server. Please try again later.")
  }
}

export async function getPortfolioHoldings(portfolioId: string): Promise<HoldingCategory[]> {
  try {
    const response = await apiRequest<{ success: boolean; data: HoldingCategory[] }>(`/portfolio/holdings/${portfolioId}`);
    return response.data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw new PortfolioError(error.message);
    }
    throw new PortfolioError("Failed to fetch portfolio holdings.");
  }
}

export async function getPortfolioHoldingsByCategory(portfolioId: string, investmentType: string, region: string): Promise<HoldingCategory[]> {
  try {
    const response = await apiRequest<{ success: boolean; data: HoldingCategory[] }>(
      `/portfolio/holdings/${portfolioId}?type=${encodeURIComponent(investmentType)}&region=${encodeURIComponent(region)}`
    );
    return response.data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw new PortfolioError(error.message);
    }
    throw new PortfolioError("Failed to fetch portfolio holdings by category.");
  }
}

export async function getPortfolioOverview(portfolioId: string): Promise<OverviewData> {
  try {
    const response = await apiRequest<{ success: boolean; data: OverviewData }>(`/portfolio/overview/${portfolioId}`);
    return response.data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw new PortfolioError(error.message);
    }
    throw new PortfolioError("Failed to fetch portfolio overview.");
  }
}

export async function getPortfolioTransactions(portfolioId: string, page: number, limit: number): Promise<TransactionsResponse> {
  try {
    const response = await apiRequest<{ success: boolean; data: TransactionsResponse }>(
      `/portfolio/transactions/${portfolioId}?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw new PortfolioError(error.message);
    }
    throw new PortfolioError("Failed to fetch portfolio transactions.");
  }
}