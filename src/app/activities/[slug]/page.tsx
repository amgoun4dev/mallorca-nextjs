import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ActivityDetailClient from './ActivityDetailClient';
import { supabase } from '../../../integrations/supabase/client';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

interface Activity {
  id: string;
  slug: string;
  title_en?: string;
  title_de?: string;
  description_en?: string;
  description_de?: string;
  location?: string;
  category?: string;
  featured_image?: string;
  difficulty_level?: string;
  duration?: string;
  rating?: number;
  review_count?: number;
  price_from?: number;
  seo_title_en?: string;
  seo_title_de?: string;
  seo_description_en?: string;
  seo_description_de?: string;
}

async function getActivity(slug: string): Promise<Activity | null> {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error || !data) return null;
  return data;
}

function getTitle(activity: Activity): string {
  return activity.title_de || activity.title_en || 'Mallorca Aktivität';
}

function getDescription(activity: Activity): string {
  return activity.description_de || activity.description_en || 'Erleben Sie unvergessliche Abenteuer auf Mallorca.';
}

function getSEOTitle(activity: Activity): string {
  return activity.seo_title_de || activity.seo_title_en || `${getTitle(activity)} | Mallorca Magic`;
}

function getSEODescription(activity: Activity): string {
  return activity.seo_description_de || activity.seo_description_en || getDescription(activity).slice(0, 160);
}

function getActivityImage(activity: Activity): string {
  if (activity.featured_image && !activity.featured_image.includes('tripadvisor.com')) {
    return activity.featured_image;
  }
  
  // Use local images as fallback
  const localImages = [
    '/lovable-uploads/0ccc1f16-0b14-46d6-b630-b89d5e72bb1d.png',
    '/lovable-uploads/150b65d8-880f-4502-a2c7-1bac146d90d4.png',
    '/lovable-uploads/2411e8eb-622b-4671-9c18-c96452b3b52e.png',
    '/lovable-uploads/3ce02233-799c-4e4f-9ba8-7dc6ccfd6b1f.png',
    '/lovable-uploads/4223ae41-b263-48cb-a4eb-c54e7d88de5e.png',
    '/lovable-uploads/53815b7b-96b8-4822-b136-d8e35175cadf.png',
    '/lovable-uploads/76bcf0aa-341c-44ab-9032-05aad263f26d.png',
    '/lovable-uploads/7a47ca0f-17ad-4dde-b282-aecad01275de.png',
    '/lovable-uploads/a0295954-4dd2-494e-ba3b-96cd603b1382.png',
    '/lovable-uploads/aca4304b-cf00-4bd3-a16f-83243ea2bbb1.png',
    '/lovable-uploads/ba360617-1620-43d6-b46a-c6e32347b7ef.png',
    '/lovable-uploads/ca090410-369a-46e2-9f7b-3ef628908ecf.png',
    '/lovable-uploads/fb0d43bc-97c3-47b9-8a33-1bd1ddb865af.png'
  ];
  
  const imageIndex = parseInt(activity.id) % localImages.length;
  return localImages[imageIndex];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const activity = await getActivity(slug);
  
  if (!activity) {
    return {
      title: 'Aktivität nicht gefunden | Mallorca Magic',
      description: 'Die gesuchte Aktivität wurde nicht gefunden.',
    };
  }

  const title = getSEOTitle(activity);
  const description = getSEODescription(activity);
  const image = getActivityImage(activity);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mallorcamagic.de';
  const url = `${baseUrl}/activities/${activity.slug}`;

  const keywords = [
    getTitle(activity),
    'Mallorca Aktivität',
    activity.location && `${activity.location} Ausflug`,
    'Mallorca Touren',
    activity.difficulty_level && 'Abenteuer',
    'Mallorca Erlebnis'
  ].filter(Boolean).join(', ');

  return {
    title,
    description,
    keywords,
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
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Mallorca Magic',
      type: 'website',
      locale: 'de_DE',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${getTitle(activity)} - Mallorca Aktivität`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: '@MallorcaMagic',
      creator: '@MallorcaMagic',
      images: [
        {
          url: image,
          alt: `${getTitle(activity)} - Mallorca Aktivität`,
        },
      ],
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
}

export default async function ActivityDetailPage({ params }: Props) {
  const { slug } = await params;
  return <ActivityDetailClient slug={slug} />;
}