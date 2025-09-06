import { Metadata } from 'next';
import GuidesClient from './GuidesClient';

export const metadata: Metadata = {
  title: 'Mallorca Guides – Entdecken Sie die Insel | Mallorca Magic',
  description: 'Expertenführer helfen Ihnen dabei, das Beste dieser magischen Insel zu erkunden. Entdecken Sie versteckte Juwelen, beliebte Orte und Insider-Tipps für Mallorca.',
  keywords: 'Mallorca Guide, Mallorca Führer, Mallorca Tipps, Mallorca entdecken, Mallorca Insider, Balearen Guide',
  openGraph: {
    title: 'Mallorca Guides – Entdecken Sie die Insel',
    description: 'Expertenführer helfen Ihnen dabei, das Beste dieser magischen Insel zu erkunden. Entdecken Sie versteckte Juwelen, beliebte Orte und Insider-Tipps für Mallorca.',
    type: 'website',
    siteName: 'Mallorca Magic',
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/guide-instagram`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mallorca Guides – Entdecken Sie die Insel',
    description: 'Expertenführer helfen Ihnen dabei, das Beste dieser magischen Insel zu erkunden. Entdecken Sie versteckte Juwelen, beliebte Orte und Insider-Tipps für Mallorca.',
    site: '@MallorcaMagic',
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/guide-instagram`,
  },
};

export default function GuidesPage() {
  return <GuidesClient />;
}