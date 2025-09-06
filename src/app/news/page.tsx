import { Metadata } from 'next';
import NewsClient from './NewsClient';

export const metadata: Metadata = {
  title: 'Mallorca News – Aktuelle Nachrichten & Stories | Mallorca Magic',
  description: 'Alle wichtigen Nachrichten & Hintergrundberichte von der Insel. Redaktionell gepflegt, aktuell & unabhängig.',
  keywords: 'Mallorca News, Mallorca Nachrichten, Balearen News, Spanien Nachrichten, Mallorca aktuell',
  openGraph: {
    title: 'Mallorca News – Aktuelle Nachrichten & Stories',
    description: 'Alle wichtigen Nachrichten & Hintergrundberichte von der Insel. Redaktionell gepflegt, aktuell & unabhängig.',
    type: 'website',
    siteName: 'Mallorca Magic',
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/news`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mallorca News – Aktuelle Nachrichten & Stories',
    description: 'Alle wichtigen Nachrichten & Hintergrundberichte von der Insel. Redaktionell gepflegt, aktuell & unabhängig.',
    site: '@MallorcaMagic',
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/news`,
  },
};

export default function NewsPage() {
  return <NewsClient />;
}