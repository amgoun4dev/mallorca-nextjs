"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { NewsletterBlock } from "@/components/NewsletterBlock";

// Import hotel components
import { HotelHero } from "./components/HotelHero";
import { HotelBookingWidget } from "./components/HotelBookingWidget";
import { HotelGallery } from "./components/HotelGallery";
import { HotelRatings } from "./components/HotelRatings";
import { HotelDescription } from "./components/HotelDescription";
import { HotelAmenities } from "./components/HotelAmenities";
import { HotelInfo } from "./components/HotelInfo";
import { HotelLocation } from "./components/HotelLocation";
import { HotelFAQ } from "./components/HotelFAQ";
import { HotelAIContent } from "./components/HotelAIContent";
import { MoreHotels } from "./components/MoreHotels";
import { MoreActivities } from "./components/MoreActivities";
import { PropertyOffers } from "./components/PropertyOffers";
import { MallorcaGallery } from "./components/MallorcaGallery";

interface Hotel {
  id: string;
  name_en: string;
  name_de?: string;
  name_es?: string;
  slug: string;
  stars?: number;
  pricefrom?: number;
  rating?: number;
  popularity?: number;
  check_in?: string;
  check_out?: string;
  property_type?: string;
  year_opened?: number;
  year_renovated?: number;
  cnt_rooms?: number;
  cnt_suites?: number;
  cnt_floors?: number;
  location_lat?: string;
  location_lon?: string;
  hotelid?: string | number | null;
  photos_0_url?: string;
  photos_1_url?: string;
  photos_2_url?: string;
  photos_3_url?: string;
  photos_4_url?: string;
  photos_5_url?: string;
  photos_6_url?: string;
  photos_7_url?: string;
  photos_8_url?: string;
  photos_9_url?: string;
  photos_10_url?: string;
  photos_11_url?: string;
  photos_12_url?: string;
  photos_13_url?: string;
  photos_14_url?: string;
  photos_15_url?: string;
  photos_16_url?: string;
  photos_17_url?: string;
  photos_18_url?: string;
  photos_19_url?: string;
  photos_20_url?: string;
  photos_21_url?: string;
  photos_22_url?: string;
  photos_23_url?: string;
  short_facilities_0?: string;
  short_facilities_1?: string;
  short_facilities_2?: string;
  short_facilities_3?: string;
  short_facilities_4?: string;
  short_facilities_5?: string;
  short_facilities_6?: string;
  short_facilities_7?: string;
  short_facilities_8?: string;
  short_facilities_9?: string;
  short_facilities_10?: string;
  short_facilities_11?: string;
  description?: string;
  location_text?: string;
  address_en?: string;
  address_de?: string;
  address_es?: string;
  is_featured?: boolean;
  view_count?: number;
  seo_title?: string;
  seo_description?: string;
  og_title?: string;
  og_description?: string;
  ai_alt_tag?: string;
  ai_lifestyle_imagery?: string;
  ai_local_insights?: string;
  ai_llm_summary?: string;
  what_we_love?: string;
  faq_surroundings?: string;
  faq_family_friendly?: string;
  faq_remote_work_friendly?: string;
  faq_distance_to_beach?: string;
}

interface HotelDetailClientProps {
  hotel: Hotel;
}

export default function HotelDetailClient({ hotel: initialHotel }: HotelDetailClientProps) {
  const router = useRouter();
  const [language, setLanguage] = useState<'en' | 'de' | 'es'>('de');

  useEffect(() => {
    // Increment view count
    const incrementViewCount = async () => {
      try {
        await supabase
          .from('hotels')
          .update({ view_count: (initialHotel.view_count || 0) + 1 })
          .eq('id', initialHotel.id);
      } catch (error) {
        console.error('Error updating view count:', error);
      }
    };

    incrementViewCount();
  }, [initialHotel.id, initialHotel.view_count]);

  const getTitle = (hotel: Hotel): string => {
    switch (language) {
      case 'de':
        return hotel.name_de || hotel.name_en;
      case 'es':
        return hotel.name_es || hotel.name_en;
      default:
        return hotel.name_en;
    }
  };

  const getDescription = (hotel: Hotel): string => {
    return hotel.description || '';
  };

  const getStructuredData = (hotel: Hotel) => {
    const images = [
      hotel.photos_0_url,
      hotel.photos_1_url, 
      hotel.photos_2_url,
      hotel.photos_3_url
    ].filter(url => url);

    return {
      "@context": "https://schema.org",
      "@type": "Hotel",
      "name": getTitle(hotel),
      "description": hotel.description || `${getTitle(hotel)} - Hotel auf Mallorca`,
      "url": `https://mallorca-magic-nextjs-6c7wx38t9-rachids-projects-8af1b847.vercel.app/hotels/${hotel.slug}`,
      "image": images.length > 1 ? images : hotel.photos_0_url,
      "photo": images.map(url => ({
        "@type": "ImageObject",
        "url": url,
        "description": `${getTitle(hotel)} - Hotel Foto`
      })),
      "starRating": hotel.stars ? {
        "@type": "Rating",
        "ratingValue": hotel.stars,
        "bestRating": "5"
      } : undefined,
      "aggregateRating": hotel.rating ? {
        "@type": "AggregateRating",
        "ratingValue": hotel.rating,
        "bestRating": "10",
        "worstRating": "0"
      } : undefined,
      "address": hotel.address_en || hotel.location_text ? {
        "@type": "PostalAddress",
        "addressLocality": hotel.address_en || hotel.location_text,
        "addressRegion": "Mallorca",
        "addressCountry": "ES"
      } : undefined,
      "geo": hotel.location_lat && hotel.location_lon ? {
        "@type": "GeoCoordinates",
        "latitude": parseFloat(hotel.location_lat),
        "longitude": parseFloat(hotel.location_lon)
      } : undefined,
      "amenityFeature": [
        hotel.short_facilities_0,
        hotel.short_facilities_1,
        hotel.short_facilities_2,
        hotel.short_facilities_3,
        hotel.short_facilities_4,
        hotel.short_facilities_5,
        hotel.short_facilities_6,
        hotel.short_facilities_7,
        hotel.short_facilities_8,
        hotel.short_facilities_9,
        hotel.short_facilities_10,
        hotel.short_facilities_11
      ].filter(facility => facility).map(facility => ({
        "@type": "LocationFeatureSpecification",
        "name": facility
      })),
      "checkinTime": hotel.check_in || "14:00",
      "checkoutTime": hotel.check_out || "11:00",
      "numberOfRooms": hotel.cnt_rooms,
      "floorCount": hotel.cnt_floors,
      "yearBuilt": hotel.year_opened,
      "offers": hotel.pricefrom ? {
        "@type": "Offer",
        "price": hotel.pricefrom,
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock"
      } : undefined
    };
  };

  return (
    <div className="min-h-screen bg-background">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getStructuredData(initialHotel))
        }}
      />

      {/* Hero Section */}
      <HotelHero 
        backgroundImage={initialHotel.photos_0_url}
        overlayText={getTitle(initialHotel)}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Buchungs-Widget (eigene Sektion) */}
        <HotelBookingWidget 
          hotel={initialHotel}
          title={getTitle(initialHotel)}
          language={language}
        />

        {/* Gallery */}
        <HotelGallery 
          photos={[
            initialHotel.photos_0_url,
            initialHotel.photos_1_url,
            initialHotel.photos_2_url,
            initialHotel.photos_3_url,
            initialHotel.photos_4_url,
            initialHotel.photos_5_url,
            initialHotel.photos_6_url,
            initialHotel.photos_7_url,
            initialHotel.photos_8_url,
            initialHotel.photos_9_url,
            initialHotel.photos_10_url,
            initialHotel.photos_11_url,
            initialHotel.photos_12_url,
            initialHotel.photos_13_url,
            initialHotel.photos_14_url,
            initialHotel.photos_15_url,
            initialHotel.photos_16_url,
            initialHotel.photos_17_url,
            initialHotel.photos_18_url,
            initialHotel.photos_19_url,
            initialHotel.photos_20_url,
            initialHotel.photos_21_url,
            initialHotel.photos_22_url,
            initialHotel.photos_23_url
          ].filter((url): url is string => Boolean(url)).map(url => ({ url }))}
          photosByRoomType={{}}
          gallery={[
            initialHotel.photos_0_url,
            initialHotel.photos_1_url,
            initialHotel.photos_2_url,
            initialHotel.photos_3_url,
            initialHotel.photos_4_url,
            initialHotel.photos_5_url,
            initialHotel.photos_6_url,
            initialHotel.photos_7_url,
            initialHotel.photos_8_url,
            initialHotel.photos_9_url,
            initialHotel.photos_10_url,
            initialHotel.photos_11_url,
            initialHotel.photos_12_url,
            initialHotel.photos_13_url,
            initialHotel.photos_14_url,
            initialHotel.photos_15_url,
            initialHotel.photos_16_url,
            initialHotel.photos_17_url,
            initialHotel.photos_18_url,
            initialHotel.photos_19_url,
            initialHotel.photos_20_url,
            initialHotel.photos_21_url,
            initialHotel.photos_22_url,
            initialHotel.photos_23_url
          ].filter((url): url is string => Boolean(url)).map(url => ({ url }))}
        />

        {/* Ratings */}
        <HotelRatings 
          rating={initialHotel.rating}
          reviews={[]}
          language={language}
        />

        {/* Hotel Description */}
        <HotelDescription 
          description={getDescription(initialHotel)}
          language={language}
        />

        {/* Hotel Amenities */}
        <HotelAmenities 
          facilities={[
            initialHotel.short_facilities_0,
            initialHotel.short_facilities_1,
            initialHotel.short_facilities_2,
            initialHotel.short_facilities_3,
            initialHotel.short_facilities_4,
            initialHotel.short_facilities_5,
            initialHotel.short_facilities_6,
            initialHotel.short_facilities_7,
            initialHotel.short_facilities_8,
            initialHotel.short_facilities_9,
            initialHotel.short_facilities_10,
            initialHotel.short_facilities_11
          ].filter((facility): facility is string => Boolean(facility))}
          language={language}
        />

        {/* Hotel Information */}
        <HotelInfo 
          checkIn={initialHotel.check_in}
          checkOut={initialHotel.check_out}
          propertyType={initialHotel.property_type}
          yearOpened={initialHotel.year_opened}
          yearRenovated={initialHotel.year_renovated}
          cntRooms={initialHotel.cnt_rooms}
          cntSuites={initialHotel.cnt_suites}
          cntFloors={initialHotel.cnt_floors}
        />

        {/* Location */}
        <HotelLocation 
          latitude={initialHotel.location_lat}
          longitude={initialHotel.location_lon}
          address={initialHotel.address_en}
          location={initialHotel.location_text}
        />

        {/* FAQ */}
        <HotelFAQ 
          faqSurroundings={initialHotel.faq_surroundings}
          faqFamilyFriendly={initialHotel.faq_family_friendly}
          faqRemoteWorkFriendly={initialHotel.faq_remote_work_friendly}
          faqDistanceToBeach={initialHotel.faq_distance_to_beach}
        />

        {/* AI Content */}
        <HotelAIContent 
          aiLifestyleImagery={initialHotel.ai_lifestyle_imagery}
          aiLocalInsights={initialHotel.ai_local_insights}
          aiLlmSummary={initialHotel.ai_llm_summary}
          whatWeLove={initialHotel.what_we_love}
        />

        {/* More Hotels */}
        <MoreHotels 
          currentHotelId={initialHotel.id}
          cityId={undefined}
          language={language}
        />

        {/* More Activities */}
        <MoreActivities 
          currentActivityId={initialHotel.id}
          language={language}
        />

        {/* Newsletter Block */}
        <NewsletterBlock language={language} />

        {/* Property Offers */}
        <PropertyOffers language={language} />

        {/* Mallorca Gallery */}
        <MallorcaGallery />
      </div>
    </div>
  );
}
