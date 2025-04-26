import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/lib/contexts/auth-context"
import { PortfolioProvider } from "@/lib/contexts/portfolio-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Finara - AI-Powered Financial Portfolio Platform",
  description: "The Future of Investing — AI-Powered Portfolios",
  generator: "v0.dev",
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <PortfolioProvider>
            {children}
            <Toaster />
            </PortfolioProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
