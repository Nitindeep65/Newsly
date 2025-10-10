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

    
    try {
      const { finlight } = await import('@/lib/finlight');

      const body: Record<string, unknown> = {
        q: query,
        language: lang,
        country,
        pageSize: max,
      };

      
      const tryInvoke = async (fn: unknown): Promise<unknown> => {
        if (typeof fn === 'function') {
          const f = fn as (...args: unknown[]) => Promise<unknown> | unknown;
          const res = f(body);
          return res instanceof Promise ? await res : res;
        }
        return null;
      };

      let finlightResp: unknown = null;

      
      const finRec = finlight as unknown as Record<string, unknown>;

      if (typeof finRec?.articles === 'function') {
        finlightResp = await tryInvoke(finRec.articles);
      } else if (finRec?.articles && typeof finRec.articles === 'object') {
        const artRec = finRec.articles as Record<string, unknown>;
        const candidates = ['search', 'searchArticles', 'fetchArticles', 'list', 'listArticles', 'query', 'getArticles', 'find'];
        for (const name of candidates) {
          if (typeof artRec[name] === 'function') {
            finlightResp = await tryInvoke(artRec[name]);
            break;
          }
        }

        if (!finlightResp) {
          const proto = Object.getPrototypeOf(artRec) || {};
          const protoKeys = Object.getOwnPropertyNames(proto).filter(k => k !== 'constructor');
          const protoCandidates = ['getBasicArticles', 'getExtendedArticles', 'getArticles', 'fetchArticles', 'list', 'listArticles'];
          let protoFnName: string | undefined = protoCandidates.find(n => protoKeys.includes(n));
          if (!protoFnName) protoFnName = protoKeys.find(k => typeof (proto as Record<string, unknown>)[k] === 'function');
          if (protoFnName) {
            const protoMethod = (proto as Record<string, unknown>)[protoFnName];
            finlightResp = await tryInvoke((...args: unknown[]) => (protoMethod as unknown as (...a: unknown[]) => unknown).call(artRec, ...args));
          } else {
            throw new Error('finlight.articles has no callable search method');
          }
        }
      } else if (typeof finlight === 'function') {
        finlightResp = await tryInvoke(finlight as unknown as (...a: unknown[]) => unknown);
      } else {
        const topCandidates = ['search', 'searchArticles', 'fetchArticles', 'listArticles'];
        let invoked = false;
        for (const name of topCandidates) {
          if (typeof finRec[name] === 'function') {
            finlightResp = await tryInvoke(finRec[name]);
            invoked = true;
            break;
          }
        }
        if (!invoked && !finlightResp) throw new Error('Finlight client missing expected search methods');
      }

      const finRespRec = finlightResp as unknown as Record<string, unknown> | undefined;
      const articles = Array.isArray(finRespRec?.articles) ? (finRespRec!.articles as unknown[]) : [];

      const normalized = articles.map((a: unknown, idx: number) => {
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
      const details = err instanceof Error ? err.message : String(err);
      return NextResponse.json({ error: 'Finlight search error', details }, { status: 502, headers: corsHeaders });
    }

  } catch (error) {
    console.error('Search API Route Error:', error);
    return NextResponse.json({ error: 'Failed to search news' }, { status: 500 });
  }
}


export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}