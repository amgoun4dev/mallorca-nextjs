"use client";
import { useState, useEffect, useMemo } from "react";
import { useIsMobile } from "../../hooks/use-mobile";
import { useImagePreloader } from "../../hooks/useImagePreloader";
import { ChevronLeft, ChevronRight, MapPin, Clock, Star } from "lucide-react";
import { Button } from "./button";
import { Card, CardContent } from "./card";
import { Badge } from "./badge";
import Link from "next/link";
import { supabase } from "../../integrations/supabase/client";
import { OptimizedImage } from "./optimized-image";

interface Guide {
  id: string;
  title_en?: string;
  title_de?: string;
  title_es?: string;
  short_desc_en?: string;
  short_desc_de?: string;
  short_desc_es?: string;
  thumbnail?: string;
  thumbnail_sm?: string;
  slug: string;
  location?: string;
  reading_time?: number;
  view_count: number;
}

export function GuideCarousel() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const { data, error } = await supabase
          .from('guides')
          .select('id, title_en, title_de, title_es, short_desc_en, short_desc_de, short_desc_es, thumbnail, thumbnail_sm, slug, location, reading_time, view_count')
          .eq('status', 'published')
          .order('created_at', { ascending: false })
          .limit(8);

        if (error) throw error;
        if (data && data.length > 0) {
          setGuides(data);
        } else {
          setGuides([
            { id: '1', title_de: "Versteckte Buchten im Norden", short_desc_de: "Entdecken Sie abgelegene Strände abseits der Touristenpfade mit kristallklarem Wasser und unberührter Natur.", thumbnail: "https://olrieidgokcnhhymksnf.supabase.co/storage/v1/object/public/general-images//mallorcamagic_fallback.jpg", slug: "hidden-bays-north", location: "Nord-Mallorca", reading_time: 8, view_count: 1250 },
            { id: '2', title_de: "Authentische Tapas-Bars", short_desc_de: "Die besten lokalen Restaurants und Tapas-Bars, die nur Einheimische kennen - ein kulinarisches Abenteuer.", thumbnail: "https://olrieidgokcnhhymksnf.supabase.co/storage/v1/object/public/general-images//mallorcamagic_fallback.jpg", slug: "authentic-tapas-bars", location: "Palma", reading_time: 6, view_count: 980 },
            { id: '3', title_de: "Historische Dörfer im Gebirge", short_desc_de: "Charmante Bergdörfer mit jahrhundertealter Geschichte, traditioneller Architektur und atemberaubenden Ausblicken.", thumbnail: "https://olrieidgokcnhhymksnf.supabase.co/storage/v1/object/public/general-images//mallorcamagic_fallback.jpg", slug: "mountain-villages", location: "Serra de Tramuntana", reading_time: 12, view_count: 750 },
          ]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGuides();
  }, []);

  useEffect(() => {
    if (!guides.length) return;
    const interval = setInterval(() => setCurrentIndex(prev => (prev + 1) % guides.length), 4000);
    return () => clearInterval(interval);
  }, [guides.length]);

  const getTitle = (guide: Guide) => guide.title_de || guide.title_en || '';
  const getExcerpt = (guide: Guide) => guide.short_desc_de || guide.short_desc_en || '';
  const getCleanImageUrl = (url?: string) => {
    if (!url) return "https://olrieidgokcnhhymksnf.supabase.co/storage/v1/object/public/general-images/mallorcamagic_fallback.jpg";
    const cleanedUrl = url.replace(/([^:]\/)\/+/g, '$1');
    return cleanedUrl.endsWith('/') ? "https://olrieidgokcnhhymksnf.supabase.co/storage/v1/object/public/general-images/mallorcamagic_fallback.jpg" : cleanedUrl;
  };

  const imageUrls = useMemo(() => guides.map(g => getCleanImageUrl(g.thumbnail_sm || g.thumbnail)), [guides]);
  useImagePreloader(imageUrls, currentIndex, { priority: true, preloadNext: 6 });

  const nextSlide = () => setCurrentIndex(prev => (prev + 1) % guides.length);
  const prevSlide = () => setCurrentIndex(prev => (prev - 1 + guides.length) % guides.length);

  if (loading) {
    return (
      <div className="w-full h-96 bg-gradient-subtle rounded-xl flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <div className="text-muted-foreground text-sm">Guides werden geladen...</div>
        </div>
      </div>
    );
  }
  if (!guides.length) {
    return (
      <div className="w-full h-96 bg-gradient-subtle rounded-xl flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">Keine Guides verfügbar</h3>
          <p className="text-muted-foreground">Guides sind derzeit in Vorbereitung.</p>
        </div>
      </div>
    );
  }

  return (
    <section>
      <div className="relative w-full h-96 overflow-hidden rounded-xl bg-gradient-subtle" role="region" aria-label="Guides Carousel">
        <div 
          className="flex transition-transform duration-700 ease-in-out h-full"
          style={{ transform: isMobile ? `translateX(-${currentIndex * 100}%)` : `translateX(-${currentIndex * (100 / 3)}%)` }}
          role="group" aria-live="polite" aria-label="Guides carousel"
        >
          {guides.concat(guides.slice(0, 3)).map((guide, index) => (
            <article key={`${guide.id}-${index}`} className="w-full md:w-1/3 flex-shrink-0 p-2">
              {guide.slug ? (
                <Link href={`/guide-instagram/${guide.slug}`} aria-label={`Read guide: ${getTitle(guide)}`}>
                  <Card className="h-full group overflow-hidden shadow-medium hover:shadow-large transition-all duration-300 cursor-pointer">
                    <div className="relative h-48 overflow-hidden">
                      <OptimizedImage
                        src={getCleanImageUrl(guide.thumbnail_sm || guide.thumbnail)} 
                        alt={getTitle(guide)}
                        fallbackSrc="https://olrieidgokcnhhymksnf.supabase.co/storage/v1/object/public/general-images/mallorcamagic_fallback.jpg"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        priority={index <= 6}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        placeholder="skeleton"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      {guide.location && (
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-black/30 text-white backdrop-blur-sm border-white/20">
                            <MapPin className="w-3 h-3 mr-1" />
                            <span>{guide.location}</span>
                          </Badge>
                        </div>
                      )}
                      <div className="absolute top-3 right-3 flex space-x-2">
                        {guide.reading_time && (
                          <Badge className="bg-black/30 text-white backdrop-blur-sm border-white/20">
                            <Clock className="w-3 h-3 mr-1" />
                            <span>{guide.reading_time} min</span>
                          </Badge>
                        )}
                      </div>
                      <div className="absolute bottom-3 right-3">
                        <Badge className="bg-black/30 text-white backdrop-blur-sm border-white/20">
                          <Star className="w-3 h-3 mr-1" />
                          <span>{guide.view_count}</span>
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-display text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {getTitle(guide)}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-3">
                        {getExcerpt(guide)}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ) : null}
            </article>
          ))}
        </div>

        <Button variant="outline" size="icon" className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm border-white/20 hover:bg-white z-10" onClick={prevSlide} aria-label="Previous guides">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm border-white/20 hover:bg-white z-10" onClick={nextSlide} aria-label="Next guides">
          <ChevronRight className="h-4 w-4" />
        </Button>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2" role="group" aria-label="Carousel page indicators">
          {guides.map((_, index) => (
            <button key={index} className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-white scale-125' : 'bg.white/50 hover:bg-white/70'}`} onClick={() => setCurrentIndex(index)} aria-label={`Go to slide ${index + 1}`} aria-current={index === currentIndex ? 'true' : 'false'} />
          ))}
        </div>
      </div>
    </section>
  );
}
