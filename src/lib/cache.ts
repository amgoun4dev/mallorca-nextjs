import { revalidateTag, revalidatePath } from 'next/cache'

/**
 * Cache tags used throughout the application
 */
export const CACHE_TAGS = {
  ACTIVITIES: 'activities',
  GUIDES: 'guides',
  NEWS: 'news',
  ARTICLES: 'articles',
  CATEGORIES: 'categories',
  SITEMAP: 'sitemap',
  STATS: 'stats',
} as const

/**
 * Cache durations in seconds
 */
export const CACHE_DURATIONS = {
  SHORT: 300,      // 5 minutes
  MEDIUM: 1800,    // 30 minutes
  LONG: 3600,      // 1 hour
  VERY_LONG: 86400 // 24 hours
} as const

/**
 * Revalidate specific content types
 */
export const revalidateContent = {
  activities: () => revalidateTag(CACHE_TAGS.ACTIVITIES),
  guides: () => revalidateTag(CACHE_TAGS.GUIDES),
  news: () => revalidateTag(CACHE_TAGS.NEWS),
  articles: () => revalidateTag(CACHE_TAGS.ARTICLES),
  categories: () => revalidateTag(CACHE_TAGS.CATEGORIES),
  sitemap: () => revalidateTag(CACHE_TAGS.SITEMAP),
  stats: () => revalidateTag(CACHE_TAGS.STATS),
}

/**
 * Revalidate specific paths
 */
export const revalidatePages = {
  home: () => revalidatePath('/'),
  activities: () => revalidatePath('/activities'),
  guides: () => revalidatePath('/guide-instagram'),
  news: () => revalidatePath('/news'),
  activityDetail: (slug: string) => revalidatePath(`/activities/${slug}`),
  guideDetail: (slug: string) => revalidatePath(`/guide-instagram/${slug}`),
  newsDetail: (slug: string) => revalidatePath(`/news/${slug}`),
}

/**
 * Revalidate all content (use sparingly)
 */
export const revalidateAll = () => {
  Object.values(CACHE_TAGS).forEach(tag => revalidateTag(tag))
  revalidatePath('/', 'layout')
}

/**
 * Cache key generators for consistent cache keys
 */
export const cacheKeys = {
  activities: (filters?: Record<string, any>) => 
    filters ? `activities-${JSON.stringify(filters)}` : 'activities-list',
  guides: (filters?: Record<string, any>) => 
    filters ? `guides-${JSON.stringify(filters)}` : 'guides-list',
  articles: (filters?: Record<string, any>) => 
    filters ? `articles-${JSON.stringify(filters)}` : 'articles-list',
  categories: (type?: string) => 
    type ? `categories-${type}` : 'categories-all',
  stats: () => 'site-stats',
  sitemap: () => 'sitemap-data',
}
