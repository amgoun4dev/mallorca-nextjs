export const metadata = {
  title: "Über uns | Mallorca Magic",
  description: "Erfahren Sie mehr über Mallorca Magic – Ihr ultimativer Guide zur Insel.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">Über uns</h1>
      <p className="text-muted-foreground max-w-3xl">
        Mallorca Magic ist Ihr ultimativer Guide zur Entdeckung der Magie Mallorcas. Wir kuratieren Guides, Aktivitäten und aktuelle Nachrichten,
        damit Sie das Beste der Insel erleben. Unser Team arbeitet eng mit lokalen Experten zusammen, um authentische Empfehlungen zu liefern.
      </p>
    </div>
  );
}
