"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface MoreActivitiesProps {
  currentActivityId: string;
  language: 'en' | 'de' | 'es';
}

export function MoreActivities({ currentActivityId, language }: MoreActivitiesProps) {
  const getLabels = () => {
    switch (language) {
      case 'de':
        return {
          title: 'Aktivitäten in der Nähe',
          loading: 'Aktivitäten werden geladen...'
        };
      case 'es':
        return {
          title: 'Actividades cercanas',
          loading: 'Cargando actividades...'
        };
      default:
        return {
          title: 'Nearby Activities',
          loading: 'Loading activities...'
        };
    }
  };

  const labels = getLabels();

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
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
