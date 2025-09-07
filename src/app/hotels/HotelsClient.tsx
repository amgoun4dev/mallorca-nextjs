"use client";
import { useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { MapPin, Star, Wifi, Car, Utensils, Dumbbell, Waves, Coffee, ArrowRight, Grid, List } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import { HotelFilters } from "../../components/ui/hotel-filters";
import { useHotelFilters } from "../../hooks/useHotelFilters";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";

const HotelsClient = () => {
  const {
    filters,
    filteredHotels,
    featuredHotels,
    totalHotelsCount,
    availableLocations,
    loading,
    updateFilters,
    clearFilters,
    getHotelAmenities,
  } = useHotelFilters();

  const [visibleHotels, setVisibleHotels] = useState(12);
  const [loadingMore, setLoadingMore] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const loadMoreHotels = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleHotels(prev => prev + 12);
      setLoadingMore(false);
    }, 500);
  };

  const displayedHotels = filteredHotels.slice(0, visibleHotels);
  const hasMoreHotels = visibleHotels < filteredHotels.length;

  const getAmenityIcon = (amenity: string) => {
    const icons: { [key: string]: any } = {
      wifi: Wifi,
      spa: Waves,
      pool: Waves,
      restaurant: Utensils,
      bar: Coffee,
      gym: Dumbbell,
      parking: Car,
      golf: MapPin,
      beach: Waves,
      terrace: Coffee
    };
    return icons[amenity.toLowerCase()] || MapPin;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getStructuredData = () => {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mallorcamagic.de';
    return {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Luxushotels & Einzigartige Unterkünfte auf Mallorca",
      "description": "Von Luxusresorts bis hin zu charmanten Boutique-Hotels - finden Sie die perfekte Unterkunft für Ihren Mallorca-Aufenthalt.",
      "url": `${baseUrl}/hotels`,
      "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": totalHotelsCount,
        "itemListElement": featuredHotels.map((hotel, index) => ({
          "@type": "Hotel",
          "position": index + 1,
          "name": hotel.name_en,
          "url": `${baseUrl}/hotels/${hotel.slug}`,
          "image": hotel.photos_0_url,
          "starRating": hotel.stars ? {
            "@type": "Rating",
            "ratingValue": hotel.stars
          } : undefined,
          "aggregateRating": hotel.rating ? {
            "@type": "AggregateRating", 
            "ratingValue": hotel.rating,
            "bestRating": "10"
          } : undefined
        }))
      }
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        {/* Hero Section */}
        <section className="relative py-24 bg-gradient-primary text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          
          <div className="relative container mx-auto px-4 text-center">
            <div className="animate-fade-in">
              <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
                Luxushotels &
                <span className="block bg-gradient-to-r from-white to-accent bg-clip-text text-transparent">
                  Einzigartige Unterkünfte
                </span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
                Von Luxusresorts bis hin zu charmanten Boutique-Hotels - finden Sie die perfekte Unterkunft für Ihren Mallorca-Aufenthalt.
              </p>
            </div>
          </div>
        </section>

        {/* Loading Skeletons */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Skeleton className="h-12 w-64 mx-auto mb-4" />
              <Skeleton className="h-6 w-96 mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-video w-full" />
                  <CardContent className="p-6 space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Head>
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getStructuredData())
          }}
        />
      </Head>

      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-primary text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="relative container mx-auto px-4 text-center">
          <div className="animate-fade-in">
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
              Luxushotels &
              <span className="block bg-gradient-to-r from-white to-accent bg-clip-text text-transparent">
                Einzigartige Unterkünfte
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
              Von Luxusresorts bis hin zu charmanten Boutique-Hotels - finden Sie die perfekte Unterkunft für Ihren Mallorca-Aufenthalt.
            </p>
          </div>
        </div>
      </section>

      {/* Modern Filter Section */}
      <section className="py-8 bg-background border-b">
        <div className="container mx-auto px-4">
          <HotelFilters
            filters={filters}
            onFiltersChange={updateFilters}
            onClearFilters={clearFilters}
            availableLocations={availableLocations}
          />
        </div>
      </section>

      {/* Featured Hotels */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Empfohlene Hotels
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Handverlesene Luxusunterkünfte mit außergewöhnlichen Erlebnissen
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredHotels.map((hotel, index) => {
              const amenities = getHotelAmenities(hotel);
              return (
                <Card 
                  key={hotel.id} 
                  className="group overflow-hidden shadow-medium hover:shadow-large transition-all duration-300 cursor-pointer animate-fade-in"
                  style={{animationDelay: `${index * 150}ms`}}
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img 
                      src={hotel.photos_0_url || 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop'} 
                      alt={hotel.name_en}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-accent text-accent-foreground">
                        Empfohlen
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4 flex">
                      {renderStars(hotel.stars || 5)}
                    </div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="flex items-center space-x-2 text-sm mb-1">
                        <MapPin className="h-4 w-4" />
                        <span>{hotel.location_text}</span>
                      </div>
                      {hotel.rating && (
                        <div className="flex items-center space-x-1 text-sm">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <span>{hotel.rating}</span>
                        </div>
                      )}
                    </div>
                    {hotel.pricefrom && (
                      <div className="absolute bottom-4 right-4 text-white">
                        <div className="text-right">
                          <div className="text-sm opacity-80">ab</div>
                          <div className="text-lg font-bold">€{hotel.pricefrom}</div>
                          <div className="text-xs opacity-80">pro Nacht</div>
                        </div>
                      </div>
                    )}
                  </div>

                  <CardHeader>
                    <h3 className="font-display text-xl font-semibold group-hover:text-primary transition-colors">
                      {hotel.name_en}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">{hotel.description}</p>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {amenities.slice(0, 4).map((amenity, idx) => {
                        const IconComponent = getAmenityIcon(amenity);
                        return (
                          <div 
                            key={idx}
                            className="flex items-center space-x-1 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded"
                          >
                            <IconComponent className="h-3 w-3" />
                            <span className="capitalize">{amenity}</span>
                          </div>
                        );
                      })}
                      {amenities.length > 4 && (
                        <div className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                          +{amenities.length - 4} weitere
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      asChild
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    >
                      <Link href={`/hotels/${hotel.slug}`}>
                        Details anzeigen
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Filtered Hotels */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h2 className="font-display text-4xl font-bold mb-2">
                Verfügbare Hotels
              </h2>
              <p className="text-lg text-muted-foreground">
                {loading ? 'Lädt...' : `${totalHotelsCount} Hotels verfügbar • Zeige ${filteredHotels.length} Ergebnisse`}
              </p>
            </div>
            
            <div className="flex items-center gap-2 mt-4 md:mt-0">
              <span className="text-sm text-muted-foreground">Ansicht:</span>
              <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "grid" | "list")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="grid" className="flex items-center gap-2">
                    <Grid className="h-4 w-4" />
                    Kacheln
                  </TabsTrigger>
                  <TabsTrigger value="list" className="flex items-center gap-2">
                    <List className="h-4 w-4" />
                    Liste
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <Tabs value={viewMode} className="w-full">
            <TabsContent value="grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedHotels.map((hotel) => {
                const amenities = getHotelAmenities(hotel);
                return (
                  <Card 
                    key={hotel.id} 
                    className="group overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 cursor-pointer"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <img 
                        src={hotel.photos_0_url || 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop'} 
                        alt={hotel.name_en}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                      <div className="absolute top-4 left-4">
                        <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                          {hotel.stars}-Sterne
                        </Badge>
                      </div>
                      <div className="absolute top-4 right-4 flex">
                        {renderStars(hotel.stars || 5)}
                      </div>
                      <div className="absolute bottom-4 left-4 text-white">
                        {hotel.rating && (
                          <div className="flex items-center space-x-1 text-sm">
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <span>{hotel.rating}</span>
                            <span className="text-white/80">Punkte</span>
                          </div>
                        )}
                      </div>
                      {hotel.pricefrom && (
                        <div className="absolute bottom-4 right-4 text-white text-sm font-medium">
                          €{hotel.pricefrom}+
                        </div>
                      )}
                    </div>

                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-display text-lg font-semibold group-hover:text-primary transition-colors">
                          {hotel.name_en}
                        </h3>
                      </div>
                      
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground mb-3">
                        <MapPin className="h-4 w-4" />
                        <span>{hotel.location_text || hotel.location}</span>
                      </div>
                      
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {hotel.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {amenities.slice(0, 3).map((amenity, idx) => {
                          const IconComponent = getAmenityIcon(amenity);
                          return (
                            <div 
                              key={idx}
                              className="flex items-center space-x-1 text-xs text-muted-foreground"
                            >
                              <IconComponent className="h-3 w-3" />
                            </div>
                          );
                        })}
                        {amenities.length > 3 && (
                          <span className="text-xs text-muted-foreground">+{amenities.length - 3}</span>
                        )}
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        asChild
                        className="w-full"
                      >
                        <Link href={`/hotels/${hotel.slug}`}>
                          Details anzeigen
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>

            <TabsContent value="list" className="space-y-4">
              {displayedHotels.map((hotel) => {
                const amenities = getHotelAmenities(hotel);
                return (
                  <Card key={hotel.id} className="group overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="relative md:w-80 h-48 md:h-auto overflow-hidden">
                        <img 
                          src={hotel.photos_0_url || 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop'} 
                          alt={hotel.name_en}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                            {hotel.stars}-Sterne
                          </Badge>
                        </div>
                      </div>
                      
                      <CardContent className="flex-1 p-6">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                          <div className="flex-1">
                            <h3 className="font-display text-xl font-semibold group-hover:text-primary transition-colors mb-2">
                              {hotel.name_en}
                            </h3>
                            
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-4 w-4" />
                                <span>{hotel.location_text || hotel.location}</span>
                              </div>
                              
                              {hotel.rating && (
                                <div className="flex items-center space-x-1">
                                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                  <span>{hotel.rating} Punkte</span>
                                </div>
                              )}
                              
                              <div className="flex">
                                {renderStars(hotel.stars || 5)}
                              </div>
                            </div>
                            
                            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                              {hotel.description}
                            </p>
                            
                            <div className="flex flex-wrap gap-2">
                              {amenities.slice(0, 6).map((amenity, idx) => {
                                const IconComponent = getAmenityIcon(amenity);
                                return (
                                  <div 
                                    key={idx}
                                    className="flex items-center space-x-1 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded"
                                  >
                                    <IconComponent className="h-3 w-3" />
                                    <span className="capitalize">{amenity}</span>
                                  </div>
                                );
                              })}
                              {amenities.length > 6 && (
                                <div className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                                  +{amenities.length - 6} weitere
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end mt-4 md:mt-0 md:ml-6">
                            {hotel.pricefrom && (
                              <div className="text-right mb-4">
                                <div className="text-sm text-muted-foreground">ab</div>
                                <div className="text-2xl font-bold">€{hotel.pricefrom}</div>
                                <div className="text-sm text-muted-foreground">pro Nacht</div>
                              </div>
                            )}
                            
                            <Button asChild className="min-w-[120px]">
                              <Link href={`/hotels/${hotel.slug}`}>
                                Details anzeigen
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                );
              })}
            </TabsContent>
          </Tabs>

          {/* Load More Button */}
          {hasMoreHotels && (
            <div className="text-center mt-12">
              <Button 
                onClick={loadMoreHotels}
                disabled={loadingMore}
                size="lg"
                className="min-w-[200px]"
              >
                {loadingMore ? (
                  <>Lädt...</>
                ) : (
                  <>
                    Weitere Hotels laden
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        
        <div className="relative container mx-auto px-4 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Hotel eintragen
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Werden Sie Teil unseres Netzwerks aus Premium-Unterkünften und erreichen Sie tausende von Reisenden, die einzigartige Erlebnisse auf Mallorca suchen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              asChild
              className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-3 text-lg shadow-glow"
            >
              <Link href="/contact">
                Hotel eintragen
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              asChild
              className="border-white text-white hover:bg-white hover:text-primary font-semibold px-8 py-3 text-lg backdrop-blur"
            >
              <Link href="/contact">
                Hilfe erhalten
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HotelsClient;
