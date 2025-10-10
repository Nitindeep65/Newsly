import { NextRequest, NextResponse } from 'next/server';

// Finlight (server-side key preferred)
const FINLIGHT_API_KEY = process.env.FINLIGHT_API_KEY || process.env.NEXT_PUBLIC_FINLIGHT_API_KEY;

// Minimal Finlight article shape used for server-side normalization. Keep this local to avoid
// importing client-side modules at runtime; it's only used for typing and narrowing.
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

// We normalize provider responses on the server so the client always receives an array of NewsArticle-like objects.

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function GET(request: NextRequest) {
  try {
    // Get query parameters from the request
    const { searchParams } = new URL(request.url);
    const requestedCategory = searchParams.get('category') || 'general';
    const lang = searchParams.get('lang') || 'en';
    const country = searchParams.get('country') || 'us';
    const max = searchParams.get('max') || '10';
    console.log(`API Route - Finlight params: category=${requestedCategory}, lang=${lang}, country=${country}, max=${max}`);

    // Ensure Finlight key is available
    if (!FINLIGHT_API_KEY) {
      return NextResponse.json({ error: 'Finlight API key is not configured' }, { status: 500 });
    }

    try {
      // Defer loading the client to avoid build-time issues
      const { finlight } = await import('@/lib/finlight');

      const body: Record<string, unknown> = {
        language: lang,
        pageSize: parseInt(max, 10) || 10,
      };

      if (requestedCategory && requestedCategory !== 'general') body.query = requestedCategory;
      if (country) body.country = country;

      console.log('Fetching from Finlight (SDK) with body:', body);

      const finlightResp = await finlight.articles.fetchArticles(body);

      // Normalize Finlight response to a consistent shape expected by the client.
      const articles = Array.isArray(finlightResp?.articles) ? finlightResp.articles : [];

      const normalized = articles.map((a, idx: number) => {
        // Cast SDK article to a local raw shape for safe property access
        const raw = a as unknown as FinlightRaw;
        const publishedRaw = raw.publishDate || raw.published_at || raw.publishedAt || new Date().toISOString();
        const published = new Date(String(publishedRaw)).toISOString();
        const sourceObj = typeof raw.source === 'string' ? { id: undefined, name: raw.source } : (raw.source || { id: undefined, name: 'Unknown Source' });

        return {
          id: raw.id || `finlight-${Date.now()}-${idx}`,
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
      console.error('Finlight SDK error:', err);
      return NextResponse.json({ error: 'Finlight API error' }, { status: 502 });
    }

  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
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