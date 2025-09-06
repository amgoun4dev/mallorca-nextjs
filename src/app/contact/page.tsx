export const metadata = {
  title: "Kontakt | Mallorca Magic",
  description: "Kontaktieren Sie das Mallorca Magic Team.",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">Kontakt</h1>
      <p className="text-muted-foreground max-w-3xl">
        Schreiben Sie uns an <a className="text-primary underline" href="mailto:info@mallorcamagic.es">info@mallorcamagic.es</a>.
      </p>
    </div>
  );
}
