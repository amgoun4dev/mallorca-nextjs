import Link from "next/link";
import { Button } from "../components/ui/button";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="font-display text-5xl font-bold mb-4">Seite nicht gefunden</h1>
      <p className="text-muted-foreground mb-8">Die von Ihnen aufgerufene Seite existiert nicht oder wurde verschoben.</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/"><Button>Zur Startseite</Button></Link>
        <Link href="/guide-instagram"><Button variant="outline">Guides</Button></Link>
        <Link href="/activities"><Button variant="outline">Aktivitäten</Button></Link>
        <Link href="/news"><Button variant="outline">News</Button></Link>
      </div>
    </div>
  );
}
