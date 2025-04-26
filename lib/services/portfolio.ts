import { 
  CreatePortfolioRequest, 
  CreatePortfolioResponse, 
  GetPortfoliosResponse, 
  PortfolioError,
  ApiPortfoliosResponse,
  ApiCreatePortfolioResponse,
  ApiPortfolioDetailsResponse
} from "../types/portfolio"
import { apiRequest, ApiError } from "./api-client"

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

export async function getPortfolioDetails(portfolioId: string): Promise<ApiPortfolioDetailsResponse> {
  try {
    const response = await apiRequest<ApiPortfolioDetailsResponse>(`/portfolio/${portfolioId}`, {
      method: "GET",
    })
    return response
  } catch (error) {
    if (error instanceof ApiError) {
      throw new PortfolioError(error.message)
    }
    throw new PortfolioError("Failed to fetch portfolio details. Please try again later.")
  }
} 