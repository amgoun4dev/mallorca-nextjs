import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Wifi, 
  Car, 
  Coffee, 
  Utensils, 
  Waves, 
  Dumbbell, 
  Bath, 
  Wind, 
  Users, 
  Shield, 
  Dog,
  Baby,
  CreditCard,
  Monitor,
  Shirt,
  Building
} from "lucide-react";

interface HotelAmenitiesProps {
  facilities: string[];
  language: 'en' | 'de' | 'es';
}

export function HotelAmenities({ facilities, language }: HotelAmenitiesProps) {
  const getLabels = () => {
    switch (language) {
      case 'de':
        return {
          title: 'Hotelausstattung',
          noAmenities: 'Keine Ausstattung verfügbar.'
        };
      case 'es':
        return {
          title: 'Servicios del hotel',
          noAmenities: 'No hay servicios disponibles.'
        };
      default:
        return {
          title: 'Hotel Amenities',
          noAmenities: 'No amenities available.'
        };
    }
  };

  const labels = getLabels();

  // Facility mapping - Names to Icons and Labels
  const facilityMapping: Record<string, { 
    icon: React.ReactNode; 
    labels: { en: string; de: string; es: string } 
  }> = {
    'wifi': { 
      icon: <Wifi className="h-4 w-4" />, 
      labels: { en: 'Free WiFi', de: 'Kostenloses WLAN', es: 'WiFi gratuito' } 
    },
    'parking': { 
      icon: <Car className="h-4 w-4" />, 
      labels: { en: 'Parking', de: 'Parkplatz', es: 'Aparcamiento' } 
    },
    'pool': { 
      icon: <Waves className="h-4 w-4" />, 
      labels: { en: 'Swimming Pool', de: 'Schwimmbad', es: 'Piscina' } 
    },
    'fitness': { 
      icon: <Dumbbell className="h-4 w-4" />, 
      labels: { en: 'Fitness Center', de: 'Fitnesscenter', es: 'Gimnasio' } 
    },
    'restaurant': { 
      icon: <Utensils className="h-4 w-4" />, 
      labels: { en: 'Restaurant', de: 'Restaurant', es: 'Restaurante' } 
    },
    'bar': { 
      icon: <Coffee className="h-4 w-4" />, 
      labels: { en: 'Bar', de: 'Bar', es: 'Bar' } 
    },
    'air_conditioning': { 
      icon: <Wind className="h-4 w-4" />, 
      labels: { en: 'Air Conditioning', de: 'Klimaanlage', es: 'Aire acondicionado' } 
    },
    'spa': { 
      icon: <Bath className="h-4 w-4" />, 
      labels: { en: 'Spa', de: 'Spa', es: 'Spa' } 
    },
    'room_service': { 
      icon: <Users className="h-4 w-4" />, 
      labels: { en: 'Room Service', de: 'Zimmerservice', es: 'Servicio de habitaciones' } 
    },
    'safe': { 
      icon: <Shield className="h-4 w-4" />, 
      labels: { en: 'Safe', de: 'Safe', es: 'Caja fuerte' } 
    },
    'pet_friendly': { 
      icon: <Dog className="h-4 w-4" />, 
      labels: { en: 'Pet Friendly', de: 'Haustiere erlaubt', es: 'Admite mascotas' } 
    },
    'kids_club': { 
      icon: <Baby className="h-4 w-4" />, 
      labels: { en: 'Kids Club', de: 'Kinderclub', es: 'Club infantil' } 
    },
    'credit_cards': { 
      icon: <CreditCard className="h-4 w-4" />, 
      labels: { en: 'Credit Cards', de: 'Kreditkarten', es: 'Tarjetas de crédito' } 
    },
    'tv': { 
      icon: <Monitor className="h-4 w-4" />, 
      labels: { en: 'TV', de: 'Fernseher', es: 'Televisión' } 
    },
    'laundry': { 
      icon: <Shirt className="h-4 w-4" />, 
      labels: { en: 'Laundry', de: 'Wäscherei', es: 'Lavandería' } 
    },
    'elevator': { 
      icon: <Building className="h-4 w-4" />, 
      labels: { en: 'Elevator', de: 'Aufzug', es: 'Ascensor' } 
    }
  };

  if (!facilities || facilities.length === 0) {
    return null;
  }

  const getAmenityLabel = (facilityName: string): string => {
    const facility = facilityMapping[facilityName.toLowerCase()];
    if (facility) {
      return facility.labels[language];
    }
    return facilityName;
  };

  const getAmenityIcon = (facilityName: string): React.ReactNode => {
    const facility = facilityMapping[facilityName.toLowerCase()];
    return facility?.icon || <Shield className="h-4 w-4" />;
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>{labels.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {facilities.map((facilityName, index) => (
            <Badge 
              key={`${facilityName}-${index}`} 
              variant="outline" 
              className="flex items-center gap-2 p-3 h-auto justify-start"
            >
              {getAmenityIcon(facilityName)}
              <span className="text-sm">{getAmenityLabel(facilityName)}</span>
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
