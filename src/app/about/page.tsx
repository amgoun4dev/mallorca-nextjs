import { Metadata } from 'next';
import { MapPin, Users, Award, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: 'Über uns - Mallorca Magic | Ihr Partner für authentische Mallorca-Erlebnisse',
  description: 'Lernen Sie das Team hinter Mallorca Magic kennen. Seit über 10 Jahren helfen wir Reisenden dabei, unvergessliche Erlebnisse auf Mallorca zu schaffen.',
  keywords: 'Über uns, Mallorca Magic, Team, Mallorca Experten, lokales Wissen, authentische Erlebnisse',
  openGraph: {
    title: 'Über uns - Mallorca Magic | Ihr Partner für authentische Mallorca-Erlebnisse',
    description: 'Lernen Sie das Team hinter Mallorca Magic kennen. Seit über 10 Jahren helfen wir Reisenden dabei, unvergessliche Erlebnisse auf Mallorca zu schaffen.',
    type: 'website',
    url: '/about',
  },
  twitter: {
    card: 'summary',
    title: 'Über uns - Mallorca Magic',
    description: 'Lernen Sie das Team hinter Mallorca Magic kennen. Seit über 10 Jahren helfen wir Reisenden dabei, unvergessliche Erlebnisse auf Mallorca zu schaffen.',
  },
  alternates: {
    canonical: '/about'
  }
};

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Leidenschaft",
      description: "Wir lieben Mallorca und teilen unsere Begeisterung für diese wunderschöne Insel mit Ihnen."
    },
    {
      icon: Users,
      title: "Lokales Wissen",
      description: "Unser Team besteht aus Einheimischen und langjährigen Residenten, die die Insel wie ihre Westentasche kennen."
    },
    {
      icon: Award,
      title: "Qualität",
      description: "Alle unsere Empfehlungen werden sorgfältig geprüft und regelmäßig aktualisiert."
    },
    {
      icon: MapPin,
      title: "Authentizität",
      description: "Wir zeigen Ihnen das echte Mallorca - abseits der Touristenpfade."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Über Mallorca Magic
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Wir sind Ihr vertrauensvoller Partner für die Entdeckung der wahren Schönheit Mallorcas. 
            Seit über 10 Jahren helfen wir Reisenden dabei, unvergessliche Erlebnisse auf dieser magischen Insel zu schaffen.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl font-bold mb-6 text-foreground">
                Unsere Mission
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Mallorca Magic wurde mit dem Ziel gegründet, Reisenden authentische und unvergessliche 
                Erlebnisse auf Mallorca zu bieten. Wir glauben, dass jeder Besucher die Möglichkeit haben sollte, 
                die wahre Schönheit und Kultur dieser Insel zu entdecken.
              </p>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Unser Team aus lokalen Experten und Inselliebhabern arbeitet unermüdlich daran, 
                Ihnen die besten Geheimtipps, versteckten Schätze und authentischen Erlebnisse zu präsentieren, 
                die Mallorca zu bieten hat.
              </p>
              <Button asChild>
                <Link href="/guide-instagram">
                  Entdecken Sie unsere Guides
                </Link>
              </Button>
            </div>
            <div>
              <Image 
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop" 
                alt="Mallorca Landschaft" 
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-bold mb-6 text-foreground">
              Unsere Werte
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Diese Prinzipien leiten uns in allem, was wir tun
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-lg mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;