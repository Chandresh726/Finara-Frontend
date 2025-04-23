"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { BarChart3, Menu, Plus, User, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
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

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-finance-500 dark:text-finance-400" />
              <span className="font-bold text-xl">Finara</span>
            </Link>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="hidden md:flex bg-background border border-border hover:bg-muted"
          >
            <Bot className={cn(
              "h-5 w-5",
              isSidebarCollapsed ? "text-muted-foreground" : "text-green-500"
            )} />
            <span className="sr-only">Toggle AI chat</span>
          </Button>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-[180px] justify-between min-w-[180px]">
                  <span>Main Portfolio</span>
                  <span className="opacity-50">▼</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-[180px] w-[180px]">
                <DropdownMenuItem>Main Portfolio</DropdownMenuItem>
                <DropdownMenuItem>Growth Portfolio</DropdownMenuItem>
                <DropdownMenuItem>Retirement Portfolio</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  New Portfolio
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
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
