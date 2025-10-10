import { NextRequest, NextResponse } from 'next/server';


let GoogleGenAI: unknown = null;

async function loadGoogleGenAI() {
  if (GoogleGenAI) return GoogleGenAI;
  try {
  const mod = await import('@google/genai');
  
  const maybe = mod as Record<string, unknown>;
  GoogleGenAI = (maybe['GoogleGenAI'] ?? null) as unknown;
    return GoogleGenAI;
  } catch {
    GoogleGenAI = null;
    return null;
  }
}

type SummaryRequest = {
  title?: string;
  description?: string;
  content?: string;
  url?: string;
  maxSentences?: number;
  summaryType?: 'brief' | 'full';
};

function generateSummary(rawText: string, maxSentences = 5): string {
  
  const text = rawText.replace(/\s+/g, ' ').trim();

  
  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];
  if (sentences.length <= maxSentences) return sentences.join(' ').trim();

  
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2);

  const freq = new Map<string, number>();
  for (const w of words) freq.set(w, (freq.get(w) || 0) + 1);

  
  const scored = sentences.map((s) => {
    const ws = s
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(Boolean);
    let score = 0;
    for (const w of ws) if (freq.has(w)) score += freq.get(w)!;
    return { s: s.trim(), score };
  });

  
  const top = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, maxSentences)
    .sort((a, b) => sentences.indexOf(a.s) - sentences.indexOf(b.s))
    .map((x) => x.s);

  return top.join(' ').trim();
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SummaryRequest;
  const { title, description, content, url, maxSentences, summaryType } = body || {};

    let text = (content && String(content).trim()) || (description && String(description).trim()) || (title && String(title).trim()) || '';

    
    if (!text && url) {
      try {
        const upstream = await fetch(url, { headers: { 'User-Agent': 'newsly/1.0 (+https://example.com)' } });
        const html = await upstream.text();
        
        text = html
          .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, ' ')
          .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, ' ')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
      } catch (e) {
        console.warn('[summary] failed to fetch url for summarization', e);
      }
    }

    if (!text) {
      return NextResponse.json({ error: 'No text available to summarize' }, { status: 400 });
    }
    
    
    
    
    
    const geminiUrl = process.env.GEMINI_API_URL;
    const geminiKey = process.env.GEMINI_API_KEY;

    if (geminiKey) {
      
      
      
      const isPlaceholder = (() => {
        if (!geminiUrl) return false;
        try {
          const u = new URL(geminiUrl);
          const h = u.hostname.toLowerCase();
          return h === 'localhost' || h === 'example.com' || h.endsWith('.example.com');
        } catch {
          return true;
        }
      })();

      if (isPlaceholder) {
        console.warn('[summary] GEMINI_API_URL looks like a placeholder; HTTP LLM call will be skipped');
      }

      
      const looksLikeGoogleKey = typeof geminiKey === 'string' && geminiKey.startsWith('AIza');

      if (looksLikeGoogleKey) {
        try {
          const GG = await loadGoogleGenAI();
          if (GG) {
            const ClientCtor = GG as unknown as {
              new (opts?: { apiKey?: string }): { models?: { generateContent?: (opts: { model: string; contents: string }) => Promise<unknown> } };
            };
            const client = new ClientCtor({ apiKey: geminiKey });

            const wantFull = summaryType === 'full' || (typeof maxSentences === 'number' && maxSentences >= 10);
            const header = wantFull ? 'You are a helpful assistant. Produce a DETAILED, well-structured summary of the provided article.' : 'You are a helpful assistant. Produce a concise summary of the provided article.';
            const prompt = `${header}\n\nTitle: ${title || ''}\nDescription: ${description || ''}\nContent: ${text || ''}\nURL: ${url || ''}`;

            const model = 'gemini-2.5-flash';
            const generator = client.models?.generateContent;
            if (typeof generator === 'function') {
              const resp = await generator.call(client.models, { model, contents: prompt });

              const maybeResp = resp as unknown as Record<string, unknown>;
              let sdkText: string | null = null;
              if (typeof maybeResp.text === 'string') sdkText = maybeResp.text;
              else if (Array.isArray(maybeResp.candidates) && maybeResp.candidates.length > 0) {
                const first = maybeResp.candidates[0] as unknown;
                if (first && typeof first === 'object') {
                  const f = first as Record<string, unknown>;
                  if (typeof f.content === 'string') sdkText = f.content;
                }
              }

              if (sdkText && sdkText.trim().length > 0) {
                return NextResponse.json({ summary: sdkText.trim() });
              }
            }
          }
        } catch (sdkErr) {
          console.warn('[summary] Google GenAI SDK call failed, falling back to HTTP or local summarizer', sdkErr);
        }
      }

      
      if (geminiUrl && !isPlaceholder) {
        
        const controller = new AbortController();
        const timeoutMs = 5000; 
        const timeout = setTimeout(() => controller.abort(), timeoutMs);

        try {
          
          const wantFull = summaryType === 'full' || (typeof maxSentences === 'number' && maxSentences >= 10);
          const promptParts: string[] = [];
          promptParts.push(wantFull ? 'You are a helpful assistant. Produce a DETAILED, well-structured summary of the provided article. Include key points, context, and notable quotes when available.' : 'You are a helpful assistant. Produce a concise summary of the provided article.');
          promptParts.push('Please return only the summary text, no JSON wrappers.');
          promptParts.push('\n--- Article content to summarize: ---\n');
          if (title) promptParts.push(`Title: ${title}\n`);
          if (description) promptParts.push(`Description: ${description}\n`);
          if (text) promptParts.push(`Content: ${text}\n`);
          if (url) promptParts.push(`URL: ${url}\n`);

          const prompt = promptParts.join('\n');

          const llmResp = await fetch(geminiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${geminiKey}`,
            },
            body: JSON.stringify({ prompt, max_tokens: 512 }),
            signal: controller.signal,
          });

          const raw = await llmResp.text();

          
          let parsed: unknown = null;
          try {
            parsed = JSON.parse(raw);
          } catch {
            parsed = null;
          }

          let llmSummary: string | null = null;

          if (parsed && typeof parsed === 'object') {
            const pObj = parsed as Record<string, unknown>;

            if (Array.isArray(pObj.choices) && pObj.choices.length > 0) {
              const ch0 = pObj.choices[0] as Record<string, unknown> | undefined;
              if (ch0 && typeof ch0.text === 'string') llmSummary = ch0.text.trim();
            }

            if (!llmSummary && Array.isArray(pObj.output) && pObj.output.length > 0) {
              const out0 = pObj.output[0] as Record<string, unknown> | undefined;
              if (out0) {
                const content = out0.content;
                if (typeof content === 'string') llmSummary = content.trim();
                else if (Array.isArray(content)) {
                  llmSummary = content
                    .map((part) => {
                      if (part && typeof part === 'object') return (part as Record<string, unknown>).text ?? String(part);
                      return String(part);
                    })
                    .join('\n')
                    .trim();
                }
              }
            }

            if (!llmSummary && typeof pObj.summary === 'string') llmSummary = pObj.summary.trim();
            if (!llmSummary && typeof pObj.text === 'string') llmSummary = pObj.text.trim();
          } else if (typeof parsed === 'string') {
            llmSummary = parsed.trim();
          }

          if (!llmSummary && raw) llmSummary = raw.trim();

          if (llmSummary && llmSummary.length > 0) return NextResponse.json({ summary: llmSummary });
        } catch (e) {
          console.warn('[summary] Gemini LLM call failed, falling back to local summarizer', e);
        } finally {
          clearTimeout(timeout);
        }
      }
    }

    
    const summary = generateSummary(text, typeof maxSentences === 'number' ? maxSentences : 5);

    return NextResponse.json({ summary });
  } catch (err) {
    console.error('[summary] error', err);
    return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 });
  }
}
