import { NextRequest, NextResponse } from 'next/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

type FinlightRaw = {
  id?: string;
  title?: string;
  summary?: string;
  content?: string;
  link?: string;
  images?: string[];
  publishDate?: string;
  published_at?: string;
  publishedAt?: string;
  source?: string | { id?: string; name?: string };
  author?: string;
  category?: string;
  [key: string]: unknown;
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const lang = searchParams.get('lang') || 'en';
    const country = searchParams.get('country') || 'us';
    const max = parseInt(searchParams.get('max') || '8', 10) || 8;

    if (!query) {
      return NextResponse.json({ error: 'Search query parameter (q) is required' }, { status: 400 });
    }

    // Use Finlight SDK to search articles
    try {
      const { finlight } = await import('@/lib/finlight');

      const body: Record<string, unknown> = {
        q: query,
        language: lang,
        country,
        pageSize: max,
      };

      const resp = await finlight.articles.fetchArticles(body);
      const articles = Array.isArray(resp?.articles) ? resp.articles : [];

      const normalized = articles.map((a, idx: number) => {
        const raw = a as unknown as FinlightRaw;
        const publishedRaw = raw.publishDate || raw.published_at || raw.publishedAt || new Date().toISOString();
        const published = new Date(String(publishedRaw)).toISOString();
        const sourceObj = typeof raw.source === 'string' ? { id: undefined, name: raw.source } : (raw.source || { id: undefined, name: 'Unknown Source' });

        return {
          id: raw.id || `finlight-search-${Date.now()}-${idx}`,
          title: raw.title || (raw.summary ? String(raw.summary).slice(0, 60) : 'Untitled'),
          description: raw.summary || raw.content || 'No description available',
          content: raw.content,
          url: raw.link || '#',
          urlToImage: Array.isArray(raw.images) && raw.images.length ? raw.images[0] : undefined,
          publishedAt: published,
          author: raw.author || undefined,
          source: {
            id: sourceObj.id || undefined,
            name: sourceObj.name || 'Unknown Source'
          },
          category: raw.category || undefined,
        };
      });

      return NextResponse.json({ articles: normalized, totalResults: normalized.length, status: 'ok' }, { headers: corsHeaders });
    } catch (err) {
      console.error('Finlight SDK search error:', err);
      return NextResponse.json({ error: 'Finlight search error' }, { status: 502 });
    }

  } catch (error) {
    console.error('Search API Route Error:', error);
    return NextResponse.json({ error: 'Failed to search news' }, { status: 500 });
  }
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}