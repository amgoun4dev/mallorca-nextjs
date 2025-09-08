"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Slider } from "../../components/ui/slider";
import { Star, Users, Bed, Bath, Euro, MapPin, Filter } from "lucide-react";
import { supabase } from "../../integrations/supabase/client";

interface HolidayRental {
  id: string;
  slug: string;
  title_en: string;
  title_de?: string;
  title_es?: string;
  featured_image?: string;
  price: number;
  currency: string;
  price_period: string;
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  property_type: string;
  rating: number;
  review_count: number;
  city?: string;
  region?: string;
  amenities?: any;
  checkin_time?: string;
  checkout_time?: string;
  cleaning_fee?: number;
  created_at?: string;
  updated_at?: string;
  published_at?: string;
  status?: string;
  is_featured?: boolean;
  view_count?: number;
  minimum_stay?: number;
  description_en?: string;
  description_de?: string;
  description_es?: string;
  seo_title_en?: string;
  seo_title_de?: string;
  seo_title_es?: string;
  seo_description_en?: string;
  seo_description_de?: string;
  seo_description_es?: string;
  location_json?: any;
  gallery?: any;
}

export default function HolidayRentalsPage() {
  const [rentals, setRentals] = useState<HolidayRental[]>([]);
  const [filteredRentals, setFilteredRentals] = useState<HolidayRental[]>([]);
  const [loading, setLoading] = useState(true);
  const [language] = useState<'en' | 'de' | 'es'>('de');
  
  // Filter states
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedBedrooms, setSelectedBedrooms] = useState<string>('any');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedPropertyType, setSelectedPropertyType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('popular');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchRentals();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [rentals, priceRange, selectedBedrooms, selectedRegion, selectedPropertyType, sortBy]);

  const fetchRentals = async () => {
    try {
      const { data, error } = await supabase
        .from('holiday_rentals')
        .select('*')
        .eq('status', 'published');

      if (error) {
        console.error('Error fetching rentals:', error);
        return;
      }

      setRentals(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...rentals];

    // Price filter
    filtered = filtered.filter(rental => 
      rental.price >= priceRange[0] && rental.price <= priceRange[1]
    );

    // Bedrooms filter
    if (selectedBedrooms && selectedBedrooms !== 'any') {
      filtered = filtered.filter(rental => 
        rental.bedrooms >= parseInt(selectedBedrooms)
      );
    }

    // Region filter
    if (selectedRegion && selectedRegion !== 'all') {
      filtered = filtered.filter(rental => 
        rental.region?.toLowerCase().includes(selectedRegion.toLowerCase())
      );
    }

    // Property type filter
    if (selectedPropertyType && selectedPropertyType !== 'all') {
      filtered = filtered.filter(rental => 
        rental.property_type === selectedPropertyType
      );
    }

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
        break;
      default: // popular
        filtered.sort((a, b) => b.review_count - a.review_count);
    }

    setFilteredRentals(filtered);
  };

  const getLabels = () => {
    switch (language) {
      case 'de':
        return {
          title: 'Mallorca Ferienwohnungen',
          subtitle: 'Entdecken Sie die besten Ferienwohnungen und Ferienhäuser auf Mallorca',
          filters: 'Filter',
          priceRange: 'Preisbereich',
          bedrooms: 'Schlafzimmer',
          region: 'Region',
          propertyType: 'Immobilientyp',
          sortBy: 'Sortieren nach',
          any: 'Beliebig',
          all: 'Alle',
          apartment: 'Apartment',
          house: 'Haus',
          villa: 'Villa',
          finca: 'Finca',
          popular: 'Beliebt',
          priceAsc: 'Preis (niedrig zu hoch)',
          priceDesc: 'Preis (hoch zu niedrig)',
          rating: 'Bewertung',
          newest: 'Neueste',
          perNight: 'pro Nacht',
          guests: 'Gäste',
          bedroomsLabel: 'Schlafzimmer',
          bathrooms: 'Badezimmer',
          viewDetails: 'Details ansehen',
          noResults: 'Keine Ferienwohnungen gefunden',
          noResultsDesc: 'Versuchen Sie, Ihre Filter zu ändern, um mehr Ergebnisse zu sehen.',
          loading: 'Lädt Ferienwohnungen...'
        };
      case 'es':
        return {
          title: 'Alquileres de Vacaciones en Mallorca',
          subtitle: 'Descubra los mejores apartamentos y casas de vacaciones en Mallorca',
          filters: 'Filtros',
          priceRange: 'Rango de precios',
          bedrooms: 'Dormitorios',
          region: 'Región',
          propertyType: 'Tipo de propiedad',
          sortBy: 'Ordenar por',
          any: 'Cualquiera',
          all: 'Todos',
          apartment: 'Apartamento',
          house: 'Casa',
          villa: 'Villa',
          finca: 'Finca',
          popular: 'Popular',
          priceAsc: 'Precio (bajo a alto)',
          priceDesc: 'Precio (alto a bajo)',
          rating: 'Calificación',
          newest: 'Más reciente',
          perNight: 'por noche',
          guests: 'huéspedes',
          bedroomsLabel: 'dormitorios',
          bathrooms: 'baños',
          viewDetails: 'Ver detalles',
          noResults: 'No se encontraron alquileres',
          noResultsDesc: 'Intente cambiar sus filtros para ver más resultados.',
          loading: 'Cargando alquileres...'
        };
      default:
        return {
          title: 'Mallorca Holiday Rentals',
          subtitle: 'Discover the best holiday apartments and houses in Mallorca',
          filters: 'Filters',
          priceRange: 'Price Range',
          bedrooms: 'Bedrooms',
          region: 'Region',
          propertyType: 'Property Type',
          sortBy: 'Sort by',
          any: 'Any',
          all: 'All',
          apartment: 'Apartment',
          house: 'House',
          villa: 'Villa',
          finca: 'Finca',
          popular: 'Popular',
          priceAsc: 'Price (low to high)',
          priceDesc: 'Price (high to low)',
          rating: 'Rating',
          newest: 'Newest',
          perNight: 'per night',
          guests: 'guests',
          bedroomsLabel: 'bedrooms',
          bathrooms: 'bathrooms',
          viewDetails: 'View Details',
          noResults: 'No rentals found',
          noResultsDesc: 'Try changing your filters to see more results.',
          loading: 'Loading rentals...'
        };
    }
  };

  const labels = getLabels();

  const getTitle = (rental: HolidayRental) => {
    switch (language) {
      case 'de': return rental.title_de || rental.title_en;
      case 'es': return rental.title_es || rental.title_en;
      default: return rental.title_en;
    }
  };

  const getDescription = (rental: HolidayRental) => {
    const desc = rental.description_de || rental.description_en || '';
    return desc.length > 100 ? desc.substring(0, 100) + '...' : desc;
  };

  const getUniqueRegions = () => {
    const regions = rentals.map(rental => rental.region).filter((region): region is string => Boolean(region));
    return [...new Set(regions)];
  };

  const getUniquePropertyTypes = () => {
    const types = rentals.map(rental => rental.property_type).filter((type): type is string => Boolean(type));
    return [...new Set(types)];
  };

  const getRentalImage = (rental: HolidayRental) => {
    if (rental.gallery && Array.isArray(rental.gallery) && rental.gallery.length > 0) {
      const gallery = rental.gallery[0];
      if (gallery?.variants) {
        const variant720 = gallery.variants.find((v: any) => v.width === 720 && v.height === 480);
        if (variant720) return variant720.url;
        const variant540 = gallery.variants.find((v: any) => v.width === 540);
        if (variant540) return variant540.url;
        return gallery.variants[gallery.variants.length - 1]?.url;
      }
    }
    return rental.featured_image || 'https://olrieidgokcnhhymksnf.supabase.co/storage/v1/object/public/general-images/mallorcamagic_fallback.jpg';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <section className="relative py-20 bg-gradient-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
              {labels.title}
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              {labels.subtitle}
            </p>
          </div>
        </section>
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="text-lg text-muted-foreground">{labels.loading}</div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Find your dream villa, finca or beachfront stay
          </h1>
        </div>
      </section>

      {/* Filters and Results */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {/* Horizontal Filter Bar */}
          <div className="bg-white border rounded-lg p-4 mb-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Price Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Price per week</label>
                <div className="space-y-2">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={5000}
                    min={0}
                    step={50}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>€{priceRange[0]}</span>
                    <span>€{priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Bedrooms */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Bedrooms</label>
                <Select value={selectedBedrooms} onValueChange={setSelectedBedrooms}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                    <SelectItem value="5">5+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Region */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Region</label>
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="All regions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All regions</SelectItem>
                    {getUniqueRegions().map(region => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Property Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Property Type</label>
                <Select value={selectedPropertyType} onValueChange={setSelectedPropertyType}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    {getUniquePropertyTypes().map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Sort by</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Most Popular" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="price-asc">Price (low to high)</SelectItem>
                    <SelectItem value="price-desc">Price (high to low)</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <div className="text-sm text-gray-600">
              {filteredRentals.length} {filteredRentals.length === 1 ? 'property' : 'properties'} found
            </div>
          </div>

          {/* Rentals Grid */}
          {filteredRentals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredRentals.map((rental) => (
                <Card key={rental.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={getRentalImage(rental)}
                      alt={getTitle(rental)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-blue-600 text-white text-xs font-medium px-2 py-1">
                        {rental.property_type}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {getTitle(rental)}
                    </h3>
                    
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{rental.city || rental.region}</span>
                    </div>
                    
                    <div className="flex items-center mb-3">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm font-medium">{rental.rating.toFixed(1)}</span>
                      <span className="text-sm text-gray-500 ml-1">({rental.review_count} reviews)</span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{rental.max_guests} Guests</span>
                      </div>
                      <div className="flex items-center">
                        <Bed className="h-4 w-4 mr-1" />
                        <span>{rental.bedrooms}</span>
                      </div>
                      <div className="flex items-center">
                        <Bath className="h-4 w-4 mr-1" />
                        <span>{rental.bathrooms}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">{labels.noResults}</h3>
              <p className="text-muted-foreground">{labels.noResultsDesc}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
