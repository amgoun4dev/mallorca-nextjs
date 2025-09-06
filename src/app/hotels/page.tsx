import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { OptimizedImage } from "../../components/ui/optimized-image";
import { Star, MapPin, Wifi, Car, Utensils, Waves } from "lucide-react";

export const metadata: Metadata = {
  title: "Mallorca Hotels - Luxusunterkünfte und Boutique Hotels",
  description: "Entdecken Sie die besten Hotels auf Mallorca. Von Luxusresorts bis hin zu charmanten Boutique Hotels - finden Sie Ihre perfekte Unterkunft.",
  keywords: ["Mallorca Hotels", "Luxus Hotels", "Boutique Hotels", "Hotel Unterkünfte", "Mallorca Resorts"],
  openGraph: {
    title: "Mallorca Hotels - Luxusunterkünfte und Boutique Hotels",
    description: "Entdecken Sie die besten Hotels auf Mallorca. Von Luxusresorts bis hin zu charmanten Boutique Hotels.",
    url: "/hotels",
    images: [
      {
        url: "/lovable-uploads/4223ae41-b263-48cb-a4eb-c54e7d88de5e.png",
        width: 1200,
        height: 630,
        alt: "Mallorca Hotels",
      },
    ],
  },
  alternates: {
    canonical: "/hotels",
  },
};

// Mock data for hotels - in real implementation, this would come from Supabase
const mockHotels = [
  {
    id: "1",
    name: "Hotel Son Caliu Spa Oasis",
    location: "Palmanova",
    rating: 4.5,
    reviewCount: 1247,
    price: "€180",
    image: "https://olrieidgokcnhhymksnf.supabase.co/storage/v1/object/public/general-images/mallorcamagic_fallback.jpg",
    amenities: ["Spa", "Pool", "Restaurant", "Parking"],
    description: "Luxuriöses Spa-Hotel mit direktem Strandzugang und erstklassigem Service."
  },
  {
    id: "2", 
    name: "Hotel Can Cera",
    location: "Palma",
    rating: 4.8,
    reviewCount: 892,
    price: "€220",
    image: "https://olrieidgokcnhhymksnf.supabase.co/storage/v1/object/public/general-images/mallorcamagic_fallback.jpg",
    amenities: ["Historic", "Boutique", "Restaurant", "WiFi"],
    description: "Charmantes Boutique-Hotel in einem historischen Palast im Herzen von Palma."
  },
  {
    id: "3",
    name: "Hotel Es Port",
    location: "Sóller",
    rating: 4.6,
    reviewCount: 634,
    price: "€160",
    image: "https://olrieidgokcnhhymksnf.supabase.co/storage/v1/object/public/general-images/mallorcamagic_fallback.jpg",
    amenities: ["Mountain View", "Pool", "Restaurant", "Parking"],
    description: "Idyllisches Hotel mit Blick auf die Serra de Tramuntana und das Meer."
  }
];

const amenityIcons: Record<string, any> = {
  "Spa": Waves,
  "Pool": Waves,
  "Restaurant": Utensils,
  "Parking": Car,
  "WiFi": Wifi,
  "Historic": Star,
  "Boutique": Star,
  "Mountain View": MapPin,
};

export default function HotelsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Mallorca Hotels
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Entdecken Sie die besten Hotels auf Mallorca - von Luxusresorts bis hin zu charmanten Boutique Hotels
          </p>
        </div>
      </section>

      {/* Hotels Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockHotels.map((hotel) => (
              <Card key={hotel.id} className="group overflow-hidden hover:shadow-large transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <OptimizedImage
                    src={hotel.image}
                    alt={hotel.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white/90 text-primary font-semibold">
                      {hotel.price}/Nacht
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-display text-xl font-semibold group-hover:text-primary transition-colors">
                      {hotel.name}
                    </h3>
                    <div className="flex items-center space-x-1 ml-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{hotel.rating}</span>
                      <span className="text-sm text-muted-foreground">({hotel.reviewCount})</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{hotel.location}</span>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {hotel.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {hotel.amenities.map((amenity) => {
                      const Icon = amenityIcons[amenity] || Star;
                      return (
                        <Badge key={amenity} variant="secondary" className="text-xs">
                          <Icon className="h-3 w-3 mr-1" />
                          {amenity}
                        </Badge>
                      );
                    })}
                  </div>
                  
                  <Link 
                    href={`/hotels/${hotel.id}`}
                    className="inline-flex items-center text-primary hover:text-primary-dark font-medium text-sm transition-colors"
                  >
                    Details ansehen →
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Coming Soon Message */}
          <div className="text-center mt-12 p-8 bg-gradient-subtle rounded-xl">
            <h3 className="text-xl font-semibold mb-2">Mehr Hotels kommen bald!</h3>
            <p className="text-muted-foreground">
              Wir arbeiten daran, Ihnen eine umfassende Auswahl der besten Hotels auf Mallorca zu präsentieren.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

