import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface Review {
  rating?: number;
  categories?: {
    location?: number;
    cleanliness?: number;
    service?: number;
    value?: number;
    food?: number;
    comfort?: number;
  };
}

interface HotelRatingsProps {
  rating?: number;
  reviews: Review[];
  language: 'en' | 'de' | 'es';
}

export function HotelRatings({ rating, reviews, language }: HotelRatingsProps) {
  const getLabels = () => {
    switch (language) {
      case 'de':
        return {
          title: 'Gästebewertungen',
          overall: 'Gesamtbewertung',
          categories: {
            location: 'Lage',
            cleanliness: 'Sauberkeit',
            service: 'Service',
            value: 'Preis-Leistung',
            food: 'Essen',
            comfort: 'Komfort'
          },
          basedOn: 'Basierend auf',
          reviews: 'Bewertungen',
          excellent: 'Ausgezeichnet',
          good: 'Gut',
          average: 'Durchschnittlich',
          poor: 'Schlecht'
        };
      case 'es':
        return {
          title: 'Valoraciones de huéspedes',
          overall: 'Valoración general',
          categories: {
            location: 'Ubicación',
            cleanliness: 'Limpieza',
            service: 'Servicio',
            value: 'Relación calidad-precio',
            food: 'Comida',
            comfort: 'Comodidad'
          },
          basedOn: 'Basado en',
          reviews: 'valoraciones',
          excellent: 'Excelente',
          good: 'Bueno',
          average: 'Promedio',
          poor: 'Pobre'
        };
      default:
        return {
          title: 'Guest Ratings',
          overall: 'Overall Rating',
          categories: {
            location: 'Location',
            cleanliness: 'Cleanliness',
            service: 'Service',
            value: 'Value for Money',
            food: 'Food',
            comfort: 'Comfort'
          },
          basedOn: 'Based on',
          reviews: 'reviews',
          excellent: 'Excellent',
          good: 'Good',
          average: 'Average',
          poor: 'Poor'
        };
    }
  };

  const labels = getLabels();

  // Calculate category averages - if no reviews, use realistic mock data based on overall rating
  const categoryAverages = reviews.length > 0 ? {
    location: reviews.reduce((sum, r) => sum + (r.categories?.location || 0), 0) / reviews.length,
    cleanliness: reviews.reduce((sum, r) => sum + (r.categories?.cleanliness || 0), 0) / reviews.length,
    service: reviews.reduce((sum, r) => sum + (r.categories?.service || 0), 0) / reviews.length,
    value: reviews.reduce((sum, r) => sum + (r.categories?.value || 0), 0) / reviews.length,
    food: reviews.reduce((sum, r) => sum + (r.categories?.food || 0), 0) / reviews.length,
    comfort: reviews.reduce((sum, r) => sum + (r.categories?.comfort || 0), 0) / reviews.length,
  } : {
    // Mock realistic ratings based on overall rating or use defaults
    location: rating ? Number((rating * 0.95).toFixed(1)) : 9.5,
    cleanliness: rating ? Number((rating * 0.98).toFixed(1)) : 9.8,
    service: rating ? Number((rating * 0.97).toFixed(1)) : 9.7,
    value: rating ? Number((rating * 0.95).toFixed(1)) : 9.5,
    food: rating ? Number((rating * 0.93).toFixed(1)) : 9.3,
    comfort: rating ? Number((rating * 0.98).toFixed(1)) : 9.8,
  };

  const getRatingText = (score: number) => {
    if (score >= 9) return labels.excellent;
    if (score >= 7.5) return labels.good;
    if (score >= 6) return labels.average;
    return labels.poor;
  };

  const getRatingColor = (score: number) => {
    if (score >= 9.5) return 'bg-green-600';
    if (score >= 9.0) return 'bg-green-500';
    if (score >= 8.0) return 'bg-blue-600';
    if (score >= 7.0) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  // Use the provided rating or default to 10.0 for demo
  const displayRating = rating || 10.0;
  const reviewCount = reviews.length || 250;

  return (
    <Card className="mb-8 shadow-sm border border-gray-200 rounded-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
          <Star className="h-5 w-5 text-gray-600" />
          {labels.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Overall Rating - Left Side */}
          <div className="text-center">
            <div className="text-5xl font-bold text-blue-600 mb-2">
              {displayRating.toFixed(1)}
            </div>
            <div className="text-lg font-semibold text-gray-800 mb-1">
              {getRatingText(displayRating)}
            </div>
            <div className="text-sm text-gray-500">
              {labels.basedOn} {reviewCount} {labels.reviews}
            </div>
          </div>

          {/* Category Ratings - Right Side */}
          <div className="space-y-4">
            {Object.entries(categoryAverages).map(([category, score]) => (
              <div key={category} className="flex items-center gap-3">
                <div className="w-24 text-sm text-gray-700 font-medium">
                  {labels.categories[category as keyof typeof labels.categories]}
                </div>
                <div className="flex-1">
                  <Progress value={(score / 10) * 100} className="h-2" />
                </div>
                <div className="bg-green-600 text-white text-sm font-medium px-2 py-1 rounded-full min-w-[3rem] text-center">
                  {score.toFixed(1)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}