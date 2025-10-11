"use client";

import React, { useEffect, useState } from 'react';
import { ContentLayout } from '@/components/admin-panel/content-layout';
import { NewsArticle } from '@/lib/api/news';
import { NewsTile } from '@/components/news/news-tile';
import { Button } from '@/components/ui/button';

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<NewsArticle[]>([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('bookmarks') || '[]');
      setBookmarks(Array.isArray(saved) ? saved : []);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_e) {
      setBookmarks([]);
    }
  }, []);

  const clearAll = () => {
    localStorage.removeItem('bookmarks');
    setBookmarks([]);
  };

  return (
    <ContentLayout title="Bookmarks">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Saved Articles</h2>
        <div>
          <Button onClick={clearAll} variant="destructive">Clear all</Button>
        </div>
      </div>

      {bookmarks.length === 0 ? (
        <div className="text-sm text-muted-foreground">No saved articles yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookmarks.map((b, idx) => (
            <NewsTile key={b.url || idx} article={b} showImage={true} />
          ))}
        </div>
      )}
    </ContentLayout>
  );
}

