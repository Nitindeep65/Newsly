"use client";

import NewsComparison from '@/components/news/news-comparison';
import { ContentLayout } from '@/components/admin-panel/content-layout';

export default function AdminNewsPage() {
  return (
    <ContentLayout title="News Feed" noTopSpacing>
      <div className="pt-3">
        <NewsComparison initialCategory="all" />
      </div>
    </ContentLayout>
  );
}
