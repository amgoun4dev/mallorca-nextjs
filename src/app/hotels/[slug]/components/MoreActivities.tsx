"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin } from "lucide-react";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { supabase } from "@/integrations/supabase/client";
import Link from "next/link";

interface Activity {
  id: string;
  title_en: string;
  title_de?: string;
  title_es?: string;
  featured_image?: string;
  gallery?: any[];
  price_from?: number;
  currency?: string;
  rating?: number;
  location?: string;
  slug: string;
  reviews?: any;
  pricing?: any;
}

interface MoreActivitiesProps {
  currentActivityId: string;
  language: 'en' | 'de' | 'es';
}

export function MoreActivities({ currentActivityId, language }: MoreActivitiesProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        let query = supabase
          .from('activities')
          .select('id, title_en, title_de, title_es, featured_image, gallery, price_from, currency, rating, location, slug, reviews, pricing')
          .eq('status', 'published');
        
        // Only add the neq filter if currentActivityId is not empty
        if (currentActivityId && currentActivityId.trim() !== '') {
          query = query.neq('id', currentActivityId);
        }
        
        const { data, error } = await query
          .order('created_at', { ascending: false })
          .limit(6);

        if (error) throw error;
        
        // Randomize and take 3 activities
        const randomActivities = (data || [])
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        
        setActivities(randomActivities);
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [currentActivityId]);

  const getTitle = (activity: Activity) => {
    switch (language) {
      case 'de': return activity.title_de || activity.title_en;
      case 'es': return activity.title_es || activity.title_en;
      default: return activity.title_en;
    }
  };

  const getLabels = () => {
    switch (language) {
      case 'de': return {
        title: 'Weitere Aktivitäten auf Mallorca',
        from: 'ab',
        bookNow: 'Jetzt buchen'
      };
      case 'es': return {
        title: 'Más actividades en Mallorca',
        from: 'desde',
        bookNow: 'Reservar ahora'
      };
      default: return {
        title: 'More Activities in Mallorca',
        from: 'from',
        bookNow: 'Book Now'
      };
    }
  };

  const labels = getLabels();

  const getActivityImage = (activity: Activity) => {
    const gallery = activity.gallery?.[0];
    if (gallery?.variants) {
      const variant720 = gallery.variants.find((v: any) => v.width === 720 && v.height === 480);
      if (variant720) return variant720.url;
      const variant540 = gallery.variants.find((v: any) => v.width === 540);
      if (variant540) return variant540.url;
      return gallery.variants[gallery.variants.length - 1]?.url;
    }
    return activity.featured_image || 'https://olrieidgokcnhhymksnf.supabase.co/storage/v1/object/public/general-images/mallorcamagic_fallback.jpg';
  };

  if (loading) {
    return (
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-foreground">
            {labels.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="w-full h-48 bg-muted animate-pulse"></div>
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded mb-2 animate-pulse"></div>
                  <div className="h-3 bg-muted rounded w-2/3 animate-pulse"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (activities.length === 0) return null;

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-foreground">
          {labels.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activities.map((activity) => (
            <Card key={activity.id} className="group overflow-hidden shadow-medium hover:shadow-large transition-all duration-300">
              <div className="relative aspect-video overflow-hidden">
                <OptimizedImage
                  src={getActivityImage(activity)} 
                  alt={getTitle(activity)}
                  fallbackSrc="https://olrieidgokcnhhymksnf.supabase.co/storage/v1/object/public/general-images/mallorcamagic_fallback.jpg"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  onError={() => console.log('Image failed to load for:', getTitle(activity))}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {/* Location Badge */}
                {activity.location && (
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-black/30 text-white backdrop-blur-sm border-white/20">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span>{activity.location}</span>
                    </Badge>
                  </div>
                )}

                {/* Rating */}
                <div className="absolute bottom-3 right-3 flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-white text-sm font-medium bg-black/30 px-2 py-1 rounded backdrop-blur-sm">
                    {activity.rating || '4.5'}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {getTitle(activity)}
                </h3>
                
                {activity.price_from && (
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-lg font-bold text-primary">
                      {labels.from} €{activity.price_from}
                    </div>
                  </div>
                )}
                
                <Button asChild className="w-full">
                  <Link href={`/activities/${activity.slug}`}>
                    {labels.bookNow}
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
