import { useState, useMemo, useEffect } from "react";
import { supabase } from "../integrations/supabase/client";
import type { HotelFilters } from "../components/ui/hotel-filters";

interface Hotel {
  id: string;
  name_en: string;
  name_de?: string;
  name_es?: string;
  slug: string;
  stars: number;
  rating?: number;
  pricefrom?: number;
  location_text?: string;
  location?: string;
  description?: string;
  photos_0_url?: string;
  photos_1_url?: string;
  photos_2_url?: string;
  shortFacilities_0?: string;
  shortFacilities_1?: string;
  shortFacilities_2?: string;
  shortFacilities_3?: string;
  shortFacilities_4?: string;
  shortFacilities_5?: string;
  shortFacilities_6?: string;
  shortFacilities_7?: string;
  shortFacilities_8?: string;
  shortFacilities_9?: string;
  shortFacilities_10?: string;
  shortFacilities_11?: string;
  is_featured: boolean;
  checkIn?: string;
  checkOut?: string;
  propertyType?: string;
  created_at?: string;
}

const defaultFilters: HotelFilters = {
  search: "",
  location: "all",
  stars: "all",
  rating: [0, 100],
  price: [0, 2000],
  amenities: [],
  propertyType: "all",
  sortBy: "rating",
};

export function useHotelFilters() {
  const [filters, setFilters] = useState<HotelFilters>(defaultFilters);
  const [allHotels, setAllHotels] = useState<Hotel[]>([]);
  const [featuredHotels, setFeaturedHotels] = useState<Hotel[]>([]);
  const [totalHotelsCount, setTotalHotelsCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Fetch all hotels from database
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        
        // Fetch featured hotels
        const { data: featuredData } = await supabase
          .from('hotels')
          .select('*')
          .eq('status', 'published')
          .eq('is_featured', true)
          .order('rating', { ascending: false })
          .limit(3);

        // Get total count of all published hotels
        const { count: totalCount } = await supabase
          .from('hotels')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'published');

        // Fetch initial batch of hotels for display (50 hotels)
        const { data: hotelsData } = await supabase
          .from('hotels')
          .select('*')
          .eq('status', 'published')
          .order('rating', { ascending: false })
          .limit(50);

        setFeaturedHotels(featuredData || []);
        setAllHotels(hotelsData || []);
        setTotalHotelsCount(totalCount || 0);
        console.log('🏨 Total hotels in DB:', totalCount, 'Loaded for display:', hotelsData?.length || 0);
      } catch (error) {
        console.error('Error fetching hotels:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  // Get unique locations from hotels
  const availableLocations = useMemo(() => {
    const locations = new Set<string>();
    allHotels.forEach(hotel => {
      if (hotel.location) locations.add(hotel.location);
      if (hotel.location_text) locations.add(hotel.location_text);
    });
    return Array.from(locations).filter(Boolean).sort();
  }, [allHotels]);

  // Get hotel amenities
  const getHotelAmenities = (hotel: Hotel): string[] => {
    const amenities = [];
    for (let i = 0; i <= 11; i++) {
      const amenity = hotel[`shortFacilities_${i}` as keyof Hotel] as string;
      if (amenity) amenities.push(amenity);
    }
    return amenities;
  };

  // Filter and sort hotels
  const filteredHotels = useMemo(() => {
    let filtered = allHotels.filter(hotel => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const searchableText = [
          hotel.name_en,
          hotel.name_de,
          hotel.name_es,
          hotel.location,
          hotel.location_text,
          hotel.description
        ].filter(Boolean).join(' ').toLowerCase();
        
        if (!searchableText.includes(searchTerm)) {
          return false;
        }
      }

      // Location filter
      if (filters.location !== "all") {
        const hotelLocation = hotel.location || hotel.location_text || "";
        if (!hotelLocation.toLowerCase().includes(filters.location.toLowerCase())) {
          return false;
        }
      }

      // Stars filter
      if (filters.stars !== "all") {
        const minStars = parseInt(filters.stars);
        if (hotel.stars < minStars) {
          return false;
        }
      }

      // Rating filter
      if (hotel.rating !== undefined) {
        if (hotel.rating < filters.rating[0] || hotel.rating > filters.rating[1]) {
          return false;
        }
      }

      // Price filter
      if (hotel.pricefrom !== undefined) {
        if (hotel.pricefrom < filters.price[0] || hotel.pricefrom > filters.price[1]) {
          return false;
        }
      }

      // Property type filter
      if (filters.propertyType !== "all") {
        if (hotel.propertyType !== filters.propertyType) {
          return false;
        }
      }

      // Amenities filter
      if (filters.amenities.length > 0) {
        const hotelAmenities = getHotelAmenities(hotel).map(a => a.toLowerCase());
        const hasAllAmenities = filters.amenities.every(amenity => 
          hotelAmenities.some(hotelAmenity => hotelAmenity.includes(amenity.toLowerCase()))
        );
        if (!hasAllAmenities) {
          return false;
        }
      }

      return true;
    });

    // Sort hotels
    switch (filters.sortBy) {
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "price_low":
        filtered.sort((a, b) => (a.pricefrom || 0) - (b.pricefrom || 0));
        break;
      case "price_high":
        filtered.sort((a, b) => (b.pricefrom || 0) - (a.pricefrom || 0));
        break;
      case "stars":
        filtered.sort((a, b) => (b.stars || 0) - (a.stars || 0));
        break;
      case "newest":
        filtered.sort((a, b) => 
          new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        );
        break;
      default:
        break;
    }

    return filtered;
  }, [allHotels, filters]);

  const updateFilters = (newFilters: HotelFilters) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
  };

  return {
    filters,
    filteredHotels,
    featuredHotels,
    totalHotelsCount,
    availableLocations,
    loading,
    updateFilters,
    clearFilters,
    getHotelAmenities,
  };
}
