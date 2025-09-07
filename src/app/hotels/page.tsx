import { Metadata } from 'next';
import HotelsClient from './HotelsClient';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mallorcamagic.de';

export const metadata: Metadata = {
  title: 'Luxushotels & Einzigartige Unterkünfte auf Mallorca | Mallorca Magic',
  description: 'Von Luxusresorts bis hin zu charmanten Boutique-Hotels - finden Sie die perfekte Unterkunft für Ihren Mallorca-Aufenthalt. Über 500 handverlesene Hotels.',
  keywords: 'Mallorca Hotels, Luxushotels Mallorca, Boutique Hotels, Mallorca Unterkünfte, Hotels Mallorca buchen',
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
    canonical: `${baseUrl}/hotels`,
  },
  openGraph: {
    title: 'Luxushotels & Einzigartige Unterkünfte auf Mallorca',
    description: 'Von Luxusresorts bis hin zu charmanten Boutique-Hotels - finden Sie die perfekte Unterkunft für Ihren Mallorca-Aufenthalt.',
    type: 'website',
    siteName: 'Mallorca Magic',
    url: `${baseUrl}/hotels`,
    locale: 'de_DE',
    images: [{
      url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&h=630&fit=crop',
      width: 1200,
      height: 630,
      alt: 'Luxushotels & Einzigartige Unterkünfte auf Mallorca',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Luxushotels & Einzigartige Unterkünfte auf Mallorca',
    description: 'Von Luxusresorts bis hin zu charmanten Boutique-Hotels - finden Sie die perfekte Unterkunft für Ihren Mallorca-Aufenthalt.',
    site: '@MallorcaMagic',
    creator: '@MallorcaMagic',
    images: [{
      url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&h=630&fit=crop',
      alt: 'Luxushotels & Einzigartige Unterkünfte auf Mallorca',
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

export default function HotelsPage() {
  return <HotelsClient />;
}
