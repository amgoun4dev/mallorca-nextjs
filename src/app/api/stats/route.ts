import { NextResponse } from 'next/server'
import { unstable_cache } from 'next/cache'
import { supabase } from '../../../integrations/supabase/client'

// Cached function for fetching stats
const getCachedStats = unstable_cache(
  async () => {
    const [guidesRes, activitiesRes, newsRes, hotelsRes] = await Promise.all([
      supabase.from('guides').select('id', { count: 'exact' }).eq('status', 'published'),
      supabase.from('activities').select('id', { count: 'exact' }).eq('status', 'published'),
      supabase.from('articles').select('id', { count: 'exact' }).eq('status', 'published'),
      supabase.from('hotels').select('id', { count: 'exact' }).eq('status', 'published')
    ]);

    return {
      guides: guidesRes.count || 100,
      activities: activitiesRes.count || 200,
      news: newsRes.count || 50,
      hotels: hotelsRes.count || 80
    };
  },
  ['site-stats'],
  {
    tags: ['stats'],
    revalidate: 3600, // 1 hour
  }
);

export async function GET() {
  try {
    const stats = await getCachedStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    // Return fallback values
    return NextResponse.json({
      guides: 100,
      activities: 200,
      news: 50,
      hotels: 80
    });
  }
}
