"use client";

import React, { useEffect, useState } from 'react';


import { NewsService, NewsArticle } from '@/lib/api/news';
import Image from 'next/image';
import { formatPublishDate } from '@/lib/api/news';
import { useRef } from 'react';

export default function NewsComparison({ initialCategory = 'all' }: { initialCategory?: string }) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [showFullArticle, setShowFullArticle] = useState<boolean>(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState<boolean>(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [, setSummaryClickCount] = useState<number>(0);
  
  const [showDetailOnMobile, setShowDetailOnMobile] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    NewsService.getLatestNews(initialCategory === 'all' ? undefined : initialCategory)
      .then((data) => {
        if (!mounted) return;
        setArticles(data);
        setSelectedIdx(0);
      })
      .catch((err) => {
        console.error('Failed to load comparison articles', err);
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [initialCategory]);

  const selected = articles[selectedIdx] || null;

  const fetchSummary = async (article: NewsArticle, full = false) => {
    setShowFullArticle(false);
    setSummaryError(null);
    setSummary(null);
    setSummaryLoading(true);
    try {
      const resp = await fetch('/api/news/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: article.title,
          description: article.description,
          content: article.content,
          url: article.url,
          maxSentences: full ? 12 : 6,
          summaryType: full ? 'full' : 'brief',
        }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        setSummaryError(err?.error || `Summary API returned ${resp.status}`);
        setSummary(null);
      } else {
        const data = await resp.json();
        setSummary(data.summary || null);
      }
    } catch (err) {
      console.error('Failed to fetch summary', err);
      setSummaryError('Failed to generate summary');
      setSummary(null);
    } finally {
      setSummaryLoading(false);
      
      setSummaryClickCount(0);
    }
  };

  
  useEffect(() => {
    setSummaryClickCount(0);
  }, [selectedIdx]);

  
  useEffect(() => {
    const handler = () => {
      try {
        if (window.innerWidth >= 768) {
          setShowDetailOnMobile(false);
        }
      } catch {
        
      }
    };
    window.addEventListener('resize', handler);
    
    handler();
    return () => window.removeEventListener('resize', handler);
  }, []);

  
  const detailRef = useRef<HTMLDivElement | null>(null);
  const [detailAdjust, setDetailAdjust] = useState<number>(0);

  useEffect(() => {
    const computeAdjust = () => {
      try {
        const el = detailRef.current;
        if (!el || typeof window === 'undefined') return setDetailAdjust(0);

        
        const candidates = Array.from(document.querySelectorAll('body *')) as HTMLElement[];
        let navH = 0;
        for (const c of candidates) {
          const cs = window.getComputedStyle(c);
          if ((cs.position === 'fixed' || cs.position === 'sticky') && c.getBoundingClientRect().top <= 0.5) {
            navH = Math.max(navH, Math.round(c.getBoundingClientRect().height));
          }
        }

        const rectTop = Math.round(el.getBoundingClientRect().top);
        const extra = Math.max(0, rectTop - navH);
        setDetailAdjust(extra);
      } catch {
        setDetailAdjust(0);
      }
    };

    
    const raf = requestAnimationFrame(() => computeAdjust());
    window.addEventListener('resize', computeAdjust);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', computeAdjust);
    };
  }, [selectedIdx, showDetailOnMobile, showFullArticle]);

  const handleSummaryClick = () => {
    if (!selected) return;
    setShowFullArticle(false);
    if (summaryLoading) return;

    
    if (!summary) {
      fetchSummary(selected, true);
      setSummaryClickCount(1);
      return;
    }

    
    setSummaryClickCount((c) => {
      const nc = c + 1;
      if (nc >= 2) {
        fetchSummary(selected, true);
        return 0;
      }
      return nc;
    });
  };

  return (

  <div className="w-full flex flex-col md:flex-row gap-6 mt-0 pt-0">
      <div className={`${showDetailOnMobile ? 'hidden' : 'block'} w-full md:w-1/3 md:border-r md:pr-4`}>
        <div className="sticky top-0 z-10 bg-background/60 backdrop-blur-sm py-0 -mx-3 py-3 px-4 border-b">
          <h3 className="text-lg font-semibold">Articles</h3>
          {loading && <div className="text-sm text-muted-foreground">Loading…</div>}
          {!loading && articles.length === 0 && <div className="text-sm text-muted-foreground">No articles</div>}
        </div>

        
  <ul className="space-y-2 overflow-y-auto max-h-[calc(100vh-6rem)] py-3">
          {articles.map((a, idx) => (
            <li key={a.id || a.url || idx}>
              <button
                className={`w-full text-left flex items-center gap-3 p-3 rounded-md transition-colors ${idx === selectedIdx ? 'bg-muted/60' : 'hover:bg-muted/10'}`}
                onClick={() => {
                  setSelectedIdx(idx);
                  setShowFullArticle(false);
                  setSummary(null);
                  setSummaryError(null);
                  
                  try { if (window.innerWidth < 768) setShowDetailOnMobile(true); } catch {  }
                }}
              >
                <div className="flex-1">
                  <div className="text-sm font-medium line-clamp-2">{a.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{formatPublishDate(a.publishedAt)}</div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>

  
  <div className={`${showDetailOnMobile ? 'block' : 'hidden'} md:block flex-1 pt-0`}> 
        {!selected ? (
          <div className="text-sm text-muted-foreground">Select an article to preview</div>
        ) : (
          
          <div ref={detailRef} className="flex flex-col gap-2 mt-0" style={{ marginTop: detailAdjust ? `-${detailAdjust}px` : undefined }}>
            
            <div className={`md:hidden ${showDetailOnMobile ? 'block' : 'hidden'}`}>
              <button
                className="text-sm px-3 py-1 rounded-md border mb-2"
                onClick={() => setShowDetailOnMobile(false)}
              >
                ← Back to list
              </button>
            </div>

            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-bold">{selected.title}</h2>
                <div className="text-xs text-muted-foreground">{formatPublishDate(selected.publishedAt)}</div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className={`text-sm px-3 py-1 rounded-md border ${showFullArticle ? 'bg-transparent' : 'bg-muted/50'}`}
                  onClick={handleSummaryClick}
                >
                  Summary
                </button>
                <button
                  className={`text-sm px-3 py-1 rounded-md border ${showFullArticle ? 'bg-muted/50' : 'bg-transparent'}`}
                  onClick={() => setShowFullArticle(true)}
                >
                  Full
                </button>
                
              </div>
            </div>

            

            {showFullArticle && selected.url && selected.url !== '#' ? (
              <div className="w-full flex-1 rounded-md overflow-hidden border">
                <iframe src={selected.url} title={selected.title} className="w-full h-[60vh] md:h-[72vh] border-0" />
              </div>
            ) : (
              <div className="flex-1 flex flex-col gap-6">
                
                {!(summary && !summaryLoading && !summaryError) && (
                  <div className="w-full h-[420px] md:h-[520px] relative rounded-md overflow-hidden bg-muted flex-shrink-0">
                    {selected.urlToImage ? (
                      <Image src={selected.urlToImage} alt={selected.title} fill className="object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">No image</div>
                    )}
                  </div>
                )}

                <div className="prose prose-sm sm:prose md:prose-lg max-w-full">
                  {summaryLoading && <div className="text-sm text-muted-foreground">Generating summary…</div>}
                  {!summaryLoading && summaryError && <div className="text-sm text-destructive">{summaryError}</div>}

                  {!summaryLoading && !summaryError && summary && (
                    <div>
                      <h4 className="text-lg font-semibold mb-2">AI-generated summary</h4>
                      <p className="text-base leading-relaxed">{summary}</p>
                      <div className="mt-3 text-xs text-muted-foreground">Generated from article content/title in-window.</div>
                    </div>
                  )}

                  {!summaryLoading && !summary && !summaryError && (
                    <>
                      <p className="text-base leading-relaxed">{selected.description}</p>
                      <a className="inline-block mt-3 text-sm text-primary" href={selected.url} target="_blank" rel="noreferrer">Open original</a>
                    </>
                  )}

                  {selected.urlToImage && !(summary && !summaryLoading && !summaryError) && (
                    <div className="mt-4 text-xs text-muted-foreground break-words">
                      <div className="font-medium">Image URL (raw):</div>
                      <div className="mt-1">{selected.urlToImage}</div>
                      <div className="font-medium mt-2">Proxied (should be requested):</div>
                      <div className="mt-1">{`/api/image-proxy?url=${encodeURIComponent(selected.urlToImage)}`}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
