"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { NewsTile } from './news-tile';
import { NewsGridSkeleton } from './news-skeleton';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw, AlertTriangle } from "lucide-react";
import { NewsService, NewsArticle, NEWS_CATEGORIES } from '@/lib/api/news';

interface NewsGridProps {
  limit?: number;
  showCategoryFilter?: boolean;
  onArticleClick?: (article: NewsArticle) => void;
}

export function NewsGrid({ limit = 6, showCategoryFilter = true, onArticleClick }: NewsGridProps) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);

  const fetchNews = useCallback(async (category: string = 'all') => {
    try {
      setError(null);
      const newsData = await NewsService.getLatestNews(category === 'all' ? undefined : category);
      setArticles(newsData.slice(0, limit));
    } catch (err) {
      console.error('Failed to fetch news:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch news';
      setError(errorMessage);
      
      // If rate limited, show a more user-friendly message
      if (errorMessage.includes('rate limit')) {
        setError('API rate limit reached. Showing demo articles below. Please try again in a few minutes.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchNews(selectedCategory);
  }, [selectedCategory, limit, fetchNews]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setLoading(true);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchNews(selectedCategory);
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    fetchNews(selectedCategory);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {showCategoryFilter && (
          <div className="flex items-center justify-between">
            <div className="h-10 w-48 bg-muted animate-pulse rounded-md" />
            <div className="h-10 w-10 bg-muted animate-pulse rounded-md" />
          </div>
        )}
        <NewsGridSkeleton count={limit} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        {showCategoryFilter && (
          <div className="flex items-center justify-between">
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {NEWS_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        )}
        
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button onClick={handleRetry} variant="outline" size="sm">
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="space-y-6">
        {showCategoryFilter && (
          <div className="flex items-center justify-between">
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {NEWS_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        )}
        
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>No news articles found for the selected category.</span>
            <Button onClick={handleRetry} variant="outline" size="sm">
              Refresh
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showCategoryFilter && (
        <div className="flex items-center justify-between">
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {NEWS_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <NewsTile 
            key={article.id} 
            article={article} 
            onReadMore={onArticleClick}
          />
        ))}
      </div>
    </div>
  );
}