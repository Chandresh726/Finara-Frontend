"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, User, Bot } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { NewPortfolioDialog } from "./new-portfolio-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/contexts/auth-context"
import { usePortfolio } from "@/lib/contexts/portfolio-context"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface DashboardHeaderProps {
  isSidebarCollapsed: boolean
  onToggleSidebar: () => void
}

export function DashboardHeader({ isSidebarCollapsed, onToggleSidebar }: DashboardHeaderProps) {
  const { logout } = useAuth()
  const { 
    portfolios, 
    selectedPortfolio, 
    selectPortfolio, 
    createPortfolio,
    isLoading 
  } = usePortfolio()

  const hasPortfolios = portfolios?.length > 0

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4">
        {/* Left section with Finara logo */}
        <div className="flex items-center gap-4">
          <Link href="/" className="hidden md:block">
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="Finara Logo" width={30} height={30} className="h-8 w-auto" />
              <span className="font-bold text-2xl">Finara</span>
            </div>
          </Link>
        </div>

        {/* Center section with portfolio selector */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          {isLoading ? (
            <Skeleton className="w-[180px] h-10" />
          ) : hasPortfolios ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-[180px] text-center">
                  <span className="mx-auto">
                    {selectedPortfolio?.title || "Select Portfolio"}
                  </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-[180px]">
                {portfolios.map((portfolio) => (
                  <DropdownMenuItem
                    key={portfolio.id}
                    className="justify-center"
                    onClick={() => selectPortfolio(portfolio)}
                  >
                    {portfolio.title}
                  </DropdownMenuItem>
                ))}
              <DropdownMenuSeparator />
                <NewPortfolioDialog onCreatePortfolio={createPortfolio} />
            </DropdownMenuContent>
          </DropdownMenu>
          ) : (
            <NewPortfolioDialog onCreatePortfolio={createPortfolio}>
              <Button className="w-[180px]">
                <Plus className="mr-2 h-4 w-4" />
                New Portfolio
              </Button>
            </NewPortfolioDialog>
          )}
        </div>

        {/* Right section with theme toggle and user menu */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="md:hidden"
          >
            <Bot className={cn(
              "h-5 w-5",
              isSidebarCollapsed ? "text-muted-foreground" : "text-green-500"
            )} />
            <span className="sr-only">Toggle AI chat</span>
          </Button>

          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
              {/* <DropdownMenuItem>Settings</DropdownMenuItem> */}
              {/* <DropdownMenuItem>Billing</DropdownMenuItem> */}
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <button 
                  onClick={(e) => {
                    e.preventDefault()
                    logout()
                  }} 
                  className="flex w-full"
                >
                  Logout
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
