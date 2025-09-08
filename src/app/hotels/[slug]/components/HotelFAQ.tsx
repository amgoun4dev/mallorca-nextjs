import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
    {
      id: "surroundings",
      question: "Was gibt es in der Umgebung?",
      answer: faqSurroundings
    },
    {
      id: "family",
      question: "Ist das Hotel familienfreundlich?",
      answer: faqFamilyFriendly
    },
    {
      id: "remote-work",
      question: "Ist das Hotel für Remote Work geeignet?",
      answer: faqRemoteWorkFriendly
    },
    {
      id: "beach",
      question: "Wie weit ist es zum Strand?",
      answer: faqDistanceToBeach
    }
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
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>
                <div 
                  className="prose prose-gray max-w-none text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: faq.answer || '' }}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
