"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NewsGrid } from "@/components/news/news-grid";
import { Newspaper, BookOpen, Bookmark, TrendingUp } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useState } from 'react';
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";


export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

 
  const handleGridLoadingChange = (isLoading: boolean) => {
    if (isLoading) {
    
      setLoading(false);
    }
   
  };

  return (
    <><SignedIn>
      <ContentLayout title="Dashboard">
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
            <Spinner className="w-8 h-8  text-black" />
          </div>
        )}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin-panel">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Latest News</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Welcome to Newsly</CardTitle>
              <Newspaper className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Your News Hub</div>
              <p className="text-xs text-muted-foreground">
                Stay informed with latest updates
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Articles Today</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6</div>
              <p className="text-xs text-muted-foreground">
                Fresh articles available
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saved Articles</CardTitle>
              <Bookmark className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Articles bookmarked
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Trending</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Technology</div>
              <p className="text-xs text-muted-foreground">
                Most popular category today
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Latest News</h2>
              <p className="text-muted-foreground">
                Discover the latest articles from trusted sources
              </p>
            </div>
          </div>

          <NewsGrid
            limit={9}
            showCategoryFilter={true}
            onLoadingChange={handleGridLoadingChange}
            onArticleClick={(article) => {
              window.open(article.url, '_blank');
            } } />
        </div>
      </ContentLayout>
    </SignedIn><SignedOut>
        <RedirectToSignIn />
      </SignedOut></>
      
  );
}