import { apiRequest } from "./api-client";
import type { MarketSearchResponse } from "../types/portfolio";

export async function searchMarketEquity(keywords: string, region: string) {
  return apiRequest<MarketSearchResponse>(`/market/equity/search?keywords=${encodeURIComponent(keywords)}&region=${encodeURIComponent(region)}`);
}

export async function searchMarketCrypto(keywords: string) {
  return apiRequest<MarketSearchResponse>(`/market/crypto/search?keywords=${encodeURIComponent(keywords)}`);
} 