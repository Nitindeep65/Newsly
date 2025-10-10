"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Clock, User } from "lucide-react";
import { NewsArticle, formatPublishDate } from "@/lib/api/news";
import { SmartImage } from "@/components/ui/smart-image";

interface NewsTileProps {
  article: NewsArticle;
  onReadMore?: (article: NewsArticle) => void;
}

export function NewsTile({ article, onReadMore }: NewsTileProps) {
  const handleReadMore = () => {
    if (onReadMore) {
      onReadMore(article);
    } else {
      // Default behavior: open article in new tab
      window.open(article.url, '_blank');
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col">
      {/* SmartImage handles error states internally */}
      {article.urlToImage && (
        <div className="relative">
          <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
            <SmartImage
              src={article.urlToImage}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
              {article.category}
            </Badge>
          </div>
        </div>
      )}

      
      {/* If no image from API, show category badge in header area */}
      {!article.urlToImage && (
        <div className="p-4 pb-0">
          <Badge variant="secondary">
            {article.category || 'News'}
          </Badge>
        </div>
      )}
      
      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-2 text-lg leading-tight group-hover:text-primary transition-colors">
          {article.title}
        </CardTitle>
        <CardDescription className="line-clamp-3 text-sm">
          {article.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{formatPublishDate(article.publishedAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{article.author || 'Unknown'}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              {article.source.name}
            </span>
          </div>
        </div>
        
        <Button 
          onClick={handleReadMore} 
          variant="outline" 
          size="sm" 
          className="mt-4 w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
        >
          <ExternalLink className="h-3 w-3 mr-1" />
          Read More
        </Button>
      </CardContent>
    </Card>
  );
}