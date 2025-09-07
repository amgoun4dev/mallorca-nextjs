"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home } from "lucide-react";

interface PropertyOffersProps {
  language: 'en' | 'de' | 'es';
}

export function PropertyOffers({ language }: PropertyOffersProps) {
  const getLabels = () => {
    switch (language) {
      case 'de':
        return {
          title: 'Immobilienangebote',
          description: 'Entdecken Sie Immobilien in der Nähe'
        };
      case 'es':
        return {
          title: 'Ofertas inmobiliarias',
          description: 'Descubre propiedades cercanas'
        };
      default:
        return {
          title: 'Property Offers',
          description: 'Discover nearby properties'
        };
    }
  };

  const labels = getLabels();

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-5 w-5" />
          {labels.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{labels.description}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 border rounded-lg">
              <div className="w-full h-32 bg-muted rounded mb-3"></div>
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
