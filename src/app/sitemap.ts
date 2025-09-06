import { MetadataRoute } from 'next'
import { unstable_cache } from 'next/cache'
import { supabase } from '../integrations/supabase/client'

// Cache the sitemap data for 1 hour
const getCachedSitemapData = unstable_cache(
  async () => {
    try {
      const [{ data: guides }, { data: activities }, { data: articles }] = await Promise.all([
        supabase
          .from('guides')
          .select('slug_de, updated_at')
          .eq('status', 'published')
          .order('updated_at', { ascending: false })
          .limit(500),
        supabase
          .from('activities')
          .select('slug, updated_at')
          .eq('status', 'published')
          .order('updated_at', { ascending: false })
          .limit(500),
        supabase
          .from('articles')
          .select('slug, updated_at')
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .limit(1000),
      ])

      return { guides: guides || [], activities: activities || [], articles: articles || [] }
    } catch (error) {
      console.error('Error fetching sitemap data:', error)
      return { guides: [], activities: [], articles: [] }
    }
  },
  ['sitemap-data'],
  {
    tags: ['sitemap'],
    revalidate: 3600, // 1 hour
  }
)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mallorcamagic.de'
  const currentDate = new Date().toISOString()

  // Static routes with proper priorities and change frequencies
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/activities`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/guide-instagram`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: currentDate,
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  // Get cached dynamic data
  const { guides, activities, articles } = await getCachedSitemapData()

  // Build dynamic URLs
  const dynamicRoutes: MetadataRoute.Sitemap = []

  // Add guide URLs
  guides.forEach((guide: any) => {
    if (guide.slug_de) {
      dynamicRoutes.push({
        url: `${baseUrl}/guide-instagram/${guide.slug_de}`,
        lastModified: guide.updated_at || currentDate,
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    }
  })

  // Add activity URLs
  activities.forEach((activity: any) => {
    if (activity.slug) {
      dynamicRoutes.push({
        url: `${baseUrl}/activities/${activity.slug}`,
        lastModified: activity.updated_at || currentDate,
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    }
  })

  // Add article URLs
  articles.forEach((article: any) => {
    if (article.slug) {
      dynamicRoutes.push({
        url: `${baseUrl}/news/${article.slug}`,
        lastModified: article.updated_at || currentDate,
        changeFrequency: 'daily',
        priority: 0.8,
      })
    }
  })

  return [...staticRoutes, ...dynamicRoutes]
}

// Export revalidation function for manual cache updates
export const revalidateSitemap = async () => {
  const { revalidateTag } = await import('next/cache')
  revalidateTag('sitemap')
}
