"use client";

import { useEffect, useState, useRef } from "react";
import { BreakingNewsService, BreakingNewsItem as ServiceBreakingNewsItem } from "@/lib/api/breaking-news";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";

type BreakingNewsItem = ServiceBreakingNewsItem;

export default function FinlightNewsBell() {
  const [news, setNews] = useState<BreakingNewsItem[]>([]);
  const [lastNewsId, setLastNewsId] = useState<string | null>(null);
  const lastNewsIdRef = useRef<string | null>(lastNewsId);
  const [sound] = useState<HTMLAudioElement | null>(
    typeof Audio !== "undefined" ? new Audio("/notification.mp3") : null
  );

  useEffect(() => {
    lastNewsIdRef.current = lastNewsId;
  }, [lastNewsId]);

  useEffect(() => {
    let mounted = true;

    const fetchBreakingNews = async () => {
      try {
        const items = await BreakingNewsService.getBreakingNews();
        if (!mounted) return;
        if (items && items.length > 0) {
          const latest = items[0];
          if (latest.id !== lastNewsIdRef.current) {
            try {
              await sound?.play();
            } catch {
              // ignore play errors
            }
            setLastNewsId(latest.id);
            lastNewsIdRef.current = latest.id;
          }
          setNews(items as BreakingNewsItem[]);
        }
      } catch (err) {
        console.error("Error fetching breaking news via service:", err);
      }
    };

    fetchBreakingNews();
    const interval = setInterval(fetchBreakingNews, 15000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [sound]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {news.length > 0 && (
            <Badge className="absolute -top-2 -right-2 rounded-full bg-red-500 text-white px-2 py-0.5 text-xs font-medium">
              {news.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-4">
        <DropdownMenuLabel className="mb-2 text-lg font-medium">Breaking News</DropdownMenuLabel>
        <DropdownMenuSeparator className="my-2" />

        {news.length === 0 ? (
          <p className="text-sm text-gray-500 text-center">No breaking news yet</p>
        ) : (
          <div className="space-y-4 max-h-60 overflow-y-auto">
            {news.map((item) => (
              <div key={item.id} className="flex flex-col border-b pb-2">
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-gray-500">{item.publishedAt}</p>
              </div>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
