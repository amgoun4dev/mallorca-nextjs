import { Metadata } from 'next';
import ActivityDetailClient from './ActivityDetailClient';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  // You could fetch the activity data here for dynamic metadata
  return {
    title: `Mallorca Aktivität – ${slug} | Mallorca Magic`,
    description: 'Erleben Sie unvergessliche Abenteuer auf Mallorca. Jetzt buchen!',
  };
}

export default async function ActivityDetailPage({ params }: Props) {
  const { slug } = await params;
  return <ActivityDetailClient slug={slug} />;
}