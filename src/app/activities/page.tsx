import { Metadata } from 'next';
import ActivitiesClient from './ActivitiesClient';

export const metadata: Metadata = {
  title: 'Aktivitäten & Abenteuer auf Mallorca | Mallorca Magic',
  description: 'Unvergessliche Erlebnisse erwarten Sie auf Mallorca. Entdecken Sie Wassersport, Wandern, Abenteuer, Essen & Wein und kulturelle Aktivitäten. Über 200 Aktivitäten verfügbar.',
  keywords: 'Mallorca Aktivitäten, Mallorca Ausflüge, Wassersport Mallorca, Wandern Mallorca, Abenteuer Mallorca, Touren Mallorca',
  openGraph: {
    title: 'Aktivitäten & Abenteuer auf Mallorca',
    description: 'Unvergessliche Erlebnisse erwarten Sie auf Mallorca. Entdecken Sie Wassersport, Wandern, Abenteuer, Essen & Wein und kulturelle Aktivitäten.',
    type: 'website',
    siteName: 'Mallorca Magic',
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/activities`,
    images: [{
      url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=630&fit=crop',
      width: 1200,
      height: 630,
      alt: 'Aktivitäten & Abenteuer auf Mallorca',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aktivitäten & Abenteuer auf Mallorca',
    description: 'Unvergessliche Erlebnisse erwarten Sie auf Mallorca. Entdecken Sie Wassersport, Wandern, Abenteuer, Essen & Wein und kulturelle Aktivitäten.',
    images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=630&fit=crop'],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/activities`,
  },
};

export default function ActivitiesPage() {
  return <ActivitiesClient />;
}