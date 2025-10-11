 "use client";

 import { useEffect, useState } from "react";
 import { NewsTile } from "@/components/news/news-tile";
 import { NewsArticle } from "@/lib/api/news";

 export default function BookmarksPage() {
   const [bookmarks, setBookmarks] = useState<NewsArticle[]>([]);

   // Load saved bookmarks from localStorage on mount
   useEffect(() => {
     const saved = JSON.parse(localStorage.getItem("bookmarks") || "[]");
     setBookmarks(saved);
   }, []);

   return (
     <div className="p-6 min-h-screen">
       <h1 className="text-2xl sm:text-3xl font-bold mb-6">📚 Saved Articles</h1>

       {bookmarks.length === 0 ? (
         <div className="text-center text-muted-foreground mt-10">
           <p>No bookmarks yet.</p>
           <p className="text-sm mt-2">Go back and add some articles!</p>
         </div>
       ) : (
         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
           {bookmarks.map((article) => (
             <NewsTile
               key={article.url}
               article={article}
               showImage={true}
             />
           ))}
         </div>
       )}
     </div>
   );
 }
