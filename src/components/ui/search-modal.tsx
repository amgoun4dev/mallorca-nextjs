"use client"

import * as React from "react"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SearchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = React.useState("")

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false)
      }
    }

    if (open) {
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "unset"
    }
  }, [open, onOpenChange])

  if (!open) return null

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-modal-title"
    >
      <div className="fixed left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 transform">
        <div className="bg-background border rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 id="search-modal-title" className="text-lg font-semibold">Suche</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 p-0"
              aria-label="Suche schließen"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Suche nach Guides, Aktivitäten, News..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              autoFocus
              aria-label="Suchbegriff eingeben"
              aria-describedby="search-results"
            />
          </div>
          
          {searchQuery && (
            <div id="search-results" className="mt-4 text-sm text-muted-foreground" role="status" aria-live="polite">
              Suchergebnisse für "{searchQuery}" werden hier angezeigt...
            </div>
          )}
          
          <div className="mt-6 flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Abbrechen
            </Button>
            <Button onClick={() => {
              // TODO: Implement search functionality
              console.log("Searching for:", searchQuery)
            }}>
              Suchen
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
