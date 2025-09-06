import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { OptimizedImage } from "../../components/ui/optimized-image";
import { MapPin, Bed, Bath, Square, Car, Waves, Mountain } from "lucide-react";

export const metadata: Metadata = {
  title: "Mallorca Immobilien - Luxusimmobilien und Traumhäuser",
  description: "Entdecken Sie exklusive Immobilien auf Mallorca. Von Luxusvillen mit Meerblick bis hin zu traditionellen Fincas - finden Sie Ihre Traumimmobilie.",
  keywords: ["Mallorca Immobilien", "Luxusimmobilien", "Villen", "Fincas", "Meerblick", "Traumimmobilie"],
  openGraph: {
    title: "Mallorca Immobilien - Luxusimmobilien und Traumhäuser",
    description: "Entdecken Sie exklusive Immobilien auf Mallorca. Von Luxusvillen mit Meerblick bis hin zu traditionellen Fincas.",
    url: "/real-estate",
    images: [
      {
        url: "/lovable-uploads/4223ae41-b263-48cb-a4eb-c54e7d88de5e.png",
        width: 1200,
        height: 630,
        alt: "Mallorca Immobilien",
      },
    ],
  },
  alternates: {
    canonical: "/real-estate",
  },
};

// Mock data for real estate - in real implementation, this would come from Supabase
const mockProperties = [
  {
    id: "1",
    title: "Luxusvilla mit Meerblick",
    location: "Port d'Andratx",
    price: "€2,500,000",
    type: "Villa",
    bedrooms: 5,
    bathrooms: 4,
    area: 450,
    image: "https://olrieidgokcnhhymksnf.supabase.co/storage/v1/object/public/general-images/mallorcamagic_fallback.jpg",
    features: ["Meerblick", "Pool", "Garten", "Garage"],
    description: "Exklusive Villa mit atemberaubendem Meerblick und privatem Pool."
  },
  {
    id: "2",
    title: "Traditionelle Finca im Gebirge",
    location: "Valldemossa",
    price: "€1,200,000",
    type: "Finca",
    bedrooms: 4,
    bathrooms: 3,
    area: 320,
    image: "https://olrieidgokcnhhymksnf.supabase.co/storage/v1/object/public/general-images/mallorcamagic_fallback.jpg",
    features: ["Gebirgsblick", "Garten", "Traditionell", "Ruhig"],
    description: "Charmante Finca mit traditioneller Architektur und wunderschönem Garten."
  },
  {
    id: "3",
    title: "Modernes Penthouse in Palma",
    location: "Palma Zentrum",
    price: "€850,000",
    type: "Penthouse",
    bedrooms: 3,
    bathrooms: 2,
    area: 180,
    image: "https://olrieidgokcnhhymksnf.supabase.co/storage/v1/object/public/general-images/mallorcamagic_fallback.jpg",
    features: ["Stadtblick", "Terrasse", "Modern", "Zentrum"],
    description: "Modernes Penthouse mit Terrasse und Blick über die Altstadt von Palma."
  }
];

const featureIcons: Record<string, any> = {
  "Meerblick": Waves,
  "Gebirgsblick": Mountain,
  "Stadtblick": MapPin,
  "Pool": Waves,
  "Garten": Square,
  "Garage": Car,
  "Terrasse": Square,
  "Traditionell": Square,
  "Modern": Square,
  "Ruhig": Square,
  "Zentrum": MapPin,
};

export default function RealEstatePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Mallorca Immobilien
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Entdecken Sie exklusive Immobilien auf Mallorca - von Luxusvillen bis hin zu traditionellen Fincas
          </p>
        </div>
      </section>

      {/* AI Property Search CTA */}
      <section className="py-16 bg-gradient-subtle">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
            Finden Sie Ihre Traumimmobilie mit KI
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Nutzen Sie unsere KI-gestützte Immobiliensuche für Zugang zu über 70.000 Immobilien auf Mallorca.
            Unser System kennt etwa 95% aller derzeit zum Verkauf stehenden Immobilien.
          </p>
          <Link 
            href="https://app.hellohere.es/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-gradient-primary text-white hover:shadow-glow transition-all duration-300 px-8 py-3 rounded-lg font-semibold"
          >
            KI Immobiliensuche starten →
          </Link>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Ausgewählte Immobilien
            </h2>
            <p className="text-lg text-muted-foreground">
              Eine kleine Auswahl der besten Immobilien auf Mallorca
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockProperties.map((property) => (
              <Card key={property.id} className="group overflow-hidden hover:shadow-large transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <OptimizedImage
                    src={property.image}
                    alt={property.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 text-primary font-semibold">
                      {property.type}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-primary text-white font-semibold">
                      {property.price}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-display text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {property.title}
                  </h3>
                  
                  <div className="flex items-center text-muted-foreground mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{property.location}</span>
                  </div>
                  
                  <div className="flex items-center space-x-4 mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Bed className="h-4 w-4 mr-1" />
                      <span>{property.bedrooms}</span>
                    </div>
                    <div className="flex items-center">
                      <Bath className="h-4 w-4 mr-1" />
                      <span>{property.bathrooms}</span>
                    </div>
                    <div className="flex items-center">
                      <Square className="h-4 w-4 mr-1" />
                      <span>{property.area}m²</span>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {property.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {property.features.map((feature) => {
                      const Icon = featureIcons[feature] || Square;
                      return (
                        <Badge key={feature} variant="secondary" className="text-xs">
                          <Icon className="h-3 w-3 mr-1" />
                          {feature}
                        </Badge>
                      );
                    })}
                  </div>
                  
                  <Link 
                    href={`/real-estate/${property.id}`}
                    className="inline-flex items-center text-primary hover:text-primary-dark font-medium text-sm transition-colors"
                  >
                    Details ansehen →
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* CTA for AI Search */}
          <div className="text-center mt-12 p-8 bg-gradient-subtle rounded-xl">
            <h3 className="text-xl font-semibold mb-2">Mehr Immobilien entdecken</h3>
            <p className="text-muted-foreground mb-4">
              Nutzen Sie unsere KI-gestützte Suche für Zugang zu über 70.000 Immobilien auf Mallorca.
            </p>
            <Link 
              href="https://app.hellohere.es/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-gradient-primary text-white hover:shadow-glow transition-all duration-300 px-6 py-2 rounded-lg font-semibold"
            >
              Alle Immobilien durchsuchen →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

