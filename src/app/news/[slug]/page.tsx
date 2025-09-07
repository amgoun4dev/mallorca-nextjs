import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabase } from "../../../integrations/supabase/client";
import { ImageWithFallback } from "../../../components/ui/image-with-fallback";
import { Badge } from "../../../components/ui/badge";

export const dynamic = "force-dynamic";

async function getArticle(slug: string) {
  const { data, error } = await supabase
    .from('articles')
    .select('id, slug, title, excerpt, content, cover_image_url, published_at, views')
    .eq('slug', slug)
    .single();
  if (error || !data) return null;
  return data;
}

const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mallorcamagic.de';
  if (!article) {
    return { title: 'Artikel nicht gefunden | Mallorca Magic' };
  }
  const title = article.title;
  const description = article.excerpt || (article.content ? article.content.replace(/<[^>]+>/g, '').slice(0, 160) : '');
  const image = article.cover_image_url || '/favicon.ico';
  const url = `${baseUrl}/news/${article.slug}`;
  return {
    title: `${title} | Mallorca Magic`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | Mallorca Magic`,
      description,
      url,
      type: 'article',
      images: [{ url: image }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Mallorca Magic`,
      description,
      images: [image],
    },
  };
}

export default async function NewsDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return notFound();

  const image = article.cover_image_url || "https://olrieidgokcnhhymksnf.supabase.co/storage/v1/object/public/general-images/mallorcamagic_fallback.jpg";

  return (
    <div className="min-h-screen">
      <section className="relative h-[42vh] w-full overflow-hidden">
        <ImageWithFallback src={image} alt={article.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-white text-3xl md:text-5xl font-display font-bold mb-3">{article.title}</h1>
            <div className="flex gap-2">
              {article.published_at && <Badge className="bg-white/10 text-white border-white/20">{formatDate(article.published_at)}</Badge>}
              {article.views && <Badge className="bg-white/10 text-white border-white/20">👁 {article.views}</Badge>}
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        {article.excerpt && <p className="text-lg text-muted-foreground mb-6">{article.excerpt}</p>}
        <article 
          className="prose prose-slate max-w-none prose-headings:font-display prose-headings:font-bold prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground
            [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mt-8 [&_h1]:mb-6 [&_h1]:text-foreground [&_h1]:font-display
            [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:text-foreground [&_h2]:font-display
            [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:text-foreground [&_h3]:font-display
            [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:mt-4 [&_h4]:mb-2 [&_h4]:text-foreground [&_h4]:font-display
            [&_h5]:text-base [&_h5]:font-semibold [&_h5]:mt-4 [&_h5]:mb-2 [&_h5]:text-foreground [&_h5]:font-display
            [&_h6]:text-sm [&_h6]:font-semibold [&_h6]:mt-3 [&_h6]:mb-2 [&_h6]:text-foreground [&_h6]:font-display
            [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-muted-foreground
            [&_strong]:font-semibold [&_strong]:text-foreground
            [&_em]:italic
            [&_ul]:mb-4 [&_ul]:ml-6 [&_ul]:list-disc
            [&_ol]:mb-4 [&_ol]:ml-6 [&_ol]:list-decimal
            [&_li]:mb-1
            [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:my-4 [&_blockquote]:italic
            [&_a]:text-primary [&_a]:underline [&_a]:hover:text-primary-dark
          "
          dangerouslySetInnerHTML={{ __html: article.content || '' }} 
        />
      </section>
    </div>
  );
}
