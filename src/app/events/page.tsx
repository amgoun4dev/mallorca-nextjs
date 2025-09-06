import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { OptimizedImage } from "../../components/ui/optimized-image";
import { Calendar, MapPin, Clock, Users, Music, Camera, Utensils } from "lucide-react";

export const metadata: Metadata = {
  title: "Mallorca Events - Veranstaltungen und Events",
  description: "Entdecken Sie die besten Events und Veranstaltungen auf Mallorca. Von Musikfestivals bis hin zu kulturellen Events - verpassen Sie nichts.",
  keywords: ["Mallorca Events", "Veranstaltungen", "Festivals", "Kulturelle Events", "Mallorca Termine"],
  openGraph: {
    title: "Mallorca Events - Veranstaltungen und Events",
    description: "Entdecken Sie die besten Events und Veranstaltungen auf Mallorca. Von Musikfestivals bis hin zu kulturellen Events.",
    url: "/events",
    images: [
      {
        url: "/lovable-uploads/4223ae41-b263-48cb-a4eb-c54e7d88de5e.png",
        width: 1200,
        height: 630,
        alt: "Mallorca Events",
      },
    ],
  },
  alternates: {
    canonical: "/events",
  },
};

// Mock data for events - in real implementation, this would come from Supabase
const mockEvents = [
  {
    id: "1",
    title: "Mallorca Music Festival",
    date: "2024-07-15",
    time: "20:00",
    location: "Palma",
    type: "Musik",
    price: "€45",
    image: "https://olrieidgokcnhhymksnf.supabase.co/storage/v1/object/public/general-images/mallorcamagic_fallback.jpg",
    description: "Das größte Musikfestival Mallorcas mit internationalen Künstlern und lokalen Bands.",
    attendees: 5000
  },
  {
    id: "2",
    title: "Traditionelles Finca-Fest",
    date: "2024-08-20",
    time: "18:00",
    location: "Valldemossa",
    type: "Kultur",
    price: "Kostenlos",
    image: "https://olrieidgokcnhhymksnf.supabase.co/storage/v1/object/public/general-images/mallorcamagic_fallback.jpg",
    description: "Erleben Sie traditionelle mallorquinische Kultur mit lokaler Musik, Tanz und kulinarischen Spezialitäten.",
    attendees: 800
  },
  {
    id: "3",
    title: "Fotografie-Workshop",
    date: "2024-09-10",
    time: "09:00",
    location: "Serra de Tramuntana",
    type: "Workshop",
    price: "€120",
    image: "https://olrieidgokcnhhymksnf.supabase.co/storage/v1/object/public/general-images/mallorcamagic_fallback.jpg",
    description: "Lernen Sie die Kunst der Landschaftsfotografie in den wunderschönen Bergen Mallorcas.",
    attendees: 15
  }
];

const eventTypeIcons: Record<string, any> = {
  "Musik": Music,
  "Kultur": Utensils,
  "Workshop": Camera,
  "Sport": Users,
  "Kulinarisch": Utensils,
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Mallorca Events
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Entdecken Sie die besten Events und Veranstaltungen auf Mallorca - von Musikfestivals bis hin zu kulturellen Events
          </p>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockEvents.map((event) => (
              <Card key={event.id} className="group overflow-hidden hover:shadow-large transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <OptimizedImage
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 text-primary font-semibold">
                      {event.type}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-primary text-white font-semibold">
                      {event.price}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-display text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                    {event.title}
                  </h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="text-sm">{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="text-sm">{event.time} Uhr</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Users className="h-4 w-4 mr-2" />
                      <span className="text-sm">{event.attendees} Teilnehmer</span>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {event.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {(() => {
                        const Icon = eventTypeIcons[event.type] || Calendar;
                        return <Icon className="h-4 w-4 text-primary mr-1" />;
                      })()}
                      <span className="text-sm text-primary font-medium">{event.type}</span>
                    </div>
                    <Link 
                      href={`/events/${event.id}`}
                      className="inline-flex items-center text-primary hover:text-primary-dark font-medium text-sm transition-colors"
                    >
                      Details ansehen →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Coming Soon Message */}
          <div className="text-center mt-12 p-8 bg-gradient-subtle rounded-xl">
            <h3 className="text-xl font-semibold mb-2">Mehr Events kommen bald!</h3>
            <p className="text-muted-foreground">
              Wir arbeiten daran, Ihnen eine umfassende Übersicht aller Events und Veranstaltungen auf Mallorca zu präsentieren.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

