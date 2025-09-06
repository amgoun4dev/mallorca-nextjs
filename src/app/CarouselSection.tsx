import { Suspense } from "react";
import dynamic from "next/dynamic";

// Dynamically import carousel components with proper paths
const NewsCarousel = dynamic(() => import("../components/ui/news-carousel").then(mod => ({ default: mod.NewsCarousel })), {
  loading: () => <CarouselSkeleton />
});
const ActivityCarousel = dynamic(() => import("../components/ui/activity-carousel").then(mod => ({ default: mod.ActivityCarousel })), {
  loading: () => <CarouselSkeleton />
});
const GuideCarousel = dynamic(() => import("../components/ui/guide-carousel").then(mod => ({ default: mod.GuideCarousel })), {
  loading: () => <CarouselSkeleton />
});

// Loading skeleton for carousels
const CarouselSkeleton = () => (
  <div className="animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64"></div>
      ))}
    </div>
  </div>
);

// Server Component for carousel sections
export function CarouselSection() {
  return (
    <>
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Aktuelle Nachrichten</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Bleiben Sie auf dem Laufenden mit den neuesten Entwicklungen und Ereignissen auf Mallorca</p>
          </div>
          <Suspense fallback={<CarouselSkeleton />}>
            <NewsCarousel />
          </Suspense>
        </div>
      </section>

      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Top bewertete Aktivitäten</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Entdecken Sie die beliebtesten und am besten bewerteten Aktivitäten auf Mallorca</p>
          </div>
          <Suspense fallback={<CarouselSkeleton />}>
            <ActivityCarousel />
          </Suspense>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Entdecken Sie unsere Top-Guides</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Handverlesene Geheimtipps und versteckte Schätze, die nur Einheimische kennen</p>
          </div>
          <Suspense fallback={<CarouselSkeleton />}>
            <GuideCarousel />
          </Suspense>
        </div>
      </section>
    </>
  );
}
