import { Suspense } from "react"
import { About } from "@/components/landing/about"
import { DashboardPreview } from "@/components/landing/dashboard-preview"
import { Features } from "@/components/landing/features"
import { Footer } from "@/components/landing/footer"
import { Hero } from "@/components/landing/hero"
import { Navbar } from "@/components/landing/navbar"
import { Pricing } from "@/components/landing/pricing"
import { Skeleton } from "@/components/ui/skeleton"

// Enable Partial Prerendering for the landing page
export const dynamic = "force-static"
export const revalidate = 3600 // Revalidate every hour

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <Suspense
        fallback={
          <div className="h-[600px] flex items-center justify-center">
            <Skeleton className="h-[500px] w-full max-w-5xl mx-auto" />
          </div>
        }
      >
        <DashboardPreview />
      </Suspense>
      <Pricing />
      <Suspense
        fallback={
          <div className="h-[600px] flex items-center justify-center">
            <Skeleton className="h-[500px] w-full max-w-5xl mx-auto" />
          </div>
        }
      >
        <About />
      </Suspense>
      <Footer />
    </main>
  )
}
