"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase } from "../../integrations/supabase/client"
import { cn } from "@/lib/utils"

interface SearchResult {
  id: string
  title: string
  excerpt: string
  type: 'guide' | 'activity' | 'news' | 'real_estate'
  slug: string
  image?: string
  category: string
}

interface SearchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const searchTimeout = setTimeout(async () => {
      setLoading(true)
      try {
        const searchTerm = query.toLowerCase()
        
        // Search guides
        const { data: guides } = await supabase
          .from('guides')
          .select('id, title_en, title_de, short_desc_en, short_desc_de, slug_de, thumbnail')
          .eq('status', 'published')
          .or(`title_en.ilike.%${searchTerm}%,title_de.ilike.%${searchTerm}%,short_desc_en.ilike.%${searchTerm}%,short_desc_de.ilike.%${searchTerm}%`)
          .limit(3)

        // Search activities
        const { data: activities } = await supabase
          .from('activities')
          .select('id, title_en, title_de, description_en, description_de, slug, featured_image')
          .eq('status', 'published')
          .or(`title_en.ilike.%${searchTerm}%,title_de.ilike.%${searchTerm}%,description_en.ilike.%${searchTerm}%,description_de.ilike.%${searchTerm}%`)
          .limit(3)

        // Search news
        const { data: news } = await supabase
          .from('articles')
          .select('id, title, excerpt, slug, cover_image_url')
          .eq('status', 'published')
          .or(`title.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%`)
          .limit(3)

        const searchResults: SearchResult[] = [
          ...(guides || []).map(item => ({
            id: item.id,
            title: item.title_de || item.title_en || '',
            excerpt: item.short_desc_de || item.short_desc_en || '',
            type: 'guide' as const,
            slug: item.slug_de,
            image: item.thumbnail,
            category: 'Guide'
          })),
          ...(activities || []).map(item => ({
            id: item.id,
            title: item.title_de || item.title_en || '',
            excerpt: item.description_de || item.description_en || '',
            type: 'activity' as const,
            slug: item.slug,
            image: item.featured_image,
            category: 'Aktivität'
          })),
          ...(news || []).map(item => ({
            id: item.id,
            title: item.title || '',
            excerpt: item.excerpt || '',
            type: 'news' as const,
            slug: item.slug,
            image: item.cover_image_url,
            category: 'News'
          }))
        ]

        setResults(searchResults)
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(searchTimeout)
  }, [query])

  const handleResultClick = (result: SearchResult) => {
    const paths = {
      guide: '/guide-instagram',
      activity: '/activities',
      news: '/news',
      real_estate: '/real-estate'
    }
    
    router.push(`${paths[result.type]}/${result.slug}`)
    onOpenChange(false)
    setQuery("")
    setResults([])
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      onOpenChange(false)
    }
  }

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  if (!open) return null

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={() => onOpenChange(false)}
    >
      <div 
        className="fixed left-1/2 top-20 w-full max-w-2xl -translate-x-1/2 transform animate-in slide-in-from-top-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-background border rounded-lg shadow-xl mx-4">
          <div className="flex items-center border-b px-4 py-3">
            <Search className="h-4 w-4 text-muted-foreground mr-3" />
            <input
              type="text"
              placeholder="Suchen Sie nach Guides, Aktivitäten, Hotels..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              autoFocus
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 p-0 ml-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {query.trim() && (
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <span className="ml-2 text-sm text-muted-foreground">Suche läuft...</span>
                </div>
              ) : results.length > 0 ? (
                <div className="py-2">
                  {results.map((result) => (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => handleResultClick(result)}
                      className="w-full flex items-start space-x-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
                    >
                      {result.image && (
                        <img
                          src={result.image}
                          alt=""
                          className="w-12 h-12 rounded object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="text-sm font-medium text-foreground truncate">
                            {result.title}
                          </p>
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                            {result.category}
                          </span>
                        </div>
                        {result.excerpt && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {result.excerpt}
                          </p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    Keine Ergebnisse für "{query}" gefunden
                  </p>
                </div>
              )}
            </div>
          )}

          {!query.trim() && (
            <div className="py-8 text-center">
              <p className="text-sm text-muted-foreground">
                Geben Sie einen Suchbegriff ein, um zu beginnen
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
