"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Portfolio, PortfolioError } from '../types/portfolio'
import { getPortfolios, createPortfolio as createPortfolioApi, getPortfolioOverview, getPortfolioHoldings, getPortfolioHoldingsByCategory, getPortfolioTransactions } from '../services/portfolio'
import { useToast } from '@/components/ui/use-toast'
import type { OverviewData, HoldingCategory, Asset, Transaction, TransactionsResponse } from '../types/portfolio'

interface PortfolioContextType {
  portfolios: Portfolio[]
  selectedPortfolio: Portfolio | null
  isLoading: boolean
  error: string | null
  selectPortfolio: (portfolio: Portfolio) => void
  createPortfolio: (title: string, description: string) => Promise<void>
  refreshPortfolios: () => Promise<void>
  overviewData: OverviewData | null
  holdings: HoldingCategory[] | null
  assetsByCategory: { [categoryKey: string]: Asset[] } | null
  transactions: Transaction[] | null
  transactionsTotal: number
  transactionsPage: number
  loadingStates: { overview: boolean, holdings: boolean, transactions: boolean, isInitialLoad: boolean }
  fetchOverview: () => Promise<void>
  fetchHoldings: () => Promise<void>
  fetchAssetsByCategory: (categoryKey: string, investmentType: string, region: string) => Promise<void>
  fetchTransactions: (page: number) => Promise<void>
  setTransactionsPage: (page: number) => void
  refreshOverview: () => Promise<void>
  refreshHoldings: () => Promise<void>
  refreshTransactions: () => Promise<void>
  refreshAll: () => Promise<void>
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined)

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const [overviewData, setOverviewData] = useState<OverviewData | null>(null)
  const [holdings, setHoldings] = useState<HoldingCategory[] | null>(null)
  const [assetsByCategory, setAssetsByCategory] = useState<{ [categoryKey: string]: Asset[] } | null>(null)
  const [transactions, setTransactions] = useState<Transaction[] | null>(null)
  const [transactionsTotal, setTransactionsTotal] = useState(0)
  const [transactionsPage, setTransactionsPage] = useState(1)
  const TRANSACTIONS_LIMIT = 10
  const [loadingStates, setLoadingStates] = useState({ 
    overview: false, 
    holdings: false, 
    transactions: false,
    isInitialLoad: true // Add flag for initial load
  })

  const refreshPortfolios = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await getPortfolios()
      setPortfolios(response.portfolios)
      
      // Select first portfolio if none selected and fetch its details
      if (!selectedPortfolio && response.portfolios.length > 0) {
        const firstPortfolio = response.portfolios[0];
        setSelectedPortfolio(firstPortfolio);
      }
    } catch (err) {
      const message = err instanceof PortfolioError ? err.message : 'Failed to fetch portfolios'
      setError(message)
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const createPortfolio = async (title: string, description: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await createPortfolioApi({ title, description })
      const newPortfolio = response.portfolio
      
      // Add new portfolio to list and select it
      setPortfolios(prev => [...prev, newPortfolio])
      setSelectedPortfolio(newPortfolio)
      
      toast({
        title: "Success",
        description: "Portfolio created successfully",
      })
    } catch (err) {
      const message = err instanceof PortfolioError ? err.message : 'Failed to create portfolio'
      setError(message)
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      })
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const selectPortfolio = async (portfolio: Portfolio) => {
    setSelectedPortfolio(portfolio)
  }

  // Fetch overview data
  const fetchOverview = async () => {
    if (!selectedPortfolio) return
    if (loadingStates.isInitialLoad) {
      setLoadingStates(s => ({ ...s, overview: true }))
    }
    try {
      const data = await getPortfolioOverview(selectedPortfolio.id)
      setOverviewData(data)
    } catch (err) {
      setOverviewData(null)
    } finally {
      setLoadingStates(s => ({ ...s, overview: false, isInitialLoad: false }))
    }
  }

  // Fetch all holdings categories data
  const fetchAllHoldingsCategory = async (holdingsData: HoldingCategory[]) => {
    if (!selectedPortfolio) return;
    try {
      // Only fetch category details using existing holdings data
      await Promise.all(
        holdingsData.map(cat =>
          getPortfolioHoldingsByCategory(selectedPortfolio.id, cat.investmentType, cat.region)
            .then(categoryData => {
              const found = categoryData.find(c => c.categoryKey === cat.categoryKey);
              setAssetsByCategory(prev => ({
                ...prev,
                [cat.categoryKey]: found && Array.isArray(found.assets) ? found.assets : []
              }));
            })
        )
      );
    } catch (err) {
      console.error('Error fetching holdings categories:', err);
      setAssetsByCategory({});
    }
  };

  // Fetch holdings data
  const fetchHoldings = async () => {
    if (!selectedPortfolio) return;
    if (loadingStates.isInitialLoad) {
      setLoadingStates(s => ({ ...s, holdings: true }));
    }
    try {
      const data = await getPortfolioHoldings(selectedPortfolio.id);
      setHoldings(data);
      // Pass the fresh data directly to ensure category fetch has latest holdings
      await fetchAllHoldingsCategory(data);
    } catch (err) {
      setHoldings([]);
      setAssetsByCategory({});
    } finally {
      setLoadingStates(s => ({ ...s, holdings: false, isInitialLoad: false }));
    }
  };

  // Fetch assets for a category
  const fetchAssetsByCategory = async (categoryKey: string, investmentType: string, region: string) => {
    if (!selectedPortfolio) return
    setLoadingStates(s => ({ ...s, holdings: true }))
    try {
      const data = await getPortfolioHoldingsByCategory(selectedPortfolio.id, investmentType, region)
      const cat = data.find(c => c.categoryKey === categoryKey)
      setAssetsByCategory(prev => ({ ...prev, [categoryKey]: cat && Array.isArray(cat.assets) ? cat.assets : [] }))
    } catch (err) {
      setAssetsByCategory(prev => ({ ...prev, [categoryKey]: [] }))
    } finally {
      setLoadingStates(s => ({ ...s, holdings: false }))
    }
  }

  // Fetch transactions (paginated)
  const fetchTransactions = async (page: number) => {
    if (!selectedPortfolio) return
    setLoadingStates(s => ({ ...s, transactions: true }))
    try {
      const data: TransactionsResponse = await getPortfolioTransactions(selectedPortfolio.id, page, TRANSACTIONS_LIMIT)
      setTransactions(data.transactions)
      setTransactionsTotal(data.total)
      setTransactionsPage(page)
    } catch (err) {
      setTransactions([])
      setTransactionsTotal(0)
    } finally {
      setLoadingStates(s => ({ ...s, transactions: false }))
    }
  }

  // Refresh overview data only
  const refreshOverview = async () => {
    if (!selectedPortfolio) return;
    try {
      await fetchOverview();
    } catch (err) {
      const message = err instanceof PortfolioError ? err.message : 'Failed to refresh overview'
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      })
    }
  }

  // Refresh holdings data only
  const refreshHoldings = async () => {
    if (!selectedPortfolio) return;
    try {
      await fetchHoldings();
    } catch (err) {
      const message = err instanceof PortfolioError ? err.message : 'Failed to refresh holdings'
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      })
    }
  }

  // Refresh transactions data only
  const refreshTransactions = async () => {
    if (!selectedPortfolio) return;
    try {
      await fetchTransactions(transactionsPage);
    } catch (err) {
      const message = err instanceof PortfolioError ? err.message : 'Failed to refresh transactions'
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      })
    }
  }

  // Refresh all data
  const refreshAll = async () => {
    await Promise.allSettled([
      refreshOverview(),
      refreshHoldings(),
      refreshTransactions()
    ]);
  }

  // When selectedPortfolio changes, clear cached data and refetch
  useEffect(() => {
    setOverviewData(null)
    setHoldings(null)
    setAssetsByCategory(null)
    setTransactions(null)
    setTransactionsTotal(0)
    setTransactionsPage(1)
    setLoadingStates(s => ({ ...s, isInitialLoad: true })) // Reset initial load flag
    if (selectedPortfolio) {
      fetchOverview()
      fetchHoldings()
      fetchTransactions(1)  // Always fetch first page on portfolio change

      const intervalId = setInterval(() => {
        // Refresh both overview and holdings data
        refreshOverview().catch(err => console.error('Failed to refresh overview:', err));
        refreshHoldings().catch(err => console.error('Failed to refresh holdings:', err));
      }, 60000); // 1 minute

      return () => clearInterval(intervalId);
    }
  }, [selectedPortfolio])

  useEffect(() => {
    refreshPortfolios()
  }, [])

  return (
    <PortfolioContext.Provider
      value={{
        portfolios,
        selectedPortfolio,
        isLoading,
        error,
        selectPortfolio,
        createPortfolio,
        refreshPortfolios,
        overviewData,
        holdings,
        assetsByCategory,
        transactions,
        transactionsTotal,
        transactionsPage,
        loadingStates,
        fetchOverview,
        fetchHoldings,
        fetchAssetsByCategory,
        fetchTransactions,
        setTransactionsPage,
        refreshOverview,
        refreshHoldings,
        refreshTransactions,
        refreshAll,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  )
}

export function usePortfolio() {
  const context = useContext(PortfolioContext)
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider')
  }
  return context
}