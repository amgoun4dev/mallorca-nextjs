import { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Kontakt - Mallorca Magic | Persönliche Reiseberatung für Mallorca',
  description: 'Kontaktieren Sie die Mallorca Magic Experten für persönliche Reiseberatung, maßgeschneiderte Empfehlungen und lokale Insider-Tipps für Ihren perfekten Mallorca-Urlaub.',
  keywords: 'Kontakt, Mallorca Beratung, Reiseplanung, persönliche Empfehlungen, Mallorca Experten, Mallorca Magic',
  openGraph: {
    title: 'Kontakt - Mallorca Magic | Persönliche Reiseberatung für Mallorca',
    description: 'Kontaktieren Sie die Mallorca Magic Experten für persönliche Reiseberatung, maßgeschneiderte Empfehlungen und lokale Insider-Tipps für Ihren perfekten Mallorca-Urlaub.',
    type: 'website',
    url: '/contact',
  },
  twitter: {
    card: 'summary',
    title: 'Kontakt - Mallorca Magic',
    description: 'Kontaktieren Sie die Mallorca Magic Experten für persönliche Reiseberatung, maßgeschneiderte Empfehlungen und lokale Insider-Tipps für Ihren perfekten Mallorca-Urlaub.',
  },
  alternates: {
    canonical: '/contact'
  }
};

export default function ContactPage() {
  return <ContactClient />;
}