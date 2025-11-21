"use client";

import React, { useEffect, useState } from 'react';


import { NewsService, NewsArticle } from '@/lib/api/news';
import Image from 'next/image';
import { SHOW_IMAGES } from '@/lib/app-config';
import { formatPublishDate } from '@/lib/api/news';
import { useRef } from 'react';

export default function NewsComparison({ initialCategory = 'all' }: { initialCategory?: string }) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [showDetailOnMobile, setShowDetailOnMobile] = useState<boolean>(false);
  const [iframeError, setIframeError] = useState<boolean>(false);
  const [iframeLoading, setIframeLoading] = useState<boolean>(true);

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

  // Monitor for iframe blocking errors
  useEffect(() => {
    const originalError = console.error;
    const originalWarn = console.warn;
    
    const errorHandler = (...args: unknown[]) => {
      const message = args.join(' ');
      if (message.includes('frame-ancestors') || 
          message.includes('X-Frame-Options') || 
          message.includes('Refused to display') ||
          message.includes('violates the following Content Security Policy')) {
        setIframeError(true);
        setIframeLoading(false);
      }
      originalError.apply(console, args);
    };
    
    const warnHandler = (...args: unknown[]) => {
      const message = args.join(' ');
      if (message.includes('frame-ancestors') || 
          message.includes('X-Frame-Options') || 
          message.includes('Refused to display')) {
        setIframeError(true);
        setIframeLoading(false);
      }
      originalWarn.apply(console, args);
    };

    console.error = errorHandler;
    console.warn = warnHandler;

    return () => {
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  const selected = articles[selectedIdx] || null;

  
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
  }, [selectedIdx, showDetailOnMobile]);

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
                  setIframeError(false);
                  setIframeLoading(true);
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

            <div className="mb-4">
              <h2 className="text-lg sm:text-xl font-bold mb-2">{selected.title}</h2>
              <div className="text-xs text-muted-foreground mb-2">{formatPublishDate(selected.publishedAt)}</div>
              <div className="text-sm text-muted-foreground">Source: {selected.source.name}</div>
            </div>

            {/* Full article iframe with fallback */}
            {selected.url && selected.url !== '#' && !iframeError ? (
              <div className="w-full flex-1 rounded-md overflow-hidden border relative">
                {iframeLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-10">
                    <div className="text-sm text-muted-foreground">Loading article...</div>
                  </div>
                )}
                <iframe 
                  src={selected.url} 
                  title={selected.title} 
                  className="w-full h-[60vh] md:h-[75vh] border-0"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                  onLoad={() => {
                    setIframeLoading(false);
                    // Simple timeout to catch most iframe blocking
                    setTimeout(() => {
                      const iframe = document.querySelector('iframe') as HTMLIFrameElement | null;
                      if (iframe) {
                        try {
                          const doc = iframe.contentDocument;
                          if (!doc || doc.URL === 'about:blank') {
                            setIframeError(true);
                          }
                        } catch {
                          setIframeError(true);
                        }
                      }
                    }, 2000);
                  }}
                  onError={() => {
                    console.warn('Iframe failed to load:', selected.url);
                    setIframeError(true);
                    setIframeLoading(false);
                  }}
                />
              </div>
            ) : (
              <div className="flex-1 flex flex-col gap-6">
                {/* Error message for blocked iframes */}
                {iframeError && selected.url !== '#' && (
                  <div className="p-4 rounded-md bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-start gap-3">
                      <div className="text-yellow-600 dark:text-yellow-400 mt-0.5">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                          Article Cannot Be Displayed
                        </h4>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                          This website blocks embedding for security reasons. Click the button below to read the full article in a new tab.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Show image if available */}
                {SHOW_IMAGES && selected.urlToImage && (
                  <div className="w-full h-[300px] md:h-[400px] relative rounded-md overflow-hidden bg-muted flex-shrink-0">
                    <Image src={selected.urlToImage} alt={selected.title} fill className="object-cover" />
                  </div>
                )}

                {/* Article content */}
                <div className="prose prose-sm sm:prose md:prose-lg max-w-full">
                  <div className="text-base leading-relaxed mb-4">{selected.description}</div>
                  {selected.content && (
                    <div className="text-base leading-relaxed">{selected.content}</div>
                  )}
                  
                  <div className="flex gap-3 mt-6">
                    <a 
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors" 
                      href={selected.url} 
                      target="_blank" 
                      rel="noreferrer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Read Full Article
                    </a>
                    
                    {iframeError && (
                      <button
                        onClick={() => {
                          setIframeError(false);
                          setIframeLoading(true);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 border border-muted-foreground/20 text-muted-foreground rounded-md hover:bg-muted/10 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Retry Embed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
