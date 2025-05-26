import type React from "react"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import Link from "next/link"
import Image from "next/image"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Brand/Image */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-primary p-8 flex-col justify-between">
        <div>
          <Link href="/" className="flex items-center gap-2 text-white">
            <Image src="/logo.png" alt="Finara Logo" width={30} height={30} className="h-8 w-auto" />
            <span className="font-bold text-xl">Finara</span>
          </Link>
        </div>

        <div className="relative h-full flex items-center justify-center">
          <div className="absolute inset-0" />
          <div className="relative z-10 text-white max-w-md">
            <h1 className="text-3xl font-bold mb-4">Transform Your Financial Future</h1>
            <p className="text-white/80">
              Join thousands of investors using AI to optimize their portfolios and achieve their financial goals.
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center text-white/80">
          <div>
            <p>&copy; {new Date().getFullYear()} Finara</p>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center p-4 md:hidden">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Finara Logo" width={30} height={30} className="h-8 w-auto" />
            <span className="font-bold text-xl">Finara</span>
          </Link>
          <ThemeToggle />
        </div>

        <div className="flex-1 flex items-center justify-center p-4">{children}</div>
      </div>
    </div>
  )
}
