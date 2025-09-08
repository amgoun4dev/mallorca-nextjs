/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { useIsMobile } from "../../hooks/use-mobile";
import { useImagePreloader } from "../../hooks/useImagePreloader";
import { ChevronLeft, ChevronRight, MapPin, Star } from "lucide-react";
import { Button } from "./button";
import { Card, CardContent } from "./card";
import { Badge } from "./badge";
import Link from "next/link";
import { supabase } from "../../integrations/supabase/client";

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
  location?: string;
  slug: string;
  rating?: number;
  review_count?: number;
  reviews?: any;
}

export function ActivityCarousel() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const { data, error } = await supabase
          .from('activities')
          .select('id, title_en, title_de, title_es, description_en, description_de, description_es, featured_image, gallery, location, slug, rating, review_count, reviews')
          .eq('status', 'published')
          .order('rating', { ascending: false })
          .limit(8);

        if (error) throw error;
        if (data && data.length > 0) {
          setActivities(data);
        } else {
          setActivities([
            { id: '1', title_en: "Boat Tour Dragon Bay", title_de: "Bootstour zur Drachenbucht", description_en: "Discover the famous Dragon Bay with crystal clear water on an unforgettable boat tour.", description_de: "Entdecken Sie die berühmte Drachenbucht mit kristallklarem Wasser bei einer unvergesslichen Bootstour.", featured_image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop", slug: "boat-tour-dragon-bay", location: "Porto Cristo", rating: 4.8, review_count: 156 },
            { id: '2', title_en: "Mallorca Jeep Safari", title_de: "Mallorca Jeep Safari", description_en: "Explore the hidden paths and breathtaking landscapes of Mallorca on an exciting jeep safari.", description_de: "Erkunden Sie die versteckten Pfade und atemberaubenden Landschaften Mallorcas auf einer aufregenden Jeep-Safari.", featured_image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop", slug: "mallorca-jeep-safari", location: "Serra de Tramuntana", rating: 4.7, review_count: 89 },
          ]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setCurrentIndex(prev => (prev + 1) % Math.max(1, activities.length - 2)), 4000);
    return () => clearInterval(interval);
  }, [activities.length]);

  const getTitle = (activity: Activity) => activity.title_de || activity.title_en || '';
  const getDescription = (activity: Activity) => {
    const desc = activity.description_de || activity.description_en || '';
    return desc.length > 120 ? desc.substring(0, 120) + '...' : desc;
  };

  const getActivityImage = (activity: Activity) => {
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
    return activity.featured_image || 'https://olrieidgokcnhhymksnf.supabase.co/storage/v1/object/public/general-images/mallorcamagic_fallback.jpg';
  };

  useImagePreloader(activities.map(a => getActivityImage(a)), currentIndex, { priority: true, preloadNext: 6 });

  const nextSlide = () => setCurrentIndex(prev => (prev + 1) % Math.max(1, activities.length - 2));
  const prevSlide = () => setCurrentIndex(prev => (prev - 1 + Math.max(1, activities.length - 2)) % Math.max(1, activities.length - 2));

  if (loading) {
    return (
      <div className="w-full h-96 bg-gradient-subtle rounded-xl animate-pulse flex items-center justify-center">
        <div className="text-muted-foreground">Aktivitäten werden geladen...</div>
      </div>
    );
  }
  if (!activities.length) {
    return (
      <div className="w-full h-96 bg-gradient-subtle rounded-xl flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">Keine Aktivitäten verfügbar</h3>
          <p className="text-muted-foreground">Aktivitäten sind derzeit in Vorbereitung.</p>
        </div>
      </div>
    );
  }

  return (
    <section>
      <div className="relative w-full h-96 overflow-hidden rounded-xl bg-gradient-subtle" role="region" aria-label="Activities Carousel">
        <div 
          className="flex transition-transform duration-700 ease-in-out h-full"
          style={{ transform: isMobile ? `translateX(-${currentIndex * 100}%)` : `translateX(-${currentIndex * (100 / 3)}%)` }}
          role="group" aria-live="polite" aria-label="Activities carousel"
        >
          {activities.map((activity, index) => (
            <article key={activity.id} className="w-full md:w-1/3 flex-shrink-0 p-2">
              <Link href={`/activities/${activity.slug}`} aria-label={`Explore activity: ${getTitle(activity)}`}>
                <Card className="h-full group overflow-hidden shadow-medium hover:shadow-large transition-all duration-300 cursor-pointer">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={getActivityImage(activity)} 
                      alt={getTitle(activity)}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading={index <= 6 ? "eager" : "lazy"}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    {activity.location && (
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-black/30 text-white backdrop-blur-sm border-white/20">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span>{activity.location}</span>
                        </Badge>
                      </div>
                    )}
                    <div className="absolute bottom-3 right-3 flex items-center space-x-1">
                      <Badge className="bg-black/30 text-white backdrop-blur-sm border-white/20">
                        <Star className="w-3 h-3 mr-1" />
                        <span>{(activity.reviews as any)?.combinedAverageRating ?? activity.rating ?? 0}</span>
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-display text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {getTitle(activity)}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-3">
                      {getDescription(activity)}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </article>
          ))}
        </div>

        <Button variant="outline" size="icon" className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm border-white/20 hover:bg-white z-10" onClick={prevSlide} aria-label="Previous activities">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm border-white/20 hover:bg-white z-10" onClick={nextSlide} aria-label="Next activities">
          <ChevronRight className="h-4 w-4" />
        </Button>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2" role="group" aria-label="Carousel page indicators">
          {Array.from({ length: Math.max(1, activities.length - 2) }).map((_, index) => (
            <button key={index} className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/70'}`} onClick={() => setCurrentIndex(index)} aria-label={`Go to slide ${index + 1}`} aria-current={index === currentIndex ? 'true' : 'false'} />
          ))}
        </div>
      </div>
    </section>
  );
}
