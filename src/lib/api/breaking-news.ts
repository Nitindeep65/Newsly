"use client";

import { NewsArticle } from './news';

export interface BreakingNewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
}

export class BreakingNewsService {
  private static readonly BREAKING_NEWS_KEYWORDS = [
    'breaking',
    'urgent',
    'alert',
    'developing',
    'exclusive',
    'emergency',
    'crisis',
    'major',
    'shock',
    'surprise'
  ];

  private static readonly HIGH_PRIORITY_KEYWORDS = [
    'election',
    'earthquake',
    'tornado',
    'hurricane',
    'attack',
    'crash',
    'explosion',
    'fire',
    'shooting',
    'arrest',
    'dies',
    'death',
    'killed',
    'war',
    'conflict'
  ];

  
  static async getBreakingNews(): Promise<BreakingNewsItem[]> {
    try {
      
      const categories = ['general', 'world', 'nation', 'politics'];
      const allBreakingNews: BreakingNewsItem[] = [];

      for (const category of categories) {
        try {
          const params = new URLSearchParams({
            category,
            lang: 'en',
            country: 'us',
            max: '10',
            sortby: 'publishedAt' 
          });

          const response = await fetch(`/api/news?${params}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            cache: 'no-store',
          });

          if (response.ok) {
            const data = await response.json();
            if (data.articles && Array.isArray(data.articles)) {
              const breakingItems = this.filterBreakingNews(data.articles, category);
              allBreakingNews.push(...breakingItems);
            }
          }
        } catch (error) {
          console.warn(`Failed to fetch breaking news for category ${category}:`, error);
        }
      }

      
      const uniqueNews = this.removeDuplicates(allBreakingNews);
      return this.sortByPriorityAndRecency(uniqueNews).slice(0, 5); 

    } catch (error) {
      console.error('Error fetching breaking news:', error);
      return [];
    }
  }

  
  private static filterBreakingNews(articles: NewsArticle[], category: string): BreakingNewsItem[] {
    const now = new Date();
    const twoHoursAgo = new Date(now.getTime() - (2 * 60 * 60 * 1000)); 

    return articles
      .filter(article => {
        
        const publishedAt = new Date(article.publishedAt);
        if (publishedAt < twoHoursAgo) return false;

        
        const text = (article.title + ' ' + article.description).toLowerCase();
        return this.BREAKING_NEWS_KEYWORDS.some(keyword => text.includes(keyword));
      })
      .map(article => this.transformToBreakingNews(article, category));
  }

  
  private static transformToBreakingNews(article: NewsArticle, category: string): BreakingNewsItem {
    const text = (article.title + ' ' + article.description).toLowerCase();
    const priority = this.determinePriority(text);

    return {
      id: `breaking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: article.title,
      description: article.description,
      url: article.url,
      publishedAt: article.publishedAt,
      source: article.source.name,
      category: this.formatCategory(category),
      priority
    };
  }

  
  private static determinePriority(text: string): 'high' | 'medium' | 'low' {
    if (this.HIGH_PRIORITY_KEYWORDS.some(keyword => text.includes(keyword))) {
      return 'high';
    }
    if (this.BREAKING_NEWS_KEYWORDS.some(keyword => text.includes(keyword))) {
      return 'medium';
    }
    return 'low';
  }

  
  private static removeDuplicates(items: BreakingNewsItem[]): BreakingNewsItem[] {
    const seen = new Set<string>();
    return items.filter(item => {
      
      const normalizedTitle = item.title.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .trim()
        .substring(0, 30); 

      if (seen.has(normalizedTitle)) {
        return false;
      }
      seen.add(normalizedTitle);
      return true;
    });
  }

  
  private static sortByPriorityAndRecency(items: BreakingNewsItem[]): BreakingNewsItem[] {
    const priorityOrder = { high: 3, medium: 2, low: 1 };

    return items.sort((a, b) => {
      
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;

      
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
  }

  
  private static formatCategory(category: string): string {
    const categoryMap: { [key: string]: string } = {
      'general': 'General',
      'world': 'World',
      'nation': 'National',
      'politics': 'Politics',
      'technology': 'Tech',
      'business': 'Business',
      'health': 'Health',
      'science': 'Science',
      'sports': 'Sports',
      'entertainment': 'Entertainment'
    };

    return categoryMap[category] || category.charAt(0).toUpperCase() + category.slice(1);
  }

  
  static isNewBreakingNews(item: BreakingNewsItem, seenIds: string[]): boolean {
    return !seenIds.includes(item.id);
  }

  
  static formatNotificationTime(publishedAt: string): string {
    const now = new Date();
    const published = new Date(publishedAt);
    const diffInMinutes = Math.floor((now.getTime() - published.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    return published.toLocaleDateString();
  }
}