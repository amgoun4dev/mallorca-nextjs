import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Heart, Brain } from "lucide-react";
import { SafeContent } from "@/components/ui/safe-content";

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
  return (
    <div className="space-y-8">
      {/* What We Love */}
      {whatWeLove && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Das lieben wir an diesem Hotel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SafeContent 
              content={whatWeLove}
              isHtml={true}
              className="prose prose-gray max-w-none"
            />
          </CardContent>
        </Card>
      )}

      {/* AI Summary */}
      {aiLlmSummary && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-500" />
              Hotel-Zusammenfassung
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SafeContent 
              content={aiLlmSummary}
              isHtml={true}
              className="prose prose-gray max-w-none"
            />
          </CardContent>
        </Card>
      )}

      {/* Local Insights */}
      {aiLocalInsights && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              Lokale Einblicke
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SafeContent 
              content={aiLocalInsights}
              isHtml={true}
              className="prose prose-gray max-w-none"
            />
          </CardContent>
        </Card>
      )}

      {/* Lifestyle Imagery */}
      {aiLifestyleImagery && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-green-500" />
              Lifestyle & Ambiente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SafeContent 
              content={aiLifestyleImagery}
              isHtml={true}
              className="prose prose-gray max-w-none"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
