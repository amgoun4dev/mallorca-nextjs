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
import { SafeGuideContent } from "../../../components/ui/safe-guide-content";
import { CarRentalWidget } from "../../../components/activity/CarRentalWidget";
import { FlightBookingWidget } from "../../../components/activity/FlightBookingWidget";

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

interface RelatedGuide {
  id: string;
  title_de: string;
  title_en: string;
  slug_de: string;
  thumbnail: string;
  location: string;
  reading_time: number;
}

interface GuideDetailClientProps {
  slug: string;
}

const GuideDetailClient = ({ slug }: GuideDetailClientProps) => {
  const [guide, setGuide] = useState<Guide | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [relatedGuides, setRelatedGuides] = useState<RelatedGuide[]>([]);
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

  const getShareData = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const title = guide?.title_de || guide?.title_en || 'Mallorca Magic Guide';
    const description = guide?.long_desc_de || guide?.long_desc_en || guide?.short_desc_de || 'Entdecken Sie diesen erstaunlichen Guide, um versteckte Juwelen in Mallorca zu finden.';
    const image = getGuideImages(guide)[0];
    
    return { url, title, description, image };
  };

  const shareOnFacebook = () => {
    const { url } = getShareData();
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const shareOnLinkedIn = () => {
    const { url, title, description } = getShareData();
    const shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const shareOnPinterest = () => {
    const { url, title, image } = getShareData();
    const shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(image)}&description=${encodeURIComponent(title)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const copyLinkForInstagram = async () => {
    if (typeof window !== 'undefined') {
      await navigator.clipboard.writeText(window.location.href);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  const getReadingTime = (guide: Guide | null) => {
    return guide?.reading_time || 5;
  };

  const getExcerpt = (guide: Guide | null) => {
    return guide?.long_desc_de || guide?.long_desc_en || guide?.short_desc_de || 'Entdecken Sie diesen erstaunlichen Guide, um versteckte Juwelen in Mallorca zu finden.';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
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
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/guide-instagram">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück zu den Guides
            </Link>
          </Button>
          
          <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
            <Link href="/guide-instagram" className="hover:text-primary">Guides</Link>
            <span>/</span>
            <Link href={`/guide-instagram?location=${guide.location?.toLowerCase()}`} className="hover:text-primary">
              {guide.location}
            </Link>
            <span>/</span>
            <span>{guide.title_de || guide.title_en}</span>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Article Header */}
            <div className="mb-8">
              {guide.location && <Badge className="mb-4">{guide.location}</Badge>}
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
                {guide.title_de || guide.title_en}
              </h1>
              <p className="text-xl text-muted-foreground mb-6">
                {getExcerpt(guide)}
              </p>
              
              {/* Social Share Buttons */}
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-sm font-medium text-muted-foreground">Teilen:</span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={shareOnFacebook}
                    className="h-8 w-8 p-0"
                  >
                    <Facebook className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={shareOnLinkedIn}
                    className="h-8 w-8 p-0"
                  >
                    <Linkedin className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={shareOnPinterest}
                    className="h-8 w-8 p-0"
                  >
                    <Share className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyLinkForInstagram}
                    className={`h-8 px-3 transition-colors ${linkCopied ? 'bg-green-50 border-green-200' : ''}`}
                  >
                    {linkCopied ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                        <span className="text-xs text-green-600">Kopiert!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1" />
                        <span className="text-xs">Instagram</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              {/* Article Meta */}
              <div className="flex flex-wrap items-center gap-6 py-4 border-y">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>{guide.author?.split(' ').map((n: string) => n[0]).join('') || 'MM'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{guide.author || 'Mallorca Magic'}</div>
                    <div className="text-sm text-muted-foreground">Guide</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(guide.created_at)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{getReadingTime(guide)} Min. Lesezeit</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{(guide.view_count || 0).toLocaleString()} Aufrufe</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Image with Gallery */}
            <div className="mb-8">
              <div className="relative aspect-video overflow-hidden rounded-lg">
                <img 
                  src={images[currentImageIndex]} 
                  alt={guide.title_de || guide.title_en}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20"></div>
                
                {/* Gallery Navigation - only show if more than one image */}
                {images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 text-white hover:bg-white/30"
                      onClick={() => setCurrentImageIndex((prev) => prev === 0 ? images.length - 1 : prev - 1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 text-white hover:bg-white/30"
                      onClick={() => setCurrentImageIndex((prev) => prev === images.length - 1 ? 0 : prev + 1)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    
                    {/* Gallery Indicators */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none mb-8">
              <SafeGuideContent guide={guide} />
            </div>

            {/* Categories */}
            {guide.category && (
              <div className="mb-8">
                <h3 className="font-semibold mb-4">Kategorien</h3>
                <div className="flex flex-wrap gap-2">
                  {guide.category.split(',').map((category: string) => (
                    <Badge key={category.trim()} variant="outline">
                      <Tag className="mr-1 h-3 w-3" />
                      {category.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Author Bio */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback>{guide.author?.split(' ').map((n: string) => n[0]).join('') || 'MM'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Über {guide.author || 'Mallorca Magic'}</h3>
                    <p className="text-muted-foreground">Experten-Guide für die Entdeckung des Besten von Mallorca.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Car Rental Widget */}
              <CarRentalWidget />

              {/* Flight Booking Widget */}
              <FlightBookingWidget />

              {/* Share Actions Sidebar */}
              <Card className="shadow-soft">
                <CardContent className="p-3">
                  <h3 className="font-medium mb-2 flex items-center text-xs">
                    <Share className="mr-1 h-3 w-3" />
                    Teilen
                  </h3>
                  <div className="flex gap-1">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="justify-center p-1 h-8 w-8"
                      onClick={shareOnFacebook}
                    >
                      <Facebook className="h-3 w-3 text-blue-600" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="justify-center p-1 h-8 w-8"
                      onClick={shareOnLinkedIn}
                    >
                      <Linkedin className="h-3 w-3 text-blue-700" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="justify-center p-1 h-8 w-8"
                      onClick={shareOnPinterest}
                    >
                      <Share className="h-3 w-3 text-red-600" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={`justify-center p-1 h-8 w-8 transition-colors ${linkCopied ? 'bg-green-50 border-green-200' : ''}`}
                      onClick={copyLinkForInstagram}
                    >
                      {linkCopied ? (
                        <CheckCircle className="h-3 w-3 text-green-600" />
                      ) : (
                        <Copy className="h-3 w-3 text-pink-600" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Info */}
              <Card className="shadow-soft">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Schnellinfo</h3>
                  <div className="space-y-3 text-sm">
                    {guide.location && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ort:</span>
                        <span className="capitalize">{guide.location}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lesezeit:</span>
                      <span>{getReadingTime(guide)} Minuten</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Aufrufe:</span>
                      <span>{(guide.view_count || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Veröffentlicht:</span>
                      <span>{formatDate(guide.created_at)}</span>
                    </div>
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
                        <Link 
                          key={relatedGuide.id}
                          href={`/guide-instagram/${relatedGuide.slug_de}`}
                          className="block group"
                        >
                          <div className="flex space-x-3">
                            <img 
                              src={relatedGuide.thumbnail ? relatedGuide.thumbnail.split(', ')[0] : "https://olrieidgokcnhhymksnf.supabase.co/storage/v1/object/public/general-images/mallorcamagic_fallback.jpg"} 
                              alt={relatedGuide.title_de || relatedGuide.title_en}
                              className="w-16 h-16 object-cover rounded group-hover:scale-105 transition-transform"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">
                                {relatedGuide.title_de || relatedGuide.title_en}
                              </h4>
                              <div className="flex items-center space-x-2 mt-1 text-xs text-muted-foreground">
                                {relatedGuide.location && (
                                  <Badge variant="outline" className="text-xs py-0">
                                    {relatedGuide.location}
                                  </Badge>
                                )}
                                <span>{relatedGuide.reading_time || 5} Min</span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                    
                    <Button variant="outline" size="sm" asChild className="w-full mt-4">
                      <Link href="/guide-instagram">
                        Alle Guides anzeigen
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideDetailClient;
