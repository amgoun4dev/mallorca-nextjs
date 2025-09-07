import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '@/integrations/supabase/client';
import HotelDetailClient from './HotelDetailClient';

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

async function getHotel(slug: string): Promise<Hotel | null> {
  try {
    const { data, error } = await supabase
      .from('hotels')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();

    if (error) {
      console.error('Error fetching hotel:', error);
      return null;
    }

    if (!data) {
      return null;
    }

    // Transform the data to match our interface
    const transformedHotel: Hotel = {
      id: data.id,
      name_en: data.name_en,
      name_de: data.name_de,
      name_es: data.name_es,
      slug: data.slug,
      hotelid: data.hotelid,
      stars: data.stars,
      pricefrom: data.pricefrom,
      rating: data.rating,
      popularity: data.popularity,
      check_in: data.checkIn,
      check_out: data.checkOut,
      property_type: data.propertyType,
      year_opened: data.yearOpened,
      year_renovated: data.yearRenovated,
      cnt_rooms: data.cntRooms,
      cnt_suites: data.cntSuites,
      cnt_floors: data.cntFloors,
      location_lat: data.location_lat,
      location_lon: data.location_lon,
      photos_0_url: data.photos_0_url,
      photos_1_url: data.photos_1_url,
      photos_2_url: data.photos_2_url,
      photos_3_url: data.photos_3_url,
      photos_4_url: data.photos_4_url,
      photos_5_url: data.photos_5_url,
      photos_6_url: data.photos_6_url,
      photos_7_url: data.photos_7_url,
      photos_8_url: data.photos_8_url,
      photos_9_url: data.photos_9_url,
      photos_10_url: data.photos_10_url,
      photos_11_url: data.photos_11_url,
      photos_12_url: data.photos_12_url,
      photos_13_url: data.photos_13_url,
      photos_14_url: data.photos_14_url,
      photos_15_url: data.photos_15_url,
      photos_16_url: data.photos_16_url,
      photos_17_url: data.photos_17_url,
      photos_18_url: data.photos_18_url,
      photos_19_url: data.photos_19_url,
      photos_20_url: data.photos_20_url,
      photos_21_url: data.photos_21_url,
      photos_22_url: data.photos_22_url,
      photos_23_url: data.photos_23_url,
      short_facilities_0: data.shortFacilities_0,
      short_facilities_1: data.shortFacilities_1,
      short_facilities_2: data.shortFacilities_2,
      short_facilities_3: data.shortFacilities_3,
      short_facilities_4: data.shortFacilities_4,
      short_facilities_5: data.shortFacilities_5,
      short_facilities_6: data.shortFacilities_6,
      short_facilities_7: data.shortFacilities_7,
      short_facilities_8: data.shortFacilities_8,
      short_facilities_9: data.shortFacilities_9,
      short_facilities_10: data.shortFacilities_10,
      short_facilities_11: data.shortFacilities_11,
      description: data.description,
      location_text: data.location_text,
      address_en: data.address_en,
      address_de: data.address_de,
      address_es: data.address_es,
      is_featured: data.is_featured,
      view_count: data.view_count,
      seo_title: data.seo_title,
      seo_description: data.seo_description,
      og_title: data.og_title,
      og_description: data.og_description,
      ai_alt_tag: data.ai_alt_tag,
      ai_lifestyle_imagery: data.ai_lifestyle_imagery,
      ai_local_insights: data.ai_local_insights,
      ai_llm_summary: data.ai_llm_summary,
      what_we_love: data.what_we_love,
      faq_surroundings: data.faq_surroundings,
      faq_family_friendly: data.faq_family_friendly,
      faq_remote_work_friendly: data.faq_remote_work_friendly,
      faq_distance_to_beach: data.faq_distance_to_beach
    };

    return transformedHotel;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

function getTitle(hotel: Hotel, language: 'en' | 'de' | 'es' = 'de'): string {
  switch (language) {
    case 'de':
      return hotel.name_de || hotel.name_en;
    case 'es':
      return hotel.name_es || hotel.name_en;
    default:
      return hotel.name_en;
  }
}

function getSEOTitle(hotel: Hotel): string {
  return hotel.seo_title || `${getTitle(hotel)} - Luxushotel Mallorca | ${hotel.stars ? `${hotel.stars}-Sterne` : 'Premium'} Hotel`;
}

function getSEODescription(hotel: Hotel): string {
  const baseDescription = hotel.seo_description || hotel.description;
  if (baseDescription) return baseDescription;
  
  const starText = hotel.stars ? `${hotel.stars}-Sterne ` : '';
  const locationText = hotel.location_text ? ` in ${hotel.location_text}` : ' auf Mallorca';
  const priceText = hotel.pricefrom ? ` Preise ab €${hotel.pricefrom} pro Nacht.` : '';
  
  return `Entdecken Sie ${getTitle(hotel)}${locationText}. ${starText}Hotel mit erstklassigen Einrichtungen und exzellentem Service.${priceText} Jetzt buchen!`;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const hotel = await getHotel(slug);
  
  if (!hotel) {
    return {
      title: 'Hotel nicht gefunden - Mallorca Magic',
      description: 'Das gesuchte Hotel konnte nicht gefunden werden.',
    };
  }

  return {
    title: getSEOTitle(hotel),
    description: getSEODescription(hotel),
    keywords: `${getTitle(hotel)}, Mallorca Hotel, ${hotel.location_text ? `${hotel.location_text} Hotel, ` : ''}${hotel.stars ? `${hotel.stars} Sterne Hotel, ` : ''}Mallorca Urlaub, Hotel buchen`,
    openGraph: {
      title: hotel.og_title || getSEOTitle(hotel),
      description: hotel.og_description || getSEODescription(hotel),
      images: hotel.photos_0_url ? [hotel.photos_0_url] : [],
      type: 'website',
      url: `/hotels/${hotel.slug}`,
      siteName: 'Mallorca Magic',
    },
    twitter: {
      card: 'summary_large_image',
      title: hotel.og_title || getSEOTitle(hotel),
      description: hotel.og_description || getSEODescription(hotel),
      images: hotel.photos_0_url ? [hotel.photos_0_url] : [],
    },
    alternates: {
      canonical: `/hotels/${hotel.slug}`
    }
  };
}

export default async function HotelDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const hotel = await getHotel(slug);

  if (!hotel) {
    notFound();
  }

  return <HotelDetailClient hotel={hotel} />;
}
