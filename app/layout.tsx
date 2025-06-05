import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/lib/contexts/auth-context"
import StructuredData from "./structured-data"
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Finara - AI-Powered Financial Portfolio Platform",
  description: "The Future of Investing — AI-Powered Portfolios with advanced analytics, personalized recommendations, and real-time market insights",
  generator: "v0.dev",
  keywords: ["AI investing", "financial portfolio", "investment platform", "wealth management", "AI-powered finance", "portfolio analytics"],
  authors: [{ name: "Finara Team" }],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Finara - AI-Powered Financial Portfolio Platform",
    description: "The Future of Investing — AI-Powered Portfolios with advanced analytics and personalized recommendations",
    url: "https://finara.slope726.in",
    siteName: "Finara",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://finara.slope726.in/",
    languages: {
      'en-US': "https://finara.slope726.in/",
    },
  },
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
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <StructuredData />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <Analytics />
          <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              {children}
              <Toaster />
            </ThemeProvider>
          </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
