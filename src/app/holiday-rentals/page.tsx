import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { OptimizedImage } from "../../components/ui/optimized-image";
import { MapPin, Bed, Bath, Square, Car, Waves, Mountain, Wifi, Utensils } from "lucide-react";

export const metadata: Metadata = {
  title: "Mallorca Ferienwohnungen - Ferienhäuser und Apartments",
  description: "Entdecken Sie die besten Ferienwohnungen und Ferienhäuser auf Mallorca. Von Strandapartments bis hin zu ländlichen Fincas - finden Sie Ihre perfekte Ferienunterkunft.",
  keywords: ["Mallorca Ferienwohnungen", "Ferienhäuser", "Apartments", "Strandapartments", "Fincas", "Ferienunterkunft"],
  openGraph: {
    title: "Mallorca Ferienwohnungen - Ferienhäuser und Apartments",
    description: "Entdecken Sie die besten Ferienwohnungen und Ferienhäuser auf Mallorca. Von Strandapartments bis hin zu ländlichen Fincas.",
    url: "/holiday-rentals",
    images: [
      {
        url: "/lovable-uploads/4223ae41-b263-48cb-a4eb-c54e7d88de5e.png",
        width: 1200,
        height: 630,
        alt: "Mallorca Ferienwohnungen",
      },
    ],
  },
  alternates: {
    canonical: "/holiday-rentals",
  },
};

// Mock data for holiday rentals - in real implementation, this would come from Supabase
const mockRentals = [
  {
    id: "1",
    title: "Strandapartment mit Meerblick",
    location: "Cala d'Or",
    price: "€120",
    type: "Apartment",
    bedrooms: 2,
    bathrooms: 1,
    area: 85,
    guests: 4,
    image: "https://olrieidgokcnhhymksnf.supabase.co/storage/v1/object/public/general-images/mallorcamagic_fallback.jpg",
    amenities: ["Meerblick", "Strandnähe", "WiFi", "Küche"],
    rating: 4.8,
    reviewCount: 156,
    description: "Charmantes Apartment nur 50m vom Strand entfernt mit wunderschönem Meerblick."
  },
  {
    id: "2",
    title: "Traditionelle Finca im Landesinneren",
    location: "Sineu",
    price: "€180",
    type: "Finca",
    bedrooms: 3,
    bathrooms: 2,
    area: 200,
    guests: 6,
    image: "https://olrieidgokcnhhymksnf.supabase.co/storage/v1/object/public/general-images/mallorcamagic_fallback.jpg",
    amenities: ["Pool", "Garten", "Parkplatz", "Küche"],
    rating: 4.9,
    reviewCount: 89,
    description: "Authentische Finca mit privatem Pool und großem Garten - perfekt für Familien."
  },
  {
    id: "3",
    title: "Luxusvilla mit Pool",
    location: "Port d'Andratx",
    price: "€350",
    type: "Villa",
    bedrooms: 4,
    bathrooms: 3,
    area: 300,
    guests: 8,
    image: "https://olrieidgokcnhhymksnf.supabase.co/storage/v1/object/public/general-images/mallorcamagic_fallback.jpg",
    amenities: ["Pool", "Meerblick", "Garten", "Parkplatz", "WiFi"],
    rating: 4.7,
    reviewCount: 234,
    description: "Luxuriöse Villa mit Infinity-Pool und atemberaubendem Meerblick."
  }
];

const amenityIcons: Record<string, any> = {
  "Meerblick": Waves,
  "Strandnähe": Waves,
  "Pool": Waves,
  "Garten": Square,
  "Parkplatz": Car,
  "WiFi": Wifi,
  "Küche": Utensils,
  "Gebirgsblick": Mountain,
};

export default function HolidayRentalsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Mallorca Ferienwohnungen
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Entdecken Sie die besten Ferienwohnungen und Ferienhäuser auf Mallorca - von Strandapartments bis hin zu ländlichen Fincas
          </p>
        </div>
      </section>

      {/* Rentals Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockRentals.map((rental) => (
              <Card key={rental.id} className="group overflow-hidden hover:shadow-large transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <OptimizedImage
                    src={rental.image}
                    alt={rental.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 text-primary font-semibold">
                      {rental.type}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-primary text-white font-semibold">
                      {rental.price}/Nacht
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-display text-xl font-semibold group-hover:text-primary transition-colors">
                      {rental.title}
                    </h3>
                    <div className="flex items-center space-x-1 ml-2">
                      <span className="text-sm font-medium">★ {rental.rating}</span>
                      <span className="text-sm text-muted-foreground">({rental.reviewCount})</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{rental.location}</span>
                  </div>
                  
                  <div className="flex items-center space-x-4 mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Bed className="h-4 w-4 mr-1" />
                      <span>{rental.bedrooms}</span>
                    </div>
                    <div className="flex items-center">
                      <Bath className="h-4 w-4 mr-1" />
                      <span>{rental.bathrooms}</span>
                    </div>
                    <div className="flex items-center">
                      <Square className="h-4 w-4 mr-1" />
                      <span>{rental.area}m²</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs">👥 {rental.guests}</span>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {rental.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {rental.amenities.map((amenity) => {
                      const Icon = amenityIcons[amenity] || Square;
                      return (
                        <Badge key={amenity} variant="secondary" className="text-xs">
                          <Icon className="h-3 w-3 mr-1" />
                          {amenity}
                        </Badge>
                      );
                    })}
                  </div>
                  
                  <Link 
                    href={`/holiday-rentals/${rental.id}`}
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
            <h3 className="text-xl font-semibold mb-2">Mehr Ferienwohnungen kommen bald!</h3>
            <p className="text-muted-foreground">
              Wir arbeiten daran, Ihnen eine umfassende Auswahl der besten Ferienwohnungen und Ferienhäuser auf Mallorca zu präsentieren.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

