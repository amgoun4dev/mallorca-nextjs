export const metadata = {
  title: "Nutzungsbedingungen | Mallorca Magic",
  description: "Allgemeine Geschäftsbedingungen von Mallorca Magic.",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">Nutzungsbedingungen</h1>
      <p className="text-muted-foreground max-w-3xl">
        Durch die Nutzung dieser Website erklären Sie sich mit unseren Bedingungen einverstanden.
      </p>
    </div>
  );
}
