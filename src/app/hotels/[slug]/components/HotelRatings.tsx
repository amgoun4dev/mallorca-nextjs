import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

interface HotelRatingsProps {
  rating?: number;
  reviews: any[];
  language: 'en' | 'de' | 'es';
}

export function HotelRatings({ rating, reviews, language }: HotelRatingsProps) {
  const getLabels = () => {
    switch (language) {
      case 'de':
        return {
          title: 'Bewertungen',
          noRating: 'Keine Bewertungen verfügbar.'
        };
      case 'es':
        return {
          title: 'Valoraciones',
          noRating: 'No hay valoraciones disponibles.'
        };
      default:
        return {
          title: 'Ratings',
          noRating: 'No ratings available.'
        };
    }
  };

  const labels = getLabels();

  if (!rating) {
    return null;
  }

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating / 2);
    const hasHalfStar = rating % 2 >= 1;
    
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`h-5 w-5 ${
              index < fullStars
                ? 'fill-yellow-400 text-yellow-400'
                : index === fullStars && hasHalfStar
                ? 'fill-yellow-400/50 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-muted-foreground">
          {rating}/10
        </span>
      </div>
    );
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>{labels.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="text-3xl font-bold">{rating}</div>
          <div>
            {renderStars(rating)}
            <div className="text-sm text-muted-foreground mt-1">
              {reviews.length} Bewertungen
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
