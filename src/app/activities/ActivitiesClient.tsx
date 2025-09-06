"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Search, MapPin, Clock, Star } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../../components/ui/select";
import { supabase } from "../../integrations/supabase/client";
import Link from "next/link";

interface Activity {
  id: string;
  title_en: string;
  title_de?: string;
  title_es?: string;
  description_en?: string;
  description_de?: string;
  description_es?: string;
  featured_image?: string;
  gallery?: any;
  price_from?: number;
  currency?: string;
  rating?: number;
  location?: string;
  slug: string;
  reviews?: any;
  pricing?: any;
  duration_json?: any;
  duration?: string;
  is_featured?: boolean;
  category_id?: string;
}

const categories = ["Alle", "Wassersport", "Wandern", "Abenteuer", "Essen & Wein", "Kultur"];

export default function ActivitiesClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Alle");
  const [sortBy, setSortBy] = useState("popular");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [allActivities, setAllActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [displayCount, setDisplayCount] = useState(30);
  const [language] = useState<'en' | 'de' | 'es'>('de'); // Default to German
  
  const ITEMS_PER_PAGE = 30;

  // Reset display when search or sort changes
  useEffect(() => {
    setDisplayCount(30);
  }, [searchTerm, sortBy]);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('activities')
        .select('id, title_en, title_de, title_es, description_en, description_de, description_es, featured_image, gallery, price_from, currency, rating, location, slug, reviews, pricing, duration_json, duration, is_featured, category_id')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Store all activities without randomization for proper sorting/filtering
      setAllActivities(data || []);
      
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreActivities = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setDisplayCount(prev => prev + ITEMS_PER_PAGE);
      setLoadingMore(false);
    }, 500);
  };

  const getTitle = (activity: Activity) => {
    return activity.title_de || activity.title_en;
  };

  const getDescription = (activity: Activity) => {
    const desc = activity.description_de || activity.description_en || '';
    return desc.length > 120 ? desc.substring(0, 120) + '...' : desc;
  };

  const getActivityImage = (activity: Activity) => {
    // Skip external CDNs that timeout and prioritize reliable sources
    if (activity.featured_image && !activity.featured_image.includes('tripadvisor.com')) {
      return activity.featured_image;
    }

    // Use local images from public folder - rotate through available images
    const localImages = [
      '/lovable-uploads/0ccc1f16-0b14-46d6-b630-b89d5e72bb1d.png',
      '/lovable-uploads/150b65d8-880f-4502-a2c7-1bac146d90d4.png',
      '/lovable-uploads/2411e8eb-622b-4671-9c18-c96452b3b52e.png',
      '/lovable-uploads/3ce02233-799c-4e4f-9ba8-7dc6ccfd6b1f.png',
      '/lovable-uploads/4223ae41-b263-48cb-a4eb-c54e7d88de5e.png',
      '/lovable-uploads/53815b7b-96b8-4822-b136-d8e35175cadf.png',
      '/lovable-uploads/76bcf0aa-341c-44ab-9032-05aad263f26d.png',
      '/lovable-uploads/7a47ca0f-17ad-4dde-b282-aecad01275de.png',
      '/lovable-uploads/a0295954-4dd2-494e-ba3b-96cd603b1382.png',
      '/lovable-uploads/aca4304b-cf00-4bd3-a16f-83243ea2bbb1.png',
      '/lovable-uploads/ba360617-1620-43d6-b46a-c6e32347b7ef.png',
      '/lovable-uploads/ca090410-369a-46e2-9f7b-3ef628908ecf.png',
      '/lovable-uploads/fb0d43bc-97c3-47b9-8a33-1bd1ddb865af.png'
    ];
    
    // Use activity ID to consistently assign the same image to the same activity
    const imageIndex = activity.id ? parseInt(activity.id.slice(-2), 36) % localImages.length : 0;
    return localImages[imageIndex];
  };

  const getDuration = (activity: Activity) => {
    if (activity.duration_json?.fixedDurationInMinutes) {
      const hours = Math.floor(activity.duration_json.fixedDurationInMinutes / 60);
      const minutes = activity.duration_json.fixedDurationInMinutes % 60;
      return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
    } else if (activity.duration_json?.variableDurationFromMinutes && activity.duration_json?.variableDurationToMinutes) {
      const fromHours = Math.floor(activity.duration_json.variableDurationFromMinutes / 60);
      const toHours = Math.floor(activity.duration_json.variableDurationToMinutes / 60);
      return `${fromHours}-${toHours}h`;
    }
    return activity.duration || '3-4h';
  };

  const filteredActivities = allActivities
    .filter((activity) => {
      if (!searchTerm) return true;
      
      const titleMatch = getTitle(activity).toLowerCase().includes(searchTerm.toLowerCase());
      const descriptionMatch = getDescription(activity).toLowerCase().includes(searchTerm.toLowerCase());
      const locationMatch = (activity.location || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      return titleMatch || descriptionMatch || locationMatch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return (b.reviews?.totalReviews || 0) - (a.reviews?.totalReviews || 0);
        case "rating":
          return (b.reviews?.combinedAverageRating || b.rating || 0) - (a.reviews?.combinedAverageRating || a.rating || 0);
        case "price-low":
          return (a.pricing?.summary?.fromPrice || a.price_from || 0) - (b.pricing?.summary?.fromPrice || b.price_from || 0);
        case "price-high":
          return (b.pricing?.summary?.fromPrice || b.price_from || 0) - (a.pricing?.summary?.fromPrice || a.price_from || 0);
        default:
          return 0;
      }
    });

  // Get displayed activities (for pagination)
  const displayedActivities = filteredActivities.slice(0, displayCount);
  const hasMoreToShow = filteredActivities.length > displayCount;

  const featuredActivities = displayedActivities.filter(activity => activity.is_featured);

  const getStructuredData = () => {
    return {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Aktivitäten & Abenteuer auf Mallorca",
      "description": "Unvergessliche Erlebnisse erwarten Sie auf Mallorca. Entdecken Sie Wassersport, Wandern, Abenteuer, Essen & Wein und kulturelle Aktivitäten.",
      "url": `${process.env.NEXT_PUBLIC_SITE_URL}/activities`,
      "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": filteredActivities.length,
        "itemListElement": featuredActivities.map((activity, index) => ({
          "@type": "TouristAttraction",
          "position": index + 1,
          "name": getTitle(activity),
          "url": `${process.env.NEXT_PUBLIC_SITE_URL}/activities/${activity.slug}`,
          "image": getActivityImage(activity),
          "description": getDescription(activity),
          "geo": activity.location ? {
            "@type": "Place",
            "name": activity.location
          } : undefined,
          "priceRange": activity.price_from ? `${activity.price_from} ${activity.currency || 'EUR'}` : undefined,
          "aggregateRating": (activity.reviews?.combinedAverageRating || activity.rating) ? {
            "@type": "AggregateRating",
            "ratingValue": activity.reviews?.combinedAverageRating || activity.rating,
            "bestRating": "5",
            "reviewCount": activity.reviews?.totalReviews || 0
          } : undefined
        }))
      }
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Aktivitäten werden geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getStructuredData()) }}
      />

      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-hero text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Aktivitäten & Abenteuer
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto animate-fade-in">
            Unvergessliche Erlebnisse erwarten Sie auf Mallorca
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto animate-scale-in">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Aktivitäten, Orte, Erlebnisse suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-lg bg-white/95 backdrop-blur border-white/20 text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Featured Activities */}
        {featuredActivities.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-3xl font-semibold text-foreground">
                Empfohlene Abenteuer
              </h2>
              <div className="h-1 flex-1 mx-8 bg-gradient-primary rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {featuredActivities.slice(0, 3).map((activity) => (
                <Link key={activity.id} href={`/activities/${activity.slug}`}>
                  <Card className="group overflow-hidden shadow-medium hover:shadow-large transition-all duration-300 cursor-pointer">
                    <div className="relative aspect-video overflow-hidden">
                      <Image 
                        src={getActivityImage(activity)} 
                        alt={getTitle(activity)}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-accent text-accent-foreground font-medium">
                          Empfohlen
                        </Badge>
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <div className="bg-black/70 backdrop-blur rounded-lg px-3 py-1 text-white text-sm">
                          von {activity.pricing?.summary?.fromPrice || activity.price_from || 45} {activity.pricing?.currency || activity.currency || '€'}
                        </div>
                      </div>
                    </div>
                    <CardHeader className="pb-3">
                      <h3 className="font-display text-xl font-semibold group-hover:text-primary transition-colors">
                        {getTitle(activity)}
                      </h3>
                      <p className="text-muted-foreground text-sm">{getDescription(activity)}</p>
                    </CardHeader>
                    <CardFooter className="pt-0">
                      <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{activity.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map(star => {
                              const reviewRating = activity.reviews?.combinedAverageRating || activity.rating || 0;
                              const isFilled = star <= Math.floor(reviewRating);
                              const isPartial = star === Math.ceil(reviewRating) && reviewRating % 1 !== 0;
                              const partialPercentage = isPartial ? (reviewRating % 1) * 100 : 0;
                              
                              return (
                                <div key={star} className="relative h-4 w-4">
                                  <Star className="h-4 w-4 text-gray-300 absolute" />
                                  {isFilled && (
                                    <Star className="h-4 w-4 text-yellow-400 fill-current absolute" />
                                  )}
                                  {isPartial && (
                                    <div 
                                      className="absolute overflow-hidden h-4"
                                      style={{ width: `${partialPercentage}%` }}
                                    >
                                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          <span className="ml-1">({activity.reviews?.totalReviews || 0})</span>
                        </div>
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
            <div className="flex items-center space-x-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Beliebteste</SelectItem>
                  <SelectItem value="rating">Bestbewertet</SelectItem>
                  <SelectItem value="price-low">Preis: Niedrig bis Hoch</SelectItem>
                  <SelectItem value="price-high">Preis: Hoch bis Niedrig</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Activities Grid */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedActivities.map((activity, index) => (
              <Link key={activity.id} href={`/activities/${activity.slug}`}>
                <Card 
                  className={`group overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 cursor-pointer animate-fade-in`}
                  style={{animationDelay: `${index * 100}ms`}}
                >
                  <div className="relative aspect-video overflow-hidden">
                    <Image 
                      src={getActivityImage(activity)} 
                      alt={getTitle(activity)}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {activity.is_featured && (
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-accent text-accent-foreground text-xs">
                          Empfohlen
                        </Badge>
                      </div>
                    )}
                    <div className="absolute bottom-3 right-3">
                      <div className="bg-black/70 backdrop-blur rounded px-2 py-1 text-white text-xs font-medium">
                        von {activity.pricing?.summary?.fromPrice || activity.price_from || 45} {activity.pricing?.currency || activity.currency || '€'}
                      </div>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map(star => {
                            const reviewRating = activity.reviews?.combinedAverageRating || activity.rating || 0;
                            const isFilled = star <= Math.floor(reviewRating);
                            const isPartial = star === Math.ceil(reviewRating) && reviewRating % 1 !== 0;
                            const partialPercentage = isPartial ? (reviewRating % 1) * 100 : 0;
                            
                            return (
                              <div key={star} className="relative h-3 w-3">
                                <Star className="h-3 w-3 text-gray-300 absolute" />
                                {isFilled && (
                                  <Star className="h-3 w-3 text-yellow-400 fill-current absolute" />
                                )}
                                {isPartial && (
                                  <div 
                                    className="absolute overflow-hidden h-3"
                                    style={{ width: `${partialPercentage}%` }}
                                  >
                                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <span className="ml-1">({activity.reviews?.totalReviews || 0})</span>
                      </div>
                    </div>
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-1">
                      {getTitle(activity)}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">{getDescription(activity)}</p>
                  </CardHeader>
                  
                  <CardFooter className="pt-0">
                    <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{activity.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{getDuration(activity)}</span>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>

          {displayedActivities.length === 0 && !loading && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
                <Search className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Keine Aktivitäten gefunden</h3>
              <p className="text-muted-foreground mb-6">
                Versuchen Sie, Ihre Suchbegriffe anzupassen
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm("");
                }}
                variant="outline"
              >
                Suche löschen
              </Button>
            </div>
          )}

          {/* Load More Button */}
          {hasMoreToShow && (
            <div className="text-center mt-12">
              <Button 
                onClick={loadMoreActivities}
                disabled={loadingMore}
                size="lg"
                className="bg-gradient-primary hover:opacity-90 text-white"
              >
                {loadingMore ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Wird geladen...
                  </>
                ) : (
                  'Mehr Aktivitäten laden'
                )}
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
