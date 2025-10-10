"use client";


export interface NewsArticle {
  id?: string;
  title: string;
  description: string;
  content?: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  author?: string;
  source: {
    id?: string;
    name: string;
  };
  category?: string;
}

export interface NewsResponse {
  articles: NewsArticle[];
  totalResults?: number;
  status?: string;
}


interface FinlightArticle {
  id?: string;
  title: string;
  summary?: string;
  content?: string;
  link?: string; 
  images?: string[]; 
  publishDate?: string; 
  published_at?: string; 
  publishedAt?: string; 
  source?: {
    id?: string;
    name?: string;
  } | string;
  author?: string;
  category?: string;
}




const NEWS_API_CONFIG = {
  baseUrl: '/api/news',
  searchUrl: '/api/news/search',
  defaultParams: {
    lang: 'en',
    country: 'us',
    max: 10,
  }
};

export class NewsService {
  static async getLatestNews(category?: string): Promise<NewsArticle[]> {
    try {
      
      const params = new URLSearchParams({
        category: category || 'general',
        lang: NEWS_API_CONFIG.defaultParams.lang,
        country: NEWS_API_CONFIG.defaultParams.country,
        max: NEWS_API_CONFIG.defaultParams.max.toString(),
      });

      const apiUrl = `${NEWS_API_CONFIG.baseUrl}?${params}`;
      const response = await fetch(apiUrl, { method: 'GET', cache: 'no-store' });

      if (!response.ok) {
        
        let errorText = await response.text();
        try {
          const parsed = JSON.parse(errorText);
          errorText = parsed?.error ? `${parsed.error}${parsed?.details ? ` - ${parsed.details}` : ''}` : errorText;
        } catch {
          
        }
        console.error('News API Error Response:', response.status, response.statusText, errorText);

        
        if (response.status === 429) {
          console.warn('Rate limited by news API, retrying once after brief delay...');
          await new Promise((res) => setTimeout(res, 750));
          return this.getLatestNews(category);
        }

        
        return this.getFallbackArticles(category);
      }

      const data = await response.json();

      if (!data.articles || !Array.isArray(data.articles)) return [];

      return this.transformFinlightArticles(data.articles as FinlightArticle[]);
      
    } catch (error) {
      console.error('Error fetching news:', error);
      
      
      console.error(error);
      return this.getFallbackArticles(category);
    }
  }

  

  
  private static getFallbackArticles(category?: string): NewsArticle[] {
    const fallbackArticles = [
      {
        id: 'demo-1',
        title: 'Breaking: Technology Innovation Reaches New Heights',
        description: 'Latest developments in artificial intelligence and machine learning continue to transform industries worldwide.',
        content: 'The technology sector continues to evolve at an unprecedented pace...',
        url: '#',
        urlToImage: 'https://via.placeholder.com/400x300/1f2937/white?text=Tech+News',
        publishedAt: new Date().toISOString(),
        author: 'Tech Reporter',
        source: {
          id: 'demo-tech',
          name: 'Tech Daily'
        },
        category: 'Technology'
      },
      {
        id: 'demo-2',
        title: 'Global Markets Show Strong Performance',
        description: 'Stock markets worldwide demonstrate resilience amid economic uncertainties.',
        content: 'Financial markets have shown remarkable stability...',
        url: '#',
        urlToImage: 'https://via.placeholder.com/400x300/059669/white?text=Business+News',
        publishedAt: new Date(Date.now() - 3600000).toISOString(),
        author: 'Financial Analyst',
        source: {
          id: 'demo-business',
          name: 'Business Weekly'
        },
        category: 'Business'
      },
      {
        id: 'demo-3',
        title: 'Health Research Breakthrough Announced',
        description: 'Scientists discover new treatment methods that could revolutionize healthcare.',
        content: 'Medical researchers have made significant progress...',
        url: '#',
        urlToImage: 'https://via.placeholder.com/400x300/dc2626/white?text=Health+News',
        publishedAt: new Date(Date.now() - 7200000).toISOString(),
        author: 'Health Correspondent',
        source: {
          id: 'demo-health',
          name: 'Health Today'
        },
        category: 'Health'
      },
      {
        id: 'demo-4',
        title: 'Sports Championship Results',
        description: 'Exciting matches and unexpected victories mark this seasons competitions.',
        content: 'The sports world was thrilled by outstanding performances...',
        url: '#',
        urlToImage: 'https://via.placeholder.com/400x300/7c3aed/white?text=Sports+News',
        publishedAt: new Date(Date.now() - 10800000).toISOString(),
        author: 'Sports Writer',
        source: {
          id: 'demo-sports',
          name: 'Sports Central'
        },
        category: 'Sports'
      }
    ];

    
    if (category && category !== 'all') {
      const filtered = fallbackArticles.filter(article => 
        article.category.toLowerCase() === category.toLowerCase()
      );
      return filtered.length > 0 ? filtered : fallbackArticles.slice(0, 2);
    }

    return fallbackArticles;
  }

  
  private static categorizeArticle(title: string, description: string): string {
    const content = ((title || '') + ' ' + (description || '')).toLowerCase();
    
    if (content.includes('tech') || content.includes('ai') || content.includes('software') || content.includes('digital')) return 'Technology';
    if (content.includes('business') || content.includes('market') || content.includes('finance') || content.includes('economy')) return 'Business';
    if (content.includes('health') || content.includes('medical') || content.includes('covid') || content.includes('hospital')) return 'Health';
    if (content.includes('sports') || content.includes('football') || content.includes('game') || content.includes('match')) return 'Sports';
    if (content.includes('science') || content.includes('research') || content.includes('study') || content.includes('discovery')) return 'Science';
    if (content.includes('environment') || content.includes('climate') || content.includes('green') || content.includes('nature')) return 'Environment';
    if (content.includes('politics') || content.includes('government') || content.includes('election') || content.includes('policy')) return 'Politics';
    if (content.includes('entertainment') || content.includes('movie') || content.includes('music') || content.includes('celebrity')) return 'Entertainment';
    
    return 'General';
  }

  
  static async getNewsByCategory(category: string): Promise<NewsArticle[]> {
    return this.getLatestNews(category);
  }

  
  static async searchNews(query: string): Promise<NewsArticle[]> {
    try {
      const params = new URLSearchParams({
        q: query,
        lang: NEWS_API_CONFIG.defaultParams.lang,
        country: NEWS_API_CONFIG.defaultParams.country,
        max: '8',
      });

      const response = await fetch(`${NEWS_API_CONFIG.searchUrl}?${params}`, { method: 'GET', cache: 'no-store' });
      if (!response.ok) {
        console.error('Search API error', response.statusText);
        return [];
      }

      const data = await response.json();
      if (!data.articles || !Array.isArray(data.articles)) return [];
      return this.transformFinlightArticles(data.articles as FinlightArticle[]);
      
    } catch (error) {
      console.error('Error searching news:', error);
      throw error;
    }
  }

  
  static async getTrendingNews(): Promise<NewsArticle[]> {
    return this.getLatestNews();
  }
  
  
  private static transformFinlightArticles(articles: FinlightArticle[]): NewsArticle[] {
    return articles
      .filter(a => a && (a.title || a.summary))
      .slice(0, 12)
      .map((a, idx) => {
        const publishedRaw = a.publishDate || a.published_at || a.publishedAt || new Date().toISOString();
        const published = new Date(publishedRaw as string).toISOString();
        const sourceObj = typeof a.source === 'string' ? { id: undefined, name: a.source } : (a.source || { id: undefined, name: 'Unknown Source' });

        
  const aRecord = a as unknown as Record<string, unknown>;
        const possibleUrlCandidates = [
          
          aRecord['link'],
          aRecord['url'],
          aRecord['original_url'],
          aRecord['canonical_url'],
          aRecord['source_url'],
          aRecord['href'],
        ].filter(Boolean) as string[];

        let resolvedUrl = possibleUrlCandidates.find(Boolean) || '#';

        
        if (resolvedUrl && resolvedUrl.startsWith('//')) resolvedUrl = `https:${resolvedUrl}`;

        
        if (resolvedUrl && !resolvedUrl.startsWith('http') && /^[^\s\/]+\.[^\s]+/.test(resolvedUrl)) {
          resolvedUrl = `https://${resolvedUrl}`;
        }

        
        const possibleImageCandidates = [
          ...(a.images || []),
          aRecord['image'],
          aRecord['thumbnail'],
          aRecord['media'],
        ].flat().filter(Boolean) as string[];

        const resolvedImage = possibleImageCandidates.length ? possibleImageCandidates[0] : undefined;

        return {
          id: a.id || `finlight-${Date.now()}-${idx}`,
          title: a.title || (a.summary ? String(a.summary).slice(0, 60) : 'Untitled'),
          description: a.summary || a.content || 'No description available',
          content: a.content,
          url: resolvedUrl,
          urlToImage: resolvedImage,
          publishedAt: published,
          author: a.author || undefined,
          source: {
            id: sourceObj.id || undefined,
            name: sourceObj.name || 'Unknown Source'
          },
          category: a.category || this.categorizeArticle(a.title || '', a.summary || '')
        } as NewsArticle;
      });
  }

}


export function formatPublishDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInHours < 48) return 'Yesterday';
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
}

export const NEWS_CATEGORIES = [
  'all',
  'technology', 
  'business',
  'health',
  'science', 
  'sports',
  'environment',
  'politics',
  'entertainment'
] as const;

export type NewsCategory = typeof NEWS_CATEGORIES[number];