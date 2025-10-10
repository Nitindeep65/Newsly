import { NextRequest, NextResponse } from 'next/server';


const FINLIGHT_API_KEY = process.env.FINLIGHT_API_KEY || process.env.NEXT_PUBLIC_FINLIGHT_API_KEY;



type FinlightRaw = {
  id?: string;
  title?: string;
  summary?: string;
  content?: string;
  link?: string;
  publishDate?: string;
  published_at?: string;
  publishedAt?: string;
  source?: string | { id?: string; name?: string };
  author?: string;
  category?: string;
  [key: string]: unknown;
};



const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function GET(request: NextRequest) {
  try {
    
    const { searchParams } = new URL(request.url);
    const requestedCategory = searchParams.get('category') || 'general';
    const lang = searchParams.get('lang') || 'en';
    const country = searchParams.get('country') || 'IN';
    const max = searchParams.get('max') || '10';
    console.log(`API Route - Finlight params: category=${requestedCategory}, lang=${lang}, country=${country}, max=${max}`);

    
    if (!FINLIGHT_API_KEY) {
      return NextResponse.json({ error: 'Finlight API key is not configured' }, { status: 500, headers: corsHeaders });
    }

    try {
      
      const { finlight } = await import('@/lib/finlight');

      const body: Record<string, unknown> = {
        language: lang,
        pageSize: parseInt(max, 10) || 10,
      };

      if (requestedCategory && requestedCategory !== 'general') body.query = requestedCategory;
      if (country) body.country = country;

      console.log('Fetching from Finlight (SDK) with body:', body);

      
      
      let finlightResp: unknown = null;

      const tryInvoke = async (fn: unknown): Promise<unknown> => {
        if (typeof fn === 'function') {
          try {
            const fnTyped = fn as (...args: unknown[]) => Promise<unknown> | unknown;
            const result = fnTyped(body);
            return result instanceof Promise ? await result : result;
          } catch (e) {
            
            throw e;
          }
        }
        return null;
      };

      
      if (typeof (finlight as unknown as Record<string, unknown>)?.articles === 'function') {
        finlightResp = await tryInvoke((finlight as unknown as Record<string, unknown>).articles);
      } else if ((finlight as unknown as Record<string, unknown>)?.articles && typeof (finlight as unknown as Record<string, unknown>).articles === 'object') {
        
        const candidates = ['fetchArticles', 'list', 'listArticles', 'search', 'searchArticles', 'query', 'getArticles', 'find'];
        for (const name of candidates) {
          const artRec = (finlight as unknown as Record<string, unknown>).articles as Record<string, unknown>;
          if (typeof artRec[name] === 'function') {
            console.log(`Calling finlight.articles.${name}()`);
            finlightResp = await tryInvoke(artRec[name]);
            break;
          }
        }

        
        if (!finlightResp) {
          const artRec = (finlight as unknown as Record<string, unknown>).articles as Record<string, unknown> | object;
          
          const protoCandidates = ['getBasicArticles', 'getExtendedArticles', 'getArticles', 'fetchArticles', 'list', 'listArticles'];

          const proto = Object.getPrototypeOf(artRec as object) || {};
          const protoKeys = Object.getOwnPropertyNames(proto).filter(k => k !== 'constructor');

          
          let protoFnName: string | undefined = protoCandidates.find(n => protoKeys.includes(n));

          
          if (!protoFnName) protoFnName = protoKeys.find(k => typeof (proto as Record<string, unknown>)[k] === 'function');

          if (protoFnName) {
            console.log(`Calling prototype method finlight.articles.${protoFnName}()`);
            const protoMethod = (proto as Record<string, unknown>)[protoFnName];
            
            const fn = protoMethod as (...args: unknown[]) => unknown;
            finlightResp = await tryInvoke((...args: unknown[]) => fn.call(artRec, ...args));
          } else {
            const keys = Object.keys(artRec || {});
            console.warn('No callable method found on finlight.articles. Available keys:', keys, 'prototype keys:', protoKeys);
            
            throw new Error(`finlight.articles has no callable methods. Available keys: ${keys.join(', ') || '<none>'}`);
          }
        }
      } else if (typeof (finlight as unknown) === 'function') {
        
        finlightResp = await tryInvoke(finlight as unknown as (...args: unknown[]) => unknown);
      } else {
        
        const topCandidates = ['fetchArticles', 'articles', 'listArticles', 'searchArticles'];
        let invoked = false;
        for (const name of topCandidates) {
          const finRec = finlight as unknown as Record<string, unknown>;
          if (typeof finRec[name] === 'function') {
            console.log(`Calling finlight.${name}()`);
            finlightResp = await tryInvoke(finRec[name]);
            invoked = true;
            break;
          }
        }
        if (!invoked && !finlightResp) {
          const topKeys = Object.keys(finlight as unknown as Record<string, unknown>);
          throw new Error(`Finlight client missing expected methods. Available keys: ${topKeys.join(', ')}`);
        }
      }

  
  const finRespRec = finlightResp as unknown as Record<string, unknown> | undefined;
  const articles = Array.isArray(finRespRec?.articles) ? (finRespRec!.articles as unknown[]) : [];

      const normalized = articles.map((a: unknown, idx: number) => {
        
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
    } catch (err: unknown) {
      
      console.error('Finlight SDK error:', err);

      
      let details = '';
      let upstreamStatus = 502;

      if (err instanceof Error) {
        details = err.message;
        
        const eRec = err as unknown as Record<string, unknown>;
        const s = eRec['status'] ?? eRec['statusCode'];
        upstreamStatus = typeof s === 'number' ? s : Number(s) || 502;
      } else if (typeof err === 'string') {
        details = err;
      } else {
        try {
          details = JSON.stringify(err);
        } catch {
          details = String(err);
        }
      }

      
      return NextResponse.json(
        { error: 'Finlight API error', details },
        { status: upstreamStatus === 200 ? 502 : upstreamStatus, headers: corsHeaders }
      );
    }

  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news', details: error instanceof Error ? error.message : String(error) },
      { status: 500, headers: corsHeaders }
    );
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