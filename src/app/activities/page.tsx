import { Metadata } from 'next';
import ActivitiesClient from './ActivitiesClient';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mallorcamagic.de';

export const metadata: Metadata = {
  title: 'Aktivitäten & Abenteuer auf Mallorca | Mallorca Magic',
  description: 'Unvergessliche Erlebnisse erwarten Sie auf Mallorca. Entdecken Sie Wassersport, Wandern, Abenteuer, Essen & Wein und kulturelle Aktivitäten. Über 200 Aktivitäten verfügbar.',
  keywords: 'Mallorca Aktivitäten, Mallorca Ausflüge, Wassersport Mallorca, Wandern Mallorca, Abenteuer Mallorca, Touren Mallorca',
  authors: [{ name: 'Mallorca Magic Team' }],
  creator: 'Mallorca Magic',
  publisher: 'Mallorca Magic',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: `${baseUrl}/activities`,
  },
  openGraph: {
    title: 'Aktivitäten & Abenteuer auf Mallorca',
    description: 'Unvergessliche Erlebnisse erwarten Sie auf Mallorca. Entdecken Sie Wassersport, Wandern, Abenteuer, Essen & Wein und kulturelle Aktivitäten.',
    type: 'website',
    siteName: 'Mallorca Magic',
    url: `${baseUrl}/activities`,
    locale: 'de_DE',
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
    site: '@MallorcaMagic',
    creator: '@MallorcaMagic',
    images: [{
      url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=630&fit=crop',
      alt: 'Aktivitäten & Abenteuer auf Mallorca',
    }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function ActivitiesPage() {
  return <ActivitiesClient />;
}