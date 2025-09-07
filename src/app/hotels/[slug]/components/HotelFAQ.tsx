import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

interface HotelFAQProps {
  faqSurroundings?: string;
  faqFamilyFriendly?: string;
  faqRemoteWorkFriendly?: string;
  faqDistanceToBeach?: string;
}

export function HotelFAQ({ 
  faqSurroundings, 
  faqFamilyFriendly, 
  faqRemoteWorkFriendly, 
  faqDistanceToBeach 
}: HotelFAQProps) {
  const faqs = [
    { question: 'Umgebung', answer: faqSurroundings },
    { question: 'Familienfreundlich', answer: faqFamilyFriendly },
    { question: 'Remote Work freundlich', answer: faqRemoteWorkFriendly },
    { question: 'Entfernung zum Strand', answer: faqDistanceToBeach },
  ].filter(faq => faq.answer);

  if (faqs.length === 0) {
    return null;
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5" />
          Häufig gestellte Fragen
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b pb-4 last:border-b-0">
            <h4 className="font-semibold mb-2">{faq.question}</h4>
            <p className="text-muted-foreground">{faq.answer}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
