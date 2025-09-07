import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface HotelLocationProps {
  latitude?: string;
  longitude?: string;
  address?: string;
  location?: string;
}

export function HotelLocation({ latitude, longitude, address, location }: HotelLocationProps) {
  if (!address && !location && !latitude) {
    return null;
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Lage
        </CardTitle>
      </CardHeader>
      <CardContent>
        {address && (
          <p className="mb-4 text-muted-foreground">{address}</p>
        )}
        {location && (
          <p className="mb-4 text-muted-foreground">{location}</p>
        )}
        {latitude && longitude && (
          <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Karte wird geladen...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
