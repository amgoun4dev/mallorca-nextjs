"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../integrations/supabase/client";

interface TickerArticle { title: string; slug: string; }

export default function NewsTicker() {
  const [latestArticles, setLatestArticles] = useState<TickerArticle[]>([]);

  useEffect(() => {
    const fetchLatestArticles = async () => {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('title, slug')
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .limit(10);
        if (error) throw error;
        setLatestArticles(data || []);
      } catch (e) {
        // Silent fail; keep empty
      }
    };
    fetchLatestArticles();
  }, []);

  if (!latestArticles.length) {
    return <div className="py-3 text-center text-white/90 font-medium">Mallorca Magic – Willkommen</div>;
  }

  return (
    <div className="py-3">
      <div className="flex items-center whitespace-nowrap animate-[scroll_30s_linear_infinite]">
        <span className="text-white/90 font-medium mr-8 ml-4">🔴 AKTUELLE NEWS:</span>
        {latestArticles.map((article, index) => (
          <span key={article.slug} className="inline-flex items-center">
            <Link href={`/news/${article.slug}`} className="text-white hover:text-accent transition-colors duration-200 underline-offset-4 hover:underline mx-8">
              {article.title}
            </Link>
            {index < latestArticles.length - 1 && <span className="text-white/60 mx-4">•</span>}
          </span>
        ))}
        {latestArticles.map((article, index) => (
          <span key={`dup-${article.slug}`} className="inline-flex items-center">
            <Link href={`/news/${article.slug}`} className="text-white hover:text-accent transition-colors duration-200 underline-offset-4 hover:underline mx-8">
              {article.title}
            </Link>
            {index < latestArticles.length - 1 && <span className="text-white/60 mx-4">•</span>}
          </span>
        ))}
      </div>
    </div>
  );
}
