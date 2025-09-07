import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { Button } from "../components/ui/button";
import { ErrorBoundary } from "../components/ErrorBoundary";
import ClientNewsTicker from "./ticker-client";
import { StatsSection } from "./StatsSection";
import { CarouselSection } from "./CarouselSection";

// Server Component - renders on the server for better performance
export default function HomeServer() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Server rendered */}
      <section className="hero-section relative min-h-[90vh] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/lovable-uploads/4223ae41-b263-48cb-a4eb-c54e7d88de5e.png"
            alt="Mallorca Magic - Beautiful landscape of Mallorca"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
            quality={75}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
        </div>
        <div className="hero-overlay absolute inset-0 bg-black/40 my-0"></div>
        
        {/* News ticker - Client component for interactivity */}
        <div className="absolute top-0 left-0 right-0 bg-black/30 backdrop-blur-sm border-b border-white/10 overflow-hidden z-10">
          <ClientNewsTicker />
        </div>
        
        {/* Floating elements - Static, server rendered */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-accent/20 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-32 left-20 w-12 h-12 bg-primary-light/20 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        
        {/* Hero content - Server rendered */}
        <div className="relative container mx-auto px-4 text-center my-[10px] pt-20">
          <div className="fade-in">
            <h1 aria-label="Entdecken Sie die Magie Mallorcas" className="font-display text-4xl md:text-5xl font-bold mb-6 leading-relaxed py-4">
              <span className="sr-only">Entdecken Sie die Magie Mallorcas</span>
              <span className="block">
                Entdecken Sie die{' '}<span className="bg-gradient-to-r from-white to-accent bg-clip-text text-transparent text-5xl py-2">Magie Mallorcas</span>
              </span>
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
              Ihr ultimativer Guide für das Paradies. Von versteckten Stränden zu Luxusunterkünften, unvergessliche Abenteuer bis hin zu Traumimmobilien.
            </p>
          </div>
          
          {/* CTA buttons - Server rendered with client-side navigation */}
          <div className="flex flex-col sm:flex-row gap-2 md:gap-4 justify-center items-center scale-in px-4" style={{ animationDelay: '300ms' }}>
            <Button size="lg" asChild className="bg-white text-primary hover:bg-white/90 font-semibold px-4 md:px-8 py-2 md:py-3 text-base md:text-lg shadow-glow hover:shadow-large transition-all duration-300 w-full sm:w-auto">
              <Link href="/guide-instagram">
                Guides entdecken
                <ArrowRight className="ml-2 h-4 md:h-5 w-4 md:w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white bg-white/10 text-white hover:bg-white hover:text-primary font-semibold px-4 md:px-8 py-2 md:py-3 text-base md:text-lg backdrop-blur transition-all duration-300 w-full sm:w-auto">
              <Link href="/activities">
                Aktivitäten finden
                <ArrowRight className="ml-2 h-4 md:h-5 w-4 md:w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white bg-white/10 text-white hover:bg-white hover:text-primary font-semibold px-4 md:px-8 py-2 md:py-3 text-base md:text-lg backdrop-blur transition-all duration-300 w-full sm:w-auto">
              <Link href="/news">
                täglich Mallorca News
                <ArrowRight className="ml-2 h-4 md:h-5 w-4 md:w-5" />
              </Link>
            </Button>
          </div>
          
          {/* Stats section - Client component for counters */}
          <ErrorBoundary>
            <StatsSection />
          </ErrorBoundary>
        </div>
      </section>

      {/* AI Property Search Section - Server rendered */}
      <section className="py-20 bg-gradient-subtle relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 leading-tight py-2">
            Entdecken Sie Ihre Traumimmobilie mit der weltweit ersten
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent py-2">
              KI-gestützten Immobiliensuche
            </span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto mb-8 leading-relaxed">
            Zugang zu über 70.000 Immobilien mit unserer KI-gestützten Immobiliensuche. Unser System kennt etwa 
            95% aller derzeit zum Verkauf stehenden Immobilien auf dem Markt, was Ihre Suche effizient und stressfrei macht. 
            Verabschieden Sie sich von stundenlangem Durchstöbern von Immobilienportalen und lassen Sie unsere KI Ihnen 
            schnell dabei helfen, Ihre ideale Immobilie zu finden.
          </p>

          <Button size="lg" asChild className="bg-gradient-primary text-white hover:shadow-glow transition-all duration-300 mb-16">
            <a href="https://app.hellohere.es/" target="_blank" rel="noopener noreferrer">
              KI Immobiliensuche - Let´s go
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
        </div>
      </section>

      {/* Carousel sections - Server component with client components inside */}
      <CarouselSection />

      {/* Call to Action Section - Server rendered */}
      <section className="py-20 bg-gradient-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/5 rounded-full animate-float"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-accent/20 rounded-full animate-float" style={{
          animationDelay: '1s'
        }}></div>
        
        <div className="relative container mx-auto px-4 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Bereit, Mallorca zu entdecken?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Schließen Sie sich Tausenden von Reisenden an, die die Magie dieser wunderschönen Insel entdeckt haben. 
            Beginnen Sie noch heute mit der Planung Ihres perfekten Mallorca-Abenteuers.
          </p>
          <div className="flex justify-center">
            <Button size="lg" asChild className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-3 text-lg shadow-glow">
              <Link href="/guide-instagram">
                Jetzt entdecken
                <Compass className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
