"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, MapPin, User, Tag, Eye, ChevronLeft, ChevronRight, Facebook, Linkedin, Share, Copy, CheckCircle } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { supabase } from "../../../integrations/supabase/client";
import { ImageWithFallback } from "../../../components/ui/image-with-fallback";

interface Guide {
  id: string;
  title_en: string;
  title_de: string;
  slug_de: string;
  long_desc_de: string;
  long_desc_en: string;
  short_desc_de: string;
  location: string;
  category: string;
  thumbnail: string;
  reading_time: number;
  view_count: number;
  created_at: string;
  status: string;
  author: string;
}

interface GuideDetailClientProps {
  slug: string;
}

const GuideDetailClient = ({ slug }: GuideDetailClientProps) => {
  const [guide, setGuide] = useState<Guide | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [relatedGuides, setRelatedGuides] = useState<Guide[]>([]);
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchGuide();
    }
  }, [slug]);

  const fetchGuide = async () => {
    try {
      const { data, error } = await supabase
        .from('guides')
        .select('*')
        .eq('slug_de', slug)
        .eq('status', 'published')
        .maybeSingle();

      if (error) {
        console.error('Error fetching guide:', error);
        return;
      }

      setGuide(data);
      
      // Fetch related guides only if guide exists
      if (data) {
        const { data: related } = await supabase
          .from('guides')
          .select('id, title_de, title_en, slug_de, thumbnail, location, reading_time')
          .eq('status', 'published')
          .neq('id', data.id)
          .limit(3);
        
        setRelatedGuides(related || []);
      }

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGuideImages = (guide: Guide | null) => {
    if (!guide) return [];
    
    const images = [];
    if (guide.thumbnail) {
      const thumbnails = guide.thumbnail.split(', ');
      // Filter out invalid/empty URLs
      const validThumbnails = thumbnails.filter(url => 
        url && 
        !url.endsWith('//') && 
        !url.endsWith('/') && 
        url.length > 'https://olrieidgokcnhhymksnf.supabase.co/storage/v1/object/public/guide-title-images/'.length
      );
      images.push(...validThumbnails);
    }
    
    // If no valid images, use fallback
    if (images.length === 0) {
      images.push("https://olrieidgokcnhhymksnf.supabase.co/storage/v1/object/public/general-images/mallorcamagic_fallback.jpg");
    }
    
    return images;
  };

  const copyLinkForInstagram = async () => {
    if (typeof window !== 'undefined') {
      await navigator.clipboard.writeText(window.location.href);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Guide nicht gefunden</h1>
          <Link href="/guide-instagram">
            <Button>Zurück zu den Guides</Button>
          </Link>
        </div>
      </div>
    );
  }

  const images = getGuideImages(guide);
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <section className="py-8 bg-background border-b">
        <div className="container mx-auto px-4">
          <Link href="/guide-instagram">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zurück zu den Guides
            </Button>
          </Link>
          
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Badge variant="secondary" className="mb-2">
                {guide.location}
              </Badge>
              <h1 className="font-display text-3xl md:text-5xl font-bold mb-4">
                {guide.title_de || guide.title_en}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>{guide.reading_time || 5} Min. Lesezeit</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4" />
                  <span>{(guide.view_count || 0).toLocaleString()} Aufrufe</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(guide.created_at).toLocaleDateString('de-DE')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      {images.length > 0 && (
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="relative aspect-video rounded-lg overflow-hidden shadow-medium mb-4">
                <ImageWithFallback
                  src={images[currentImageIndex]}
                  alt={guide.title_de || guide.title_en}
                  fallbackSrc="https://olrieidgokcnhhymksnf.supabase.co/storage/v1/object/public/general-images/mallorcamagic_fallback.jpg"
                  className="w-full h-full object-cover"
                />
                
                {images.length > 1 && (
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                      onClick={() => setCurrentImageIndex((prev) => prev === 0 ? images.length - 1 : prev - 1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                      onClick={() => setCurrentImageIndex((prev) => prev === images.length - 1 ? 0 : prev + 1)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
              
              {images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                        currentImageIndex === index ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      <ImageWithFallback
                        src={image}
                        alt={`${guide.title_de || guide.title_en} ${index + 1}`}
                        fallbackSrc="https://olrieidgokcnhhymksnf.supabase.co/storage/v1/object/public/general-images/mallorcamagic_fallback.jpg"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <Card className="shadow-soft">
                  <CardContent className="p-8">
                    {/* Description */}
                    {(guide.long_desc_de || guide.long_desc_en || guide.short_desc_de) && (
                      <div className="prose prose-lg max-w-none mb-8">
                        <div 
                          dangerouslySetInnerHTML={{ 
                            __html: guide.long_desc_de || guide.long_desc_en || guide.short_desc_de 
                          }} 
                        />
                      </div>
                    )}

                    {/* Share Section */}
                    <div className="border-t pt-6">
                      <h3 className="font-semibold mb-4">Teilen Sie diesen Guide</h3>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')}
                        >
                          <Facebook className="h-4 w-4 mr-2" />
                          Facebook
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank')}
                        >
                          <Linkedin className="h-4 w-4 mr-2" />
                          LinkedIn
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={copyLinkForInstagram}
                        >
                          {linkCopied ? (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Kopiert!
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4 mr-2" />
                              Link kopieren
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-8 space-y-6">
                  {/* Guide Info */}
                  <Card className="shadow-soft">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-4">Guide Informationen</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 text-sm">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span>{guide.location}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Clock className="h-4 w-4 text-primary" />
                          <span>{guide.reading_time || 5} Min. Lesezeit</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Eye className="h-4 w-4 text-primary" />
                          <span>{(guide.view_count || 0).toLocaleString()} Aufrufe</span>
                        </div>
                        {guide.author && (
                          <div className="flex items-center space-x-2 text-sm">
                            <User className="h-4 w-4 text-primary" />
                            <span>{guide.author}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Related Guides */}
                  {relatedGuides.length > 0 && (
                    <Card className="shadow-soft">
                      <CardContent className="p-6">
                        <h3 className="font-semibold mb-4">Ähnliche Guides</h3>
                        <div className="space-y-4">
                          {relatedGuides.map((relatedGuide) => (
                            <Link key={relatedGuide.id} href={`/guide-instagram/${relatedGuide.slug_de}`}>
                              <div className="group cursor-pointer">
                                <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2 mb-1">
                                  {relatedGuide.title_de || relatedGuide.title_en}
                                </h4>
                                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                  <MapPin className="h-3 w-3" />
                                  <span>{relatedGuide.location}</span>
                                  <Clock className="h-3 w-3" />
                                  <span>{relatedGuide.reading_time || 5}Min</span>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GuideDetailClient;
