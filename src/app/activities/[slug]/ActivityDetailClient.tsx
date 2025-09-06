"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, Star, Clock, Users, CheckCircle, ExternalLink, Heart, Bed, Bath } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { ImageWithFallback } from "../../../components/ui/image-with-fallback";
import { supabase } from "../../../integrations/supabase/client";

interface Activity {
  id: string;
  title_en: string;
  title_de?: string;
  title_es?: string;
  slug: string;
  description_en?: string;
  description_de?: string;
  description_es?: string;
  content_en?: string;
  content_de?: string;
  content_es?: string;
  featured_image?: string;
  gallery?: any;
  location?: string;
  price_from?: number;
  price_to?: number;
  currency?: string;
  rating?: number;
  review_count?: number;
  duration?: string;
  duration_json?: any;
  difficulty_level?: number;
  booking_url?: string;
  category_id?: string;
  coordinates?: any;
  contact_info?: any;
  season_availability?: any;
  reviews?: any;
  pricing?: any;
  flags?: any;
  seo_title_en?: string;
  seo_title_de?: string;
  seo_title_es?: string;
  seo_description_en?: string;
  seo_description_de?: string;
  seo_description_es?: string;
}

interface ActivityDetailClientProps {
  slug: string;
}

export default function ActivityDetailClient({ slug }: ActivityDetailClientProps) {
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedActivities, setRelatedActivities] = useState<Activity[]>([]);
  const [language] = useState<'en' | 'de' | 'es'>('de');
  
  useEffect(() => {
    const fetchActivity = async () => {
      if (!slug) return;
      
      try {
        const { data, error } = await supabase
          .from('activities')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'published')
          .maybeSingle();

        if (error) throw error;
        setActivity(data);
        
        // Fetch related activities
        if (data) {
          const { data: related } = await supabase
            .from('activities')
            .select('id, title_en, title_de, slug, featured_image, gallery, location, price_from, currency, rating, reviews, pricing')
            .eq('status', 'published')
            .neq('id', data.id)
            .order('created_at', { ascending: false })
            .limit(6);
          
          // Randomize and take 3 activities
          const randomActivities = (related || [])
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);
          
          setRelatedActivities(randomActivities);
        }
      } catch (error) {
        console.error('Error fetching activity:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [slug]);

  const getTitle = (activity: Activity): string => {
    return activity.title_de || activity.title_en;
  };

  const getDescription = (activity: Activity): string => {
    return activity.description_de || activity.description_en || '';
  };

  const getActivityImage = (activity: Activity): string => {
    if (activity.gallery && Array.isArray(activity.gallery) && activity.gallery.length > 0) {
      const gallery = activity.gallery[0];
      if (gallery?.variants) {
        const variant720 = gallery.variants.find((v: any) => v.width === 720 && v.height === 480);
        if (variant720) return variant720.url;
        const variant540 = gallery.variants.find((v: any) => v.width === 540);
        if (variant540) return variant540.url;
        return gallery.variants[gallery.variants.length - 1]?.url;
      }
    }
    return activity.featured_image || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop';
  };

  const getHeroImage = (activity: Activity): string => {
    if (activity.gallery && Array.isArray(activity.gallery)) {
      // Find title/cover image
      const titleImage = activity.gallery.find(img => img.isCover === true) || activity.gallery[0];
      if (titleImage && titleImage.variants) {
        const variants = titleImage.variants;
        
        // First priority: Find exact 720x480 format
        const targetVariant = Object.values(variants).find((variant: any) => {
          if (variant && typeof variant === 'object' && 'width' in variant && 'height' in variant) {
            return variant.width === 720 && variant.height === 480;
          }
          return false;
        });
        
        if (targetVariant && typeof targetVariant === 'object' && 'url' in targetVariant) {
          return (targetVariant as any).url;
        }
        
        // Fallback: original or highest quality
        if (variants.original && typeof variants.original === 'object' && 'url' in variants.original) {
          return (variants.original as any).url;
        }
        
        // Last fallback: any available variant
        const anyVariant = Object.values(variants).find((variant: any) => 
          variant && typeof variant === 'object' && 'url' in variant
        );
        if (anyVariant && typeof anyVariant === 'object' && 'url' in anyVariant) {
          return (anyVariant as any).url;
        }
      }
    }
    return activity.featured_image || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=800&fit=crop';
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Aktivität wird geladen...</p>
        </div>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Aktivität nicht gefunden</h1>
          <p className="text-muted-foreground mb-6">Die angeforderte Aktivität konnte nicht gefunden werden.</p>
          <Link href="/activities">
            <Button>Zurück zu den Aktivitäten</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* ActivityHero */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${getHeroImage(activity)})`
          }}
        >
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-between py-8">
          {/* Top overlay text */}
          <div className="text-center">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-lg px-4 py-2">
              Ein perfekter Mallorca Tag
            </Badge>
          </div>

          {/* Main title */}
          <div className="flex-1 flex items-end pb-16">
            <div className="w-full max-w-2xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                {getTitle(activity)}
              </h1>
              {activity.location && (
                <div className="flex items-center gap-2 mt-4 text-white/90">
                  <MapPin className="h-5 w-5" />
                  <span className="text-lg">{activity.location}</span>
                </div>
              )}
              {activity.booking_url && (
                <div className="mt-6">
                  <Button 
                    asChild
                    size="lg"
                    className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-lg px-8 py-4"
                  >
                    <a 
                      href={activity.booking_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Jetzt buchen
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ActivityHeader */}
      <section className="py-8 bg-background">
        <div className="container mx-auto px-4">
          <Card className="p-6 md:p-8 shadow-large">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Content */}
              <div className="lg:col-span-1 space-y-4">
                <Badge className="bg-gradient-primary text-white">
                  Outdoor Aktivitäten
                </Badge>
                
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  {getTitle(activity)}
                </h2>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map(star => {
                      const reviewRating = activity.reviews?.combinedAverageRating || activity.rating || 0;
                      const isFilled = star <= Math.floor(reviewRating);
                      const isPartial = star === Math.ceil(reviewRating) && reviewRating % 1 !== 0;
                      const partialPercentage = isPartial ? (reviewRating % 1) * 100 : 0;
                      
                      return (
                        <div key={star} className="relative h-5 w-5">
                          <Star className="h-5 w-5 text-gray-300 absolute" />
                          {isFilled && (
                            <Star className="h-5 w-5 text-yellow-400 fill-current absolute" />
                          )}
                          {isPartial && (
                            <div 
                              className="absolute overflow-hidden h-5"
                              style={{ width: `${partialPercentage}%` }}
                            >
                              <Star className="h-5 w-5 text-yellow-400 fill-current" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({activity.reviews?.totalReviews || activity.review_count || 0} Bewertungen)
                  </span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{activity.location}</span>
                </div>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed">
                  {getDescription(activity)}
                </p>

                {/* Quick Facts */}
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-sm">{getDuration(activity)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-sm">Gruppe</span>
                  </div>
                  {activity.reviews?.totalReviews && activity.reviews.totalReviews > 0 && (
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-primary" />
                      <span className="text-sm">{activity.reviews.totalReviews} Bewertungen</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Price Box */}
              <div className="lg:col-span-1">
                <Card className="p-6 bg-gradient-subtle border-2 border-primary/20 sticky top-4">
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">
                        von {activity.pricing?.summary?.fromPrice || activity.price_from || 45} {activity.pricing?.currency || activity.currency || '€'}
                      </div>
                      <p className="text-sm text-muted-foreground">pro Person</p>
                    </div>

                    <div className="space-y-3">
                      {activity.flags?.free_cancellation && (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm">Kostenlose Stornierung</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">Sofortige Bestätigung</span>
                      </div>
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">Mobile Tickets</span>
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-gradient-primary hover:opacity-90 text-white" 
                      size="lg" 
                      onClick={() => activity.booking_url && window.open(activity.booking_url, '_blank')}
                    >
                      Verfügbarkeit prüfen
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* More Activities */}
      {relatedActivities.length > 0 && (
        <section className="py-16 bg-gradient-subtle">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Weitere Aktivitäten
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Entdecken Sie weitere spannende Aktivitäten auf Mallorca
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {relatedActivities.map((relatedActivity) => (
                <Link key={relatedActivity.id} href={`/activities/${relatedActivity.slug}`}>
                  <Card className="group overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 cursor-pointer">
                    <div className="relative aspect-video overflow-hidden">
                      <Image 
                        src={getActivityImage(relatedActivity)} 
                        alt={relatedActivity.title_de || relatedActivity.title_en}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute bottom-3 right-3">
                        <div className="bg-black/70 backdrop-blur rounded px-2 py-1 text-white text-xs font-medium">
                          von {relatedActivity.pricing?.summary?.fromPrice || relatedActivity.price_from || 45} {relatedActivity.pricing?.currency || relatedActivity.currency || '€'}
                        </div>
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2 mb-2">
                        {relatedActivity.title_de || relatedActivity.title_en}
                      </h3>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{relatedActivity.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span>{(relatedActivity.reviews?.combinedAverageRating || relatedActivity.rating || 0).toFixed(1)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/activities">
                <Button variant="outline" size="lg">
                  Alle Aktivitäten anzeigen
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Top Attractions */}
      <TopAttractions location={activity?.location} />

      {/* Property Offers */}
      <PropertyOffers />
    </div>
  );
}

// TopAttractions Component
interface Attraction {
  id: string;
  title_en: string;
  title_de?: string;
  title_es?: string;
  short_desc_en?: string;
  short_desc_de?: string;
  short_desc_es?: string;
  thumbnail?: string;
  rating?: number;
  location?: string;
  slug_de: string;
}

function TopAttractions({ location }: { location?: string }) {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState(true);
  const language = 'de';

  useEffect(() => {
    const fetchAttractions = async () => {
      try {
        const { data, error } = await supabase
          .from('guides')
          .select('id, title_en, title_de, title_es, short_desc_en, short_desc_de, short_desc_es, thumbnail, slug_de, location')
          .eq('status', 'published')
          .eq('is_featured', true)
          .limit(6);

        if (error) throw error;
        setAttractions(data || []);
      } catch (error) {
        console.error('Error fetching attractions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttractions();
  }, [location]);

  const getTitle = (attraction: Attraction) => {
    return attraction.title_de || attraction.title_en;
  };

  const getExcerpt = (attraction: Attraction) => {
    return attraction.short_desc_de || attraction.short_desc_en;
  };

  if (loading || attractions.length === 0) return null;

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground">
            Top 6 Attraktionen
          </h2>
          <p className="text-lg text-muted-foreground mt-2">
            {location ? `in ${location}` : 'auf Mallorca'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {attractions.map((attraction) => (
            <Link key={attraction.id} href={`/guide-instagram/${attraction.slug_de}`}>
              <Card className="group overflow-hidden shadow-medium hover:shadow-large transition-all duration-300 cursor-pointer">
                <div className="relative aspect-video overflow-hidden">
                  <ImageWithFallback
                    src={attraction.thumbnail || ''}
                    alt={getTitle(attraction)}
                    fallbackSrc='https://olrieidgokcnhhymksnf.supabase.co/storage/v1/object/public/general-images/mallorcamagic_fallback.jpg'
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-foreground line-clamp-2">
                    {getTitle(attraction)}
                  </h3>
                  
                  {attraction.location && (
                    <div className="flex items-center gap-1 text-muted-foreground mb-3">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{attraction.location}</span>
                    </div>
                  )}

                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {getExcerpt(attraction)}
                  </p>

                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-muted-foreground ml-2">4.8</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// PropertyOffers Component
interface Property {
  id: string;
  title_en: string;
  title_de?: string;
  title_es?: string;
  featured_image?: string;
  price?: number;
  currency?: string;
  location?: string;
  bedrooms?: number;
  bathrooms?: number;
  property_type: string;
  slug: string;
}

function PropertyOffers() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('buy');
  const language = 'de';

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const { data, error } = await supabase
          .from('real_estate_listings')
          .select('id, title_en, title_de, title_es, featured_image, price, currency, location, bedrooms, bathrooms, property_type, slug')
          .eq('status', 'published')
          .eq('is_featured', true)
          .limit(4);

        if (error) throw error;
        setProperties(data || []);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const getTitle = (property: Property) => {
    return property.title_de || property.title_en;
  };

  if (loading || properties.length === 0) return null;

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-foreground">
          Immobilienangebote
        </h2>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="buy">Kaufen</TabsTrigger>
            <TabsTrigger value="rent">Mieten</TabsTrigger>
          </TabsList>
          
          <TabsContent value="buy" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {properties.map((property) => (
                <PropertyCard 
                  key={property.id} 
                  property={property} 
                  getTitle={getTitle}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="rent" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {properties.slice(0, 3).map((property) => (
                <PropertyCard 
                  key={property.id} 
                  property={property} 
                  getTitle={getTitle}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="text-center mt-8">
          <Button variant="outline" size="lg">
            Alle anzeigen
          </Button>
        </div>
      </div>
    </section>
  );
}

function PropertyCard({ 
  property, 
  getTitle 
}: { 
  property: Property; 
  getTitle: (property: Property) => string;
}) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <Card className="group overflow-hidden shadow-medium hover:shadow-large transition-all duration-300">
      <div className="relative aspect-video overflow-hidden">
        <Image 
          src={property.featured_image || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop'}
          alt={getTitle(property)}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-3 right-3 bg-white/80 hover:bg-white"
          onClick={() => setIsFavorite(!isFavorite)}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
        </Button>
        <Badge className="absolute top-3 left-3 bg-primary text-white">
          {property.property_type}
        </Badge>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold mb-2 text-foreground line-clamp-2">
          {getTitle(property)}
        </h3>
        
        {property.location && (
          <div className="flex items-center gap-1 text-muted-foreground mb-3">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{property.location}</span>
          </div>
        )}
        
        <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
          {property.bedrooms && (
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{property.bedrooms}</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>{property.bathrooms}</span>
            </div>
          )}
        </div>
        
        <div className="text-xl font-bold text-primary">
          €{property.price?.toLocaleString() || '450,000'}
        </div>
      </div>
    </Card>
  );
}