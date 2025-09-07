import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface HotelAIContentProps {
  aiLifestyleImagery?: string;
  aiLocalInsights?: string;
  aiLlmSummary?: string;
  whatWeLove?: string;
}

export function HotelAIContent({ 
  aiLifestyleImagery, 
  aiLocalInsights, 
  aiLlmSummary, 
  whatWeLove 
}: HotelAIContentProps) {
  const content = [
    { title: 'Was wir lieben', text: whatWeLove },
    { title: 'KI-Zusammenfassung', text: aiLlmSummary },
    { title: 'Lokale Einblicke', text: aiLocalInsights },
    { title: 'Lifestyle', text: aiLifestyleImagery },
  ].filter(item => item.text);

  if (content.length === 0) {
    return null;
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          KI-Einblicke
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {content.map((item, index) => (
          <div key={index}>
            <h4 className="font-semibold mb-2">{item.title}</h4>
            <p className="text-muted-foreground leading-relaxed">{item.text}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
