"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building } from "lucide-react";

interface MoreHotelsProps {
  currentHotelId: string;
  cityId?: string;
  language: 'en' | 'de' | 'es';
}

export function MoreHotels({ currentHotelId, cityId, language }: MoreHotelsProps) {
  const getLabels = () => {
    switch (language) {
      case 'de':
        return {
          title: 'Weitere Hotels',
          loading: 'Hotels werden geladen...'
        };
      case 'es':
        return {
          title: 'Más hoteles',
          loading: 'Cargando hoteles...'
        };
      default:
        return {
          title: 'More Hotels',
          loading: 'Loading hotels...'
        };
    }
  };

  const labels = getLabels();

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          {labels.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
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
