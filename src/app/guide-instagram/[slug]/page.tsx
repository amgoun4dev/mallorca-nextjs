import { Metadata } from 'next';
import GuideDetailClient from './GuideDetailClient';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  // You could fetch the guide data here for dynamic metadata
  return {
    title: `Mallorca Guide – ${slug} | Mallorca Magic`,
    description: 'Entdecken Sie diesen erstaunlichen Guide für Mallorca mit Insider-Tipps und versteckten Juwelen.',
  };
}

export default async function GuideDetailPage({ params }: Props) {
  const { slug } = await params;
  return <GuideDetailClient slug={slug} />;
}