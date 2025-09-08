"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin } from "lucide-react";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { supabase } from "@/integrations/supabase/client";
import Link from "next/link";

interface Hotel {
  id: string;
  name_en: string;
  name_de?: string;
  name_es?: string;
  slug: string;
  stars?: number;
  rating?: number;
  pricefrom?: number;
  photos_0_url?: string;
  location_text?: string;
}

interface MoreHotelsProps {
  currentHotelId: string;
  cityId?: string;
  language: 'en' | 'de' | 'es';
}

export function MoreHotels({ currentHotelId, cityId, language }: MoreHotelsProps) {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMoreHotels();
  }, [currentHotelId, cityId]);

  const fetchMoreHotels = async () => {
    try {
      setLoading(true);
      
      // Fetch published hotels
      const { data: hotels } = await supabase
        .from('hotels')
        .select('id, name_en, name_de, name_es, slug, stars, rating, pricefrom, photos_0_url, location_text')
        .eq('status', 'published')
        .neq('id', currentHotelId)
        .limit(3);

      // Transform photos data safely
      const transformedHotels: Hotel[] = (hotels || []).map(hotel => ({
        id: hotel.id,
        name_en: hotel.name_en,
        name_de: hotel.name_de,
        name_es: hotel.name_es,
        slug: hotel.slug,
        stars: hotel.stars,
        rating: hotel.rating,
        pricefrom: hotel.pricefrom,
        location_text: hotel.location_text,
        photos_0_url: hotel.photos_0_url
      }));

      setHotels(transformedHotels);
    } catch (error) {
      console.error('Error fetching more hotels:', error);
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  const getLabels = () => {
    switch (language) {
      case 'de':
        return {
          moreHotels: 'Weitere Hotels',
          from: 'ab',
          night: 'pro Nacht',
          viewDetails: 'Details ansehen',
          loading: 'Lädt...'
        };
      case 'es':
        return {
          moreHotels: 'Más Hoteles',
          from: 'desde',
          night: 'por noche',
          viewDetails: 'Ver detalles',
          loading: 'Cargando...'
        };
      default:
        return {
          moreHotels: 'More Hotels',
          from: 'from',
          night: 'per night',
          viewDetails: 'View Details',
          loading: 'Loading...'
        };
    }
  };

  const labels = getLabels();

  const getTitle = (hotel: Hotel) => {
    switch (language) {
      case 'de': return hotel.name_de || hotel.name_en;
      case 'es': return hotel.name_es || hotel.name_en;
      default: return hotel.name_en;
    }
  };

  if (loading) {
    return (
      <div className="my-16">
        <h2 className="text-3xl font-bold mb-8">{labels.moreHotels}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="w-full h-48 bg-muted animate-pulse"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded mb-2 animate-pulse"></div>
                <div className="h-3 bg-muted rounded w-2/3 animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (hotels.length === 0) {
    return null;
  }

  return (
    <div className="my-16">
      <h2 className="text-3xl font-bold mb-8">{labels.moreHotels}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map((hotel) => (
          <Card key={hotel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <OptimizedImage
                src={hotel.photos_0_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop'}
                alt={getTitle(hotel)}
                className="w-full h-48 object-cover"
                fallbackSrc="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              {hotel.rating && (
                <Badge className="absolute top-2 right-2 bg-black/70 text-white">
                  {hotel.rating}/10
                </Badge>
              )}
            </div>
            
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                {getTitle(hotel)}
              </h3>
              
              <div className="flex items-center gap-1 mb-2">
                {hotel.stars && (
                  <>
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < hotel.stars! ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                      />
                    ))}
                    <span className="text-sm text-muted-foreground ml-1">
                      {hotel.stars} Sterne
                    </span>
                  </>
                )}
              </div>
              
              {hotel.location_text && (
                <div className="flex items-center gap-1 mb-3 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{hotel.location_text}</span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                {hotel.pricefrom && (
                  <div className="text-lg font-bold text-primary">
                    {labels.from} €{hotel.pricefrom} {labels.night}
                  </div>
                )}
                <Button asChild size="sm">
                  <Link href={`/hotels/${hotel.slug}`}>
                    {labels.viewDetails}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
