"use client";
import { useState, useEffect } from "react";
import { Search, Filter, MapPin, Clock, Star, Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { ImageWithFallback } from "../../components/ui/image-with-fallback";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../../components/ui/select";
import { supabase } from "../../integrations/supabase/client";

interface Guide {
  id: string;
  title_en: string;
  title_de: string;
  title_es: string;
  slug_de: string;
  excerpt_de: string;
  long_desc_de: string;
  short_desc_de: string;
  location: string;
  category: string;
  category_id: string;
  thumbnail_sm: string;
  storage_title_image: string;
  featured_image: string;
  thumbnail: string;
  highlighted: boolean;
  is_featured: boolean;
  reading_time: number;
  view_count: number;
  created_at: string;
  status: string;
}

interface Category {
  id: string;
  name_de: string;
  name_en: string;
  sort_order: number;
}

export default function GuidesClient() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [displayedCount, setDisplayedCount] = useState(30);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Define allowed categories
      const allowedCategories = ['Hotels', 'Orte', 'Essen & Trinken', 'Restaurants', 'Entspannung', 'Dienstleistungen', 'Aktivitäten'];

      // Fetch guides and categories in parallel
      const [guidesResponse, categoriesResponse] = await Promise.all([
        supabase
          .from('guides')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false }),
        supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .in('name_de', allowedCategories)
          .order('sort_order', { ascending: true })
      ]);

      if (guidesResponse.error) {
        console.error('Error fetching guides:', guidesResponse.error);
        return;
      }

      if (categoriesResponse.error) {
        console.error('Error fetching categories:', categoriesResponse.error);
        return;
      }

      setGuides(guidesResponse.data || []);
      
      // Add "Alle" option at the beginning
      const allCategories = [
        { id: 'all', name_de: 'Alle', name_en: 'All', sort_order: 0 },
        ...(categoriesResponse.data || [])
      ];
      setCategories(allCategories);

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGuideImage = (guide: Guide) => {
    console.log('Guide:', guide.title_en, 'thumbnail_sm:', guide.thumbnail_sm, 'storage_title_image:', guide.storage_title_image);
    
    // Check for storage images first, then legacy images
    if (guide.storage_title_image) {
      // Check if it's already a full URL
      const url = guide.storage_title_image.startsWith('http') 
        ? guide.storage_title_image 
        : `https://olrieidgokcnhhymksnf.supabase.co/storage/v1/object/public/guide-title-images/${guide.storage_title_image}`;
      
      // Fix double slash issue
      const cleanUrl = url.replace('guide-title-images//', 'guide-title-images/');
      
      // Check if it's just an empty filename
      if (cleanUrl.endsWith('guide-title-images/') || cleanUrl.endsWith('guide-title-images')) {
        console.log('Empty storage_title_image filename detected, trying thumbnail_sm');
      } else {
        console.log('Using storage_title_image:', cleanUrl);
        return cleanUrl;
      }
    }
    
    // Handle thumbnail_sm
    if (guide.thumbnail_sm) {
      // Fix double slash issue in storage URLs
      let imageUrl = guide.thumbnail_sm;
      if (imageUrl.includes('guide-title-images//')) {
        imageUrl = imageUrl.replace('guide-title-images//', 'guide-title-images/');
      }
      // Check if it's just an empty filename
      if (imageUrl.endsWith('guide-title-images/') || imageUrl.endsWith('guide-title-images')) {
        console.log('Empty thumbnail_sm filename detected, using fallback');
        return null; // Use fallback for empty filenames
      }
      console.log('Using thumbnail_sm:', imageUrl);
      return imageUrl;
    }
    
    if (guide.featured_image) {
      console.log('Using featured_image:', guide.featured_image);
      return guide.featured_image;
    }
    
    // Handle thumbnail
    if (guide.thumbnail) {
      let imageUrl = guide.thumbnail;
      // Fix double slash issue in storage URLs
      if (imageUrl.includes('guide-title-images//')) {
        imageUrl = imageUrl.replace('guide-title-images//', 'guide-title-images/');
      }
      // Check if it's just an empty filename
      if (imageUrl.endsWith('guide-title-images/') || imageUrl.endsWith('guide-title-images')) {
        console.log('Empty thumbnail filename detected, using fallback');
        return null; // Use fallback for empty filenames
      }
      
      // Handle comma-separated thumbnails
      const thumbnails = imageUrl.split(', ');
      console.log('Using thumbnail:', thumbnails[0]);
      return thumbnails[0];
    }
    
    console.log('No image found, using fallback');
    return null; // Let ImageWithFallback handle the fallback
  };

  const getFallbackImage = (guide: Guide) => {
    // Use the unified fallback image for all guides
    return "https://olrieidgokcnhhymksnf.supabase.co/storage/v1/object/public/general-images/mallorcamagic_fallback.jpg";
  };

  const getGuideCategories = (guide: Guide) => {
    if (guide.category) {
      return guide.category.split(',').map(cat => cat.trim());
    }
    return [];
  };

  const getReadingTime = (guide: Guide) => {
    return guide.reading_time || 5;
  };

  const getExcerpt = (guide: Guide) => {
    return guide.excerpt_de || guide.long_desc_de || guide.short_desc_de || 'Entdecken Sie diesen erstaunlichen Guide, um versteckte Juwelen in Mallorca zu finden.';
  };

  const filteredGuides = guides
    .filter((guide) => {
      const matchesSearch = 
        guide.title_en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guide.title_de?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guide.title_es?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getExcerpt(guide).toLowerCase().includes(searchTerm.toLowerCase()) ||
        guide.location?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === "all" || 
        guide.category_id === selectedCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return (b.view_count || 0) - (a.view_count || 0);
        case "reading-time":
          return getReadingTime(a) - getReadingTime(b);
        default: // newest
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  const featuredGuides = filteredGuides.filter(guide => guide.highlighted || guide.is_featured);
  const displayedGuides = filteredGuides.slice(0, displayedCount);
  const hasMoreGuides = filteredGuides.length > displayedCount;

  const loadMoreGuides = async () => {
    setLoadingMore(true);
    // Simulate loading delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    setDisplayedCount(prev => prev + 30);
    setLoadingMore(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-hero text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Mallorca entdecken
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto animate-fade-in">
            Expertenführer helfen Ihnen dabei, das Beste dieser magischen Insel zu erkunden
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto animate-scale-in">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Guides, Aktivitäten, Orte suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-lg bg-white/95 backdrop-blur border-white/20 text-black placeholder:text-gray-500"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Featured Guides */}
        {featuredGuides.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-3xl font-semibold text-foreground">
                Empfohlene Guides
              </h2>
              <div className="h-1 flex-1 mx-8 bg-gradient-primary rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredGuides.slice(0, 2).map((guide) => (
                <Link key={guide.id} href={`/guide-instagram/${guide.slug_de}`}>
                  <Card className="group overflow-hidden shadow-medium hover:shadow-large transition-all duration-300 cursor-pointer">
                  <div className="relative aspect-video overflow-hidden">
                    <ImageWithFallback
                      src={getGuideImage(guide) || getFallbackImage(guide)} 
                      alt={guide.title_en}
                      fallbackSrc={getFallbackImage(guide)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-accent text-accent-foreground font-medium">
                        Empfohlen
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-black/50 text-white border-0">
                        {guide.location}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <h3 className="font-display text-xl font-semibold group-hover:text-primary transition-colors">
                      {guide.title_de || guide.title_en}
                    </h3>
                    <p className="text-muted-foreground line-clamp-3">{getExcerpt(guide)}</p>
                  </CardHeader>
                  <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{getReadingTime(guide)} Min. Lesezeit</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{(guide.view_count || 0).toLocaleString()}</span>
                      </div>
                      {guide.location && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span className="capitalize">{guide.location}</span>
                        </div>
                      )}
                    </div>
                  </CardFooter>
                </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Filters */}
        <section className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={selectedCategory === category.id ? "bg-gradient-primary" : ""}
                >
                  {category.name_de}
                </Button>
              ))}
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Neueste</SelectItem>
                  <SelectItem value="popular">Beliebteste</SelectItem>
                  <SelectItem value="reading-time">Kurze Lesezeit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* All Guides Grid */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedGuides.map((guide, index) => (
              <Link key={guide.id} href={`/guide-instagram/${guide.slug_de}`}>
                <Card className={`group overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 cursor-pointer animate-fade-in`} style={{animationDelay: `${index * 100}ms`}}>
                <div className="relative aspect-video overflow-hidden">
                  <ImageWithFallback
                    src={getGuideImage(guide) || getFallbackImage(guide)} 
                    alt={guide.title_en}
                    fallbackSrc={getFallbackImage(guide)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="bg-black/50 text-white border-0 text-xs">
                      {guide.location}
                    </Badge>
                  </div>
                  {(guide.highlighted || guide.is_featured) && (
                    <div className="absolute top-3 left-3">
                       <Badge className="bg-accent text-accent-foreground text-xs">
                        Empfohlen
                      </Badge>
                    </div>
                  )}
                </div>
                <CardHeader className="pb-3">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
                    {guide.title_de || guide.title_en}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2">{getExcerpt(guide)}</p>
                </CardHeader>
                <CardFooter className="pt-0">
                  <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{getReadingTime(guide)}Min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="h-3 w-3" />
                        <span>{Math.round((guide.view_count || 0) / 1000 * 10) / 10}k</span>
                      </div>
                    </div>
                    {guide.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span className="capitalize">{guide.location}</span>
                      </div>
                    )}
                  </div>
                </CardFooter>
              </Card>
              </Link>
            ))}
          </div>

          {/* Load More Button */}
          {hasMoreGuides && (
            <div className="text-center mt-12">
              <Button 
                onClick={loadMoreGuides}
                disabled={loadingMore}
                size="lg"
                className="bg-gradient-primary hover:opacity-90"
              >
                {loadingMore ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Wird geladen...
                  </>
                ) : (
                  "Mehr laden"
                )}
              </Button>
            </div>
          )}

          {filteredGuides.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
                <Search className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Keine Guides gefunden</h3>
              <p className="text-muted-foreground mb-6">
                Versuchen Sie, Ihre Suchbegriffe oder Kategoriefilter anzupassen
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
                variant="outline"
              >
                Filter löschen
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
