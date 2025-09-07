import { Metadata } from 'next';
import { FileText, AlertCircle, Scale, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: 'Nutzungsbedingungen - Mallorca Magic | Rechtliche Bestimmungen',
  description: 'Nutzungsbedingungen für die Verwendung von Mallorca Magic. Rechtliche Bestimmungen für Inhalte, Services und Haftungsausschlüsse.',
  robots: 'noindex, follow',
  alternates: {
    canonical: '/terms'
  }
};

const Terms = () => {
  const lastUpdated = "2. Februar 2025";

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Nutzungsbedingungen
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Diese Bedingungen regeln Ihren Zugang zu und die Nutzung aller Inhalte, Produkte und Dienstleistungen auf mallorcamagic.de
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Letzte Aktualisierung: {lastUpdated}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          
          {/* Quick Overview */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                icon: FileText,
                title: "Nutzungsregeln",
                description: "Klare Regeln für die Websitenutzung"
              },
              {
                icon: Scale,
                title: "Rechtssicherheit",
                description: "Spanisches Recht und Gerichtsstand"
              },
              {
                icon: Shield,
                title: "Geistiges Eigentum",
                description: "Schutz der Urheberrechte"
              },
              {
                icon: AlertCircle,
                title: "Haftungsausschluss",
                description: "Nutzung auf eigenes Risiko"
              }
            ].map((item, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <item.icon className="h-8 w-8 text-primary mx-auto" />
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="mb-8">
              <p className="text-lg leading-relaxed mb-6">
                Diese Bedingungen regeln Ihren Zugang zu und die Nutzung aller Inhalte, Produkte und Dienstleistungen, die auf der Website{" "}
                <a href="https://mallorcamagic.de" className="text-primary hover:underline">https://mallorcamagic.de</a>{" "}
                (nachfolgend &quot;Dienst&quot;) von <strong>Mallorca Magic</strong> (&quot;wir&quot;, &quot;uns&quot; oder &quot;unser&quot;) angeboten werden.
              </p>
              <p className="text-lg leading-relaxed">
                Durch die Nutzung unserer Dienste erklären Sie sich mit diesen Nutzungsbedingungen sowie mit allen weiteren Betriebsregeln und Richtlinien einverstanden, die wir ggf. von Zeit zu Zeit veröffentlichen.
              </p>
            </div>

            <h2 className="text-2xl font-bold mb-4">1. Zustimmung zu den Bedingungen</h2>
            <p className="mb-6">
              Bitte lesen Sie diese Vereinbarung sorgfältig durch. Durch den Zugriff auf unsere Dienste oder deren Nutzung akzeptieren Sie diese Bedingungen vollständig. Wenn Sie mit einem Teil dieser Bedingungen nicht einverstanden sind, dürfen Sie unsere Dienste nicht nutzen.
            </p>

            <h2 className="text-2xl font-bold mb-4">2. Geistiges Eigentum</h2>
            <p className="mb-6">
              Diese Vereinbarung überträgt keinerlei geistiges Eigentum von uns oder Dritten auf Sie. Alle Rechte, Titel und Interessen an geistigem Eigentum verbleiben ausschließlich bei Mallorca Magic oder unseren Lizenzgebern.
            </p>

            <h2 className="text-2xl font-bold mb-4">3. Dienste von Drittanbietern</h2>
            <p className="mb-4">
              Unsere Dienste können Inhalte, Software oder Funktionen Dritter beinhalten oder auf solche verweisen (&quot;Dienste Dritter&quot;).
            </p>
            <p className="mb-4">Bitte beachten Sie:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>Die Nutzung von Diensten Dritter erfolgt auf eigenes Risiko.</li>
              <li>Wir übernehmen keine Verantwortung oder Haftung für Inhalte, Funktionen oder Schäden, die durch oder im Zusammenhang mit Diensten Dritter entstehen.</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">4. Benutzerkonten</h2>
            <p className="mb-4">
              Für bestimmte Funktionen benötigen Sie ggf. ein Benutzerkonto. In diesem Fall:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Sie verpflichten sich, bei der Registrierung wahrheitsgemäße und vollständige Angaben zu machen.</li>
              <li>Sie sind für alle Aktivitäten unter Ihrem Konto verantwortlich.</li>
              <li>Sie sind verpflichtet, Ihre Zugangsdaten sicher aufzubewahren und uns bei Verdacht auf Missbrauch umgehend zu informieren.</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">5. Kündigung</h2>
            <p className="mb-4">
              Wir behalten uns das Recht vor, Ihren Zugang zu unseren Diensten jederzeit mit oder ohne Angabe von Gründen zu beenden oder zu sperren.
            </p>
            <p className="mb-6">
              Sie können die Nutzung unserer Dienste jederzeit einstellen. Bestimmungen dieser Vereinbarung, die ihrer Natur nach über das Vertragsende hinaus gelten sollen (z. B. Haftungsausschluss, Urheberrechte, Gerichtsstand), bleiben auch nach Beendigung in Kraft.
            </p>

            <h2 className="text-2xl font-bold mb-4">6. Haftungsausschluss</h2>
            <p className="mb-4">
              Unsere Dienste werden &quot;wie besehen&quot; und &quot;nach Verfügbarkeit&quot; angeboten. Wir geben keine Garantien, weder ausdrücklich noch stillschweigend, u. a. hinsichtlich:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Marktgängigkeit,</li>
              <li>Eignung für einen bestimmten Zweck,</li>
              <li>Fehlerfreiheit oder Verfügbarkeit.</li>
            </ul>
            <p className="mb-6">
              Die Nutzung erfolgt auf eigenes Risiko. Sie sind allein verantwortlich für etwaige Schäden an Ihrem Gerät oder Datenverluste durch die Nutzung unserer Dienste.
            </p>

            <h2 className="text-2xl font-bold mb-4">7. Anwendbares Recht und Gerichtsstand</h2>
            <p className="mb-4">
              Sofern gesetzlich zulässig, unterliegen diese Bedingungen dem Recht des Königreichs Spanien.
            </p>
            <p className="mb-6">
              Ausschließlicher Gerichtsstand für alle Streitigkeiten ist Palma de Mallorca, Spanien.
            </p>

            <h2 className="text-2xl font-bold mb-4">8. Änderungen der Nutzungsbedingungen</h2>
            <p className="mb-4">
              Wir behalten uns vor, diese Bedingungen jederzeit zu aktualisieren. Über wesentliche Änderungen informieren wir Sie rechtzeitig über unsere Website oder per E-Mail.
            </p>
            <p className="mb-6">
              Die neuen Bedingungen treten nach einer angemessenen Frist in Kraft. Wenn Sie den Änderungen nicht zustimmen, müssen Sie die Nutzung unserer Dienste einstellen. Ihre fortgesetzte Nutzung nach Inkrafttreten gilt als Zustimmung zu den aktualisierten Bedingungen.
            </p>

            <div className="bg-gradient-subtle p-6 rounded-lg mt-12">
              <h3 className="text-xl font-semibold mb-3">Fragen zu den Nutzungsbedingungen?</h3>
              <p className="mb-4">
                Bei Fragen zu diesen Nutzungsbedingungen können Sie sich jederzeit an uns wenden:
              </p>
              <p className="font-medium">
                E-Mail: <a href="mailto:info@mallorcamagic.es" className="text-primary hover:underline">info@mallorcamagic.es</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Terms;