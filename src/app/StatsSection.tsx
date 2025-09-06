"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { StatsCounter } from "../components/ui/stats-counter";
import { supabase } from '../integrations/supabase/client';

interface StatsType {
  guides: number;
  activities: number;
  news: number;
  hotels: number;
}

export function StatsSection() {
  const [stats, setStats] = useState<StatsType>({ guides: 100, activities: 200, news: 50, hotels: 80 });
  const [loading, setLoading] = useState(true);
  
  const statsConfig = [
    { key: 'guides', label: "Guides", iconUrl: "/lovable-uploads/fb0d43bc-97c3-47b9-8a33-1bd1ddb865af.png" },
    { key: 'activities', label: "Aktivitäten", iconUrl: "/lovable-uploads/76bcf0aa-341c-44ab-9032-05aad263f26d.png" },
    { key: 'news', label: "News", iconUrl: "/lovable-uploads/aca4304b-cf00-4bd3-a16f-83243ea2bbb1.png" },
    { key: 'hotels', label: "Hotels", iconUrl: "/lovable-uploads/7a47ca0f-17ad-4dde-b282-aecad01275de.png" }
  ];

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      if (response.ok) {
        const stats = await response.json();
        setStats(stats);
      } else {
        // Fallback to direct Supabase call if API fails
        const [guidesRes, activitiesRes, newsRes, hotelsRes] = await Promise.all([
          supabase.from('guides').select('id', { count: 'exact' }).eq('status', 'published'),
          supabase.from('activities').select('id', { count: 'exact' }).eq('status', 'published'),
          supabase.from('articles').select('id', { count: 'exact' }).eq('status', 'published'),
          supabase.from('hotels').select('id', { count: 'exact' }).eq('status', 'published')
        ]);

        setStats({
          guides: guidesRes.count || 100,
          activities: activitiesRes.count || 200,
          news: newsRes.count || 50,
          hotels: hotelsRes.count || 80
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Set fallback values
      setStats({
        guides: 100,
        activities: 200,
        news: 50,
        hotels: 80
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto fade-in px-4" style={{ animationDelay: '600ms' }}>
      {statsConfig.map((stat, index) => (
        <div key={index} className="text-center group">
          <div className="inline-flex items:center justify-center w-16 h-16 bg-white/10 backdrop-blur rounded-lg mb-3 group-hover:bg-white/20 transition-colors p-3">
            <Image 
              src={stat.iconUrl} 
              alt={stat.label} 
              width={64} 
              height={64}
              loading={index < 2 ? "eager" : "lazy"}
              priority={index < 2}
              sizes="64px"
              className="w-full h-full object-contain filter brightness-0 invert" 
            />
          </div>
          <div className="font-display text-2xl md:text-3xl font-bold">
            {loading ? <span className="animate-pulse">...</span> : <StatsCounter targetValue={stats[stat.key as keyof StatsType]} suffix="+" duration={2000} />}
          </div>
          <div className="text-white/80 text-sm">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
