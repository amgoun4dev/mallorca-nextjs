import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface HotelDescriptionProps {
  description: string;
  language: 'en' | 'de' | 'es';
}

export function HotelDescription({ description, language }: HotelDescriptionProps) {
  const getLabels = () => {
    switch (language) {
      case 'de':
        return {
          title: 'Hotelbeschreibung',
          noDescription: 'Keine Beschreibung verfügbar.'
        };
      case 'es':
        return {
          title: 'Descripción del hotel',
          noDescription: 'No hay descripción disponible.'
        };
      default:
        return {
          title: 'Hotel Description',
          noDescription: 'No description available.'
        };
    }
  };

  const labels = getLabels();

  if (!description) {
    return null;
  }

  // Simple rich text formatting - convert line breaks to paragraphs
  const formatDescription = (text: string) => {
    return text.split('\n\n').map((paragraph, index) => (
      <p key={index} className="mb-4 last:mb-0 leading-relaxed">
        {paragraph}
      </p>
    ));
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {labels.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="prose prose-gray max-w-none">
        {formatDescription(description)}
      </CardContent>
    </Card>
  );
}
