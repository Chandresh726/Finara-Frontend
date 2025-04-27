"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Portfolio, PortfolioError, PortfolioDetailsResponse } from '../types/portfolio'
import { getPortfolios, createPortfolio as createPortfolioApi, getPortfolioDetails } from '../services/portfolio'
import { useToast } from '@/components/ui/use-toast'

interface PortfolioContextType {
  portfolios: Portfolio[]
  selectedPortfolio: Portfolio | null
  portfolioDetails: PortfolioDetailsResponse | null
  isLoading: boolean
  error: string | null
  selectPortfolio: (portfolio: Portfolio) => void
  createPortfolio: (title: string, description: string) => Promise<void>
  refreshPortfolios: () => Promise<void>
  fetchPortfolioDetails: (portfolioId: string) => Promise<void>
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined)

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

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

  useEffect(() => {
    refreshPortfolios()
  }, [])

  return (
    <PortfolioContext.Provider
      value={{
        portfolios,
        selectedPortfolio,
        portfolioDetails: null,
        isLoading,
        error,
        selectPortfolio,
        createPortfolio,
        refreshPortfolios,
        fetchPortfolioDetails: async () => {},
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