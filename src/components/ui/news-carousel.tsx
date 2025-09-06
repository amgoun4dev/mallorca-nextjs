"use client";
import { useState, useEffect } from "react";
import { useIsMobile } from "../../hooks/use-mobile";
import { ChevronLeft, ChevronRight, Calendar, Eye } from "lucide-react";
import { Button } from "./button";
import { Card, CardContent } from "./card";
import { Badge } from "./badge";
import Link from "next/link";
import { supabase } from "../../integrations/supabase/client";
import { ImageWithFallback } from "./image-with-fallback";

interface Article {
  id: string;
  title: string;
  excerpt?: string;
  cover_image_url?: string;
  slug: string;
  published_at?: string;
  views?: number;
  is_featured?: boolean;
}

export function NewsCarousel() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('id, title, excerpt, cover_image_url, slug, published_at, views, is_featured')
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .limit(8);

        if (error) throw error;
        if (data && data.length > 0) {
          setArticles(data);
        } else {
          setArticles([
            { id: '1', title: "Neues Luxusresort eröffnet in Alcúdia", excerpt: "Ein neues 5-Sterne-Resort mit atemberaubendem Meerblick hat seine Türen in der beliebten Ferienregion geöffnet.", cover_image_url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop", slug: "new-luxury-resort-alcudia", published_at: "2024-01-15T10:00:00Z", views: 1250, is_featured: true },
          ]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  useEffect(() => {
    if (!articles.length) return;
    const interval = setInterval(() => setCurrentIndex(prev => (prev + 1) % articles.length), 4000);
    return () => clearInterval(interval);
  }, [articles.length]);

  const nextSlide = () => {
    setCurrentIndex(prev => (prev + 1) % (articles.length || 1));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => (prev - 1 + (articles.length || 1)) % (articles.length || 1));
  };

  const getTitle = (article: Article) => article.title || '';
  const getExcerpt = (article: Article) => article.excerpt || '';
  const getCleanImageUrl = (url?: string) => {
    if (!url) return "https://olrieidgokcnhhymksnf.supabase.co/storage/v1/object/public/general-images/mallorcamagic_fallback.jpg";
    const cleanedUrl = url.replace(/([^:]\/)\/+/g, '$1');
    return cleanedUrl.endsWith('/') ? "https://olrieidgokcnhhymksnf.supabase.co/storage/v1/object/public/general-images/mallorcamagic_fallback.jpg" : cleanedUrl;
  };
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="w-full h-96 bg-gradient-subtle rounded-xl flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <div className="text-muted-foreground text-sm">Artikel werden geladen...</div>
        </div>
      </div>
    );
  }
  if (!articles.length) {
    return (
      <div className="w-full h-96 bg-gradient-subtle rounded-xl flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">Keine Artikel verfügbar</h3>
          <p className="text-muted-foreground">Artikel sind derzeit in Vorbereitung.</p>
        </div>
      </div>
    );
  }

  return (
    <section>
      <div className="relative w-full h-96 overflow-hidden rounded-xl bg-gradient-subtle" role="region" aria-label="News Carousel">
        <div 
          className="flex transition-transform duration-700 ease-in-out h-full"
          style={{ transform: isMobile ? `translateX(-${currentIndex * 100}%)` : `translateX(-${currentIndex * (100 / 3)}%)` }}
          role="group" aria-live="polite" aria-label="News articles carousel"
        >
          {articles.concat(articles.slice(0, 3)).map((article, index) => (
            <article key={`${article.id}-${index}`} className="w-full md:w-1/3 flex-shrink-0 p-2">
              <Link href={`/news/${article.slug}`} aria-label={`Read full article: ${getTitle(article)}`}>
                <Card className="h-full group overflow-hidden shadow-medium hover:shadow-large transition-all duration-300 cursor-pointer">
                  <div className="relative h-48 overflow-hidden">
                    <ImageWithFallback
                      src={getCleanImageUrl(article.cover_image_url)} 
                      alt={getTitle(article)}
                      fallbackSrc="https://olrieidgokcnhhymksnf.supabase.co/storage/v1/object/public/general-images/mallorcamagic_fallback.jpg"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    {article.is_featured && (
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-accent text-accent-foreground border-0">FEATURED</Badge>
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-black/30 text-white backdrop-blur-sm border-white/20">
                        <Calendar className="w-3 h-3 mr-1" />
                        <time dateTime={article.published_at}>{formatDate(article.published_at)}</time>
                      </Badge>
                    </div>
                    {article.views && (
                      <div className="absolute bottom-3 right-3">
                        <Badge className="bg-black/30 text-white backdrop-blur-sm border-white/20">
                          <Eye className="w-3 h-3 mr-1" />
                          <span>{article.views}</span>
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-display text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {getTitle(article)}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-3">
                      {getExcerpt(article)}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </article>
          ))}
        </div>

        <Button variant="outline" size="icon" className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm border-white/20 hover:bg-white z-10" onClick={prevSlide} aria-label="Previous news articles">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm border-white/20 hover:bg-white z-10" onClick={nextSlide} aria-label="Next news articles">
          <ChevronRight className="h-4 w-4" />
        </Button>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2" role="group" aria-label="Carousel page indicators">
          {articles.map((_, index) => (
            <button key={index} className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/70'}`} onClick={() => setCurrentIndex(index)} aria-label={`Go to slide ${index + 1}`} aria-current={index === currentIndex ? 'true' : 'false'} />
          ))}
        </div>
      </div>
    </section>
  );
}
