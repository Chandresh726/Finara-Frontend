"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { BarChart3, Plus, User, Bot } from "lucide-react"
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
import { cn } from "@/lib/utils"

interface DashboardHeaderProps {
  isSidebarCollapsed: boolean
  onToggleSidebar: () => void
}

export function DashboardHeader({ isSidebarCollapsed, onToggleSidebar }: DashboardHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { logout } = useAuth()

  const handleCreatePortfolio = (title: string, description: string) => {
    // Handle portfolio creation here
    console.log('Creating portfolio:', { title, description })
  }

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4">
        {/* Left section with Finara logo */}
        <div className="flex items-center gap-4">
          <Link href="/" className="hidden md:block">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-finance-500 dark:text-finance-400" />
              <span className="font-bold text-2xl">Finara</span>
            </div>
          </Link>
        </div>

        {/* Center section with portfolio selector */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-[180px] text-center">
                <span className="mx-auto">Main Portfolio</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-[180px]">
              <DropdownMenuItem className="justify-center">Main Portfolio</DropdownMenuItem>
              <DropdownMenuItem className="justify-center">Growth Portfolio</DropdownMenuItem>
              <DropdownMenuItem className="justify-center">Retirement Portfolio</DropdownMenuItem>
              <DropdownMenuSeparator />
              <NewPortfolioDialog onCreatePortfolio={handleCreatePortfolio} />
            </DropdownMenuContent>
          </DropdownMenu>
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
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
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
