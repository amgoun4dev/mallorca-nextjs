import { Metadata } from 'next';
import { Shield, Eye, Lock, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: 'Datenschutzerklärung - Mallorca Magic | Transparenter Umgang mit Ihren Daten',
  description: 'Erfahren Sie, wie Mallorca Magic Ihre persönlichen Daten schützt und verarbeitet. Vollständige Datenschutzerklärung gemäß DSGVO.',
  robots: 'noindex, follow',
  alternates: {
    canonical: '/privacy'
  }
};

const Privacy = () => {
  const lastUpdated = "2. Februar 2025";

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container  max-w-4xl px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Datenschutzerklärung
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Informationen zur Erhebung, Verarbeitung und Nutzung Ihrer personenbezogenen Daten auf mallorcamagic.de
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
                icon: Shield,
                title: "DSGVO-konform",
                description: "Datenschutz nach europäischen Standards"
              },
              {
                icon: Eye,
                title: "Transparenz",
                description: "Vollständige Offenlegung der Datennutzung"
              },
              {
                icon: Lock,
                title: "Sicherheit",
                description: "SSL-Verschlüsselung und sichere Verarbeitung"
              },
              {
                icon: Users,
                title: "Ihre Rechte",
                description: "Auskunft, Löschung und Widerspruch jederzeit"
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
            <h2 className="text-2xl font-bold mb-4">1. Verantwortlicher</h2>
            <p className="mb-6">
              Verantwortlich für die Datenverarbeitung auf dieser Website im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:
              <br /><br />
              <strong>HelloHere S.L.</strong><br />
              Pol. 2, Parcela 37<br />
              07316 Moscari, Spanien<br />
              E-Mail: <a href="mailto:info@mallorcamagic.es" className="text-primary hover:underline">info@mallorcamagic.es</a>
            </p>

            <h2 className="text-2xl font-bold mb-4">2. Erhebung und Speicherung personenbezogener Daten</h2>
            <p className="mb-4">
              Beim Besuch unserer Website <a href="http://www.mallorcamagic.de" className="text-primary hover:underline">www.mallorcamagic.de</a> werden automatisch Informationen durch den Server erfasst, die Ihr Browser übermittelt. Dazu gehören:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>IP-Adresse</li>
              <li>Datum und Uhrzeit der Anfrage</li>
              <li>Referrer-URL</li>
              <li>Browsertyp und -version</li>
              <li>Betriebssystem</li>
            </ul>
            <p className="mb-6">
              Diese Daten sind technisch notwendig, um die Website korrekt anzuzeigen, und werden für maximal 30 Tage gespeichert.
            </p>

            <h2 className="text-2xl font-bold mb-4">3. Nutzung personenbezogener Daten</h2>
            <p className="mb-4">Wir verarbeiten Ihre personenbezogenen Daten:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>zur Bereitstellung unserer Website</li>
              <li>zur Kommunikation (z. B. über Kontaktformulare)</li>
              <li>zur Durchführung von Gewinnspielen oder Nutzeraktionen</li>
              <li>zur Anzeige personalisierter Werbung</li>
              <li>zur Analyse des Nutzerverhaltens (z. B. über Cookies und Tracking-Tools)</li>
            </ul>
            <p className="mb-6">
              Rechtsgrundlage ist Art. 6 Abs. 1 lit. a, b und f DSGVO.
            </p>

            <h2 className="text-2xl font-bold mb-4">4. Cookies und Tracking</h2>
            <p className="mb-4">
              Unsere Website verwendet Cookies und ähnliche Technologien, um Inhalte zu personalisieren, Werbung anzuzeigen und das Nutzerverhalten zu analysieren. Dazu zählen u. a.:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Google Analytics</strong> (USA)</li>
              <li><strong>Meta Pixel (Facebook/Instagram)</strong> (USA)</li>
              <li><strong>Hotjar</strong> (Malta)</li>
              <li>Weitere Werbe- und Analyseanbieter</li>
            </ul>
            <p className="mb-6">
              Beim erstmaligen Besuch unserer Seite haben Sie die Möglichkeit, über das Cookie-Banner Ihre Einwilligung auszuwählen. Sie können diese jederzeit widerrufen.
            </p>

            <h2 className="text-2xl font-bold mb-4">5. Werbung und Affiliate-Links</h2>
            <p className="mb-6">
              Einige Inhalte auf mallorcamagic.de enthalten bezahlte Platzierungen, Affiliate-Links oder Verweise auf kommerzielle Partner. Wenn Sie über solche Links einen Kauf tätigen, erhalten wir ggf. eine Provision. Dies hat keinen Einfluss auf den Preis für Sie.
            </p>

            <h2 className="text-2xl font-bold mb-4">6. Weitergabe an Dritte</h2>
            <p className="mb-4">Eine Weitergabe Ihrer Daten erfolgt nur:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>an Dienstleister, die wir im Rahmen der Auftragsverarbeitung beauftragen (z. B. Hosting, Newsletter-Versand)</li>
              <li>an Werbepartner und Analyse-Tools, soweit Sie eingewilligt haben</li>
              <li>an Behörden im Rahmen gesetzlicher Verpflichtungen</li>
            </ul>
            <p className="mb-6">
              Einige Empfänger befinden sich außerhalb der EU, z. B. in den USA. In diesen Fällen stellen wir sicher, dass geeignete Garantien (z. B. Standardvertragsklauseln) bestehen.
            </p>

            <h2 className="text-2xl font-bold mb-4">7. Ihre Rechte</h2>
            <p className="mb-4">Sie haben jederzeit das Recht auf:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>Auskunft über Ihre gespeicherten Daten (Art. 15 DSGVO)</li>
              <li>Berichtigung (Art. 16 DSGVO)</li>
              <li>Löschung (Art. 17 DSGVO)</li>
              <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
              <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
              <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
              <li>Beschwerde bei einer Datenschutzbehörde, insbesondere in dem EU-Land Ihres Aufenthalts</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">8. Speicherdauer</h2>
            <p className="mb-6">
              Wir speichern personenbezogene Daten nur so lange, wie sie für den jeweiligen Zweck erforderlich sind oder gesetzliche Aufbewahrungsfristen bestehen.
            </p>

            <h2 className="text-2xl font-bold mb-4">9. Änderungen</h2>
            <p className="mb-6">
              Wir behalten uns vor, diese Datenschutzerklärung jederzeit anzupassen. Die jeweils aktuelle Version finden Sie immer auf unserer Website.
            </p>

            <h2 className="text-2xl font-bold mb-4">10. Kontakt</h2>
            <p className="mb-6">
              Bei Fragen zum Datenschutz oder zur Ausübung Ihrer Rechte kontaktieren Sie uns bitte unter:
            </p>

            <div className="bg-gradient-subtle p-6 rounded-lg mt-12">
              <h3 className="text-xl font-semibold mb-3">Kontakt Datenschutz</h3>
              <p className="mb-4">
                Bei Fragen zu dieser Datenschutzerklärung oder zur Ausübung Ihrer Rechte kontaktieren Sie uns bitte:
              </p>
              <p className="font-medium">
                📧 <a href="mailto:info@mallorcamagic.es" className="text-primary hover:underline">info@mallorcamagic.es</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Privacy;