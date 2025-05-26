import { MetadataRoute } from 'next'

type Route = {
  path: string
  lastModified?: string | Date
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://finara.com' // Replace with your actual domain

  // Define static routes with their metadata
  const staticRoutes: Route[] = [
    {
      path: '',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      path: '/login',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      path: '/signup',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      path: '/dashboard',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      path: '/profile',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // You can add dynamic routes here by fetching data from your API
  // For example, if you have portfolio pages with unique IDs:
  // const portfolios = await fetchPortfolios()
  // const portfolioRoutes = portfolios.map(portfolio => ({
  //   path: `/portfolio/${portfolio.id}`,
  //   lastModified: portfolio.updatedAt,
  //   changeFrequency: 'daily',
  //   priority: 0.8,
  // }))

  // Format routes for sitemap
  const routes = staticRoutes.map(({ path, ...route }) => ({
    url: `${baseUrl}${path}`,
    ...route,
  }))

  // Add dynamic routes when you have them
  // routes.push(...portfolioRoutes.map(({ path, ...route }) => ({
  //   url: `${baseUrl}${path}`,
  //   ...route,
  // })))

  return routes
}
