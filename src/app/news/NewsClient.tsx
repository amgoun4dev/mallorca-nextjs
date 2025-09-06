"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, User, Tag, TrendingUp, Filter, Search, Eye, Zap, Smile, Meh, Frown, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { ImageWithFallback } from "../../components/ui/image-with-fallback";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../../components/ui/pagination";
import { supabase } from '../../integrations/supabase/client';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image_url: string;
  alt_text: string;
  reading_time_minutes: number;
  tags: any; // JSON field from Supabase
  is_featured: boolean;
  tone: string | null; // Allow any string for flexibility
  views: number;
  category_id: string;
  published_at: string;
  category?: {
    name_en: string;
    color: string;
    icon: string;
  };
}

interface TickerArticle {
  title: string;
  slug: string;
}

interface Category {
  id: string;
  name_en: string;
  slug: string;
  color: string;
  icon: string;
  sort_order: number;
}

const NewsClient = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [latestArticles, setLatestArticles] = useState<TickerArticle[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTone, setSelectedTone] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const articlesPerPage = 9;

  useEffect(() => {
    fetchCategories();
    fetchArticles();
    fetchAllTags();
    fetchLatestArticles();
  }, [currentPage, selectedCategory, selectedTone, searchQuery, selectedTags]);

  const fetchLatestArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('title, slug')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(10);
        
      if (error) throw error;
      setLatestArticles(data || []);
    } catch (error) {
      console.error('Error fetching latest articles:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchAllTags = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('tags')
        .eq('status', 'published');
        
      if (error) throw error;
      
      // Count occurrences of each tag
      const tagCounts = new Map<string, number>();
      
      data?.forEach(article => {
        if (article.tags && Array.isArray(article.tags)) {
          article.tags.forEach(tag => {
            if (typeof tag === 'string' && tag.trim()) {
              const count = tagCounts.get(tag) || 0;
              tagCounts.set(tag, count + 1);
            }
          });
        }
      });
      
      // Sort tags by frequency (most used first) and take top 8
      const sortedTags = Array.from(tagCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([tag]) => tag);
      
      setAllTags(sortedTags);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const fetchArticles = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('articles')
        .select(`
          *,
          category:categories(name_en, color, icon)
        `, { count: 'exact' })
        .eq('status', 'published');

      // Apply category filter
      if (selectedCategory !== 'all') {
        query = query.eq('category_id', selectedCategory);
      }

      // Apply search filter
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,tags.cs.["${searchQuery}"]`);
      }

      // Apply tone filter
      if (selectedTone !== 'all') {
        query = query.eq('tone', selectedTone);
      }

      // Apply tag filter
      if (selectedTags.length > 0) {
        // Use OR logic to show articles that contain ANY of the selected tags
        const tagConditions = selectedTags.map(tag => `tags.cs.["${tag}"]`);
        query = query.or(tagConditions.join(','));
      }

      // Default ordering by publication date (newest first)
      query = query.order('published_at', { ascending: false });

      // Apply pagination
      const from = (currentPage - 1) * articlesPerPage;
      const to = from + articlesPerPage - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;
      
      if (error) throw error;
      
      setArticles(data || []);
      setTotalPages(Math.ceil((count || 0) / articlesPerPage));
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const getToneColor = (tone: string | null) => {
    switch (tone) {
      case 'good':
        return 'text-green-500';
      case 'bad':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getToneIcon = (tone: string | null) => {
    switch (tone) {
      case 'good':
        return Smile;
      case 'bad':
        return Frown;
      default:
        return Meh;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-primary text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="relative container mx-auto px-4 text-center">
          <div className="animate-fade-in">
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
              Mallorca News &
              <span className="block bg-gradient-to-r from-white to-accent bg-clip-text text-transparent">
                Hintergrund
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
              Aktuelle Nachrichten, Hintergrundberichte und Stories von der schönsten Insel der Welt.
            </p>
          </div>
        </div>
        
        {/* News Ticker */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/30 backdrop-blur-sm border-t border-white/10 overflow-hidden">
          <div className="py-3">
            <div className="flex items-center whitespace-nowrap animate-[scroll_30s_linear_infinite]">
              <span className="text-white/90 font-medium mr-8 ml-4">🔴 AKTUELLE NEWS:</span>
              {latestArticles.map((article, index) => (
                <span key={article.slug} className="inline-flex items-center">
                  <Link 
                    href={`/news/${article.slug}`}
                    className="text-white hover:text-accent transition-colors duration-200 underline-offset-4 hover:underline mx-8"
                  >
                    {article.title}
                  </Link>
                  {index < latestArticles.length - 1 && (
                    <span className="text-white/60 mx-4">•</span>
                  )}
                </span>
              ))}
              {/* Duplicate content for seamless loop */}
              {latestArticles.map((article, index) => (
                <span key={`duplicate-${article.slug}`} className="inline-flex items-center">
                  <Link 
                    href={`/news/${article.slug}`}
                    className="text-white hover:text-accent transition-colors duration-200 underline-offset-4 hover:underline mx-8"
                  >
                    {article.title}
                  </Link>
                  {index < latestArticles.length - 1 && (
                    <span className="text-white/60 mx-4">•</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-6 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Mobile Filter Toggle Button */}
            <div className="md:hidden mb-4">
              <Button
                onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                variant="outline"
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <Filter className="h-5 w-5 text-primary" />
                  <span>Filter & Suche</span>
                  {(selectedCategory !== 'all' || selectedTone !== 'all' || selectedTags.length > 0 || searchQuery) && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                      {[
                        selectedCategory !== 'all' ? 1 : 0,
                        selectedTone !== 'all' ? 1 : 0,
                        selectedTags.length,
                        searchQuery ? 1 : 0
                      ].reduce((a, b) => a + b, 0)}
                    </Badge>
                  )}
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isMobileFiltersOpen ? 'rotate-180' : ''}`} />
              </Button>
            </div>

            {/* Compact Search & Filter Interface */}
            <div className={`bg-background rounded-2xl shadow-soft border p-6 ${
              !isMobileFiltersOpen ? 'hidden md:block' : ''
            }`}>
              <div className="flex flex-wrap items-center gap-6">
                {/* Search Icon/Input */}
                <div className="flex items-center gap-3">
                  {!isSearchOpen && !searchQuery ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsSearchOpen(true)}
                      className="p-2 hover:bg-primary/10"
                    >
                      <Search className="h-5 w-5 text-primary" />
                    </Button>
                  ) : (
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary h-4 w-4" />
                      <Input
                        id="search-input"
                        placeholder="Artikel durchsuchen..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        onBlur={() => {
                          if (!searchQuery) {
                            setIsSearchOpen(false);
                          }
                        }}
                        className="pl-10 pr-8 py-2 w-64 text-sm"
                        autoFocus
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSearchQuery('');
                          setIsSearchOpen(false);
                        }}
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1 h-6 w-6"
                      >
                        ✕
                      </Button>
                    </div>
                  )}
                </div>

                {/* Mood Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">Stimmung:</span>
                  <div className="flex gap-1">
                    <Button
                      variant={selectedTone === 'good' || selectedTone === 'all' ? 'outline' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedTone(selectedTone === 'good' ? 'all' : 'good')}
                      className={`p-2 transition-all hover:scale-105 ${
                        selectedTone === 'good' || selectedTone === 'all' 
                          ? 'bg-primary/20 border-primary/50 text-primary' 
                          : ''
                      }`}
                    >
                      <Smile className="h-4 w-4 text-green-500" />
                    </Button>
                    <Button
                      variant={selectedTone === 'neutral' || selectedTone === 'all' ? 'outline' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedTone(selectedTone === 'neutral' ? 'all' : 'neutral')}
                      className={`p-2 transition-all hover:scale-105 ${
                        selectedTone === 'neutral' || selectedTone === 'all' 
                          ? 'bg-primary/20 border-primary/50 text-primary' 
                          : ''
                      }`}
                    >
                      <Meh className="h-4 w-4 text-gray-500" />
                    </Button>
                    <Button
                      variant={selectedTone === 'bad' || selectedTone === 'all' ? 'outline' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedTone(selectedTone === 'bad' ? 'all' : 'bad')}
                      className={`p-2 transition-all hover:scale-105 ${
                        selectedTone === 'bad' || selectedTone === 'all' 
                          ? 'bg-primary/20 border-primary/50 text-primary' 
                          : ''
                      }`}
                    >
                      <Frown className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>

                {/* Category Filter */}
                <div className="flex items-center gap-2">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-40 h-9">
                      <SelectValue placeholder="Alle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle Kategorien</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-2 h-2 rounded-full" 
                              style={{ backgroundColor: category.color }}
                            />
                            <span className="text-sm">{category.name_en}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Top 5 Topics */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-muted-foreground">Aktuelle Themen:</span>
                  {allTags.slice(0, 5).map(tag => (
                    <Button 
                      key={tag} 
                      variant={selectedTags.includes(tag) ? "default" : "outline"} 
                      size="sm" 
                      onClick={() => toggleTag(tag)} 
                      className="text-xs px-3 py-1 h-7 rounded-full transition-all hover:scale-105"
                    >
                      {tag}
                    </Button>
                  ))}
                </div>

                {/* Reset Filters */}
                {(selectedCategory !== 'all' || selectedTone !== 'all' || selectedTags.length > 0 || searchQuery) && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedTone('all');
                      setSelectedTags([]);
                      setSearchQuery('');
                      setIsSearchOpen(false);
                    }}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Filter zurücksetzen
                  </Button>
                )}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden animate-pulse">
                  <div className="aspect-video bg-muted"></div>
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-6 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map(article => {
                const ToneIcon = getToneIcon(article.tone);
                return (
                  <Card key={article.id} className="group overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 cursor-pointer">
                    <Link href={`/news/${article.slug}`}>
                      <div className="relative aspect-video overflow-hidden">
                        <ImageWithFallback 
                          src={article.cover_image_url || ''} 
                          alt={article.alt_text || article.title} 
                          fallbackSrc="https://olrieidgokcnhhymksnf.supabase.co/storage/v1/object/public/general-images/mallorcamagic_fallback.jpg" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                        
                        {/* Category Badge */}
                        {article.category && (
                          <div className="absolute top-4 left-4">
                            <Badge 
                              variant="secondary" 
                              className="bg-white/20 text-white border-white/30" 
                              style={{ backgroundColor: article.category.color + '20' }}
                            >
                              {article.category.name_en}
                            </Badge>
                          </div>
                        )}

                        {/* Featured Badge */}
                        {article.is_featured && (
                          <div className="absolute top-4 right-4">
                            <Badge className="bg-accent text-accent-foreground">
                              Empfohlen
                            </Badge>
                          </div>
                        )}

                        {/* Tone Indicator */}
                        {article.tone && (
                          <div className={`absolute bottom-4 right-4 ${getToneColor(article.tone)}`}>
                            <ToneIcon className="h-5 w-5" />
                          </div>
                        )}

                        <div className="absolute bottom-4 left-4 text-white">
                          <div className="text-sm">{formatDate(article.published_at)}</div>
                          <div className="text-xs opacity-80">{article.reading_time_minutes} Min. Lesezeit</div>
                        </div>
                      </div>

                      <CardContent className="p-6">
                        <h3 className="font-display text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {article.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                            <Eye className="h-4 w-4" />
                            <span>{article.views}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{article.reading_time_minutes} Min.</span>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1">
                          {article.tags?.slice(0, 3).map((tag: string) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className={`gap-1 pl-2.5 ${currentPage <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
                      size="default"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span>Zurück</span>
                    </PaginationLink>
                  </PaginationItem>
                  
                  {(() => {
                    const maxVisiblePages = typeof window !== 'undefined' && window.innerWidth < 768 ? 3 : 6;
                    const startPage = Math.max(1, Math.min(currentPage - Math.floor(maxVisiblePages / 2), totalPages - maxVisiblePages + 1));
                    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
                    
                    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(pageNum => (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => setCurrentPage(pageNum)}
                          isActive={currentPage === pageNum}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    ));
                  })()}

                  <PaginationItem>
                    <PaginationLink
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className={`gap-1 pr-2.5 ${currentPage >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
                      size="default"
                    >
                      <span>Weiter</span>
                      <ChevronRight className="h-4 w-4" />
                    </PaginationLink>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/5 rounded-full animate-float"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-accent/20 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative container mx-auto px-4 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Bleiben Sie informiert
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Abonnieren Sie unseren Newsletter und verpassen Sie keine wichtigen Nachrichten mehr.
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <Input 
              placeholder="Ihre E-Mail-Adresse" 
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60" 
            />
            <Button 
              size="default" 
              className="bg-white text-primary hover:bg-white/90 font-semibold"
            >
              Abonnieren
            </Button>
          </div>
          <p className="text-sm text-white/70 mt-4">
            Kein Spam, jederzeit abbestellbar.
          </p>
        </div>
      </section>
    </div>
  );
};

export default NewsClient;