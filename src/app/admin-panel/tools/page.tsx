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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Plus, Search, Pencil, Trash2, ExternalLink, Sparkles, CheckCircle } from "lucide-react";
import Link from "next/link";
import { SmartImage } from "@/components/ui/smart-image";

interface Tool {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  logoUrl: string | null;
  category: string;
  pricing: string;
  priceInr: number | null;
  featured: boolean;
  verified: boolean;
  views: number;
  clicks: number;
  createdAt: string;
}

export default function AdminToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      const res = await fetch('/api/tools?limit=100');
      const data = await res.json();
      setTools(data.tools || []);
    } catch (error) {
      console.error('Failed to fetch tools:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/tools/${id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        setTools(tools.filter(t => t.id !== id));
      } else {
        console.error('Failed to delete tool');
      }
    } catch (error) {
      console.error('Failed to delete tool:', error);
    }
    setDeleteId(null);
  };

  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCategory = (category: string) => {
    return category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <>
      <SignedIn>
        <ContentLayout title="Manage Tools">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin-panel">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Tools</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="mt-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">AI Tools Directory</h2>
                <p className="text-muted-foreground">
                  Manage your collection of {tools.length} AI tools
                </p>
              </div>
              <Button asChild>
                <Link href="/admin-panel/tools/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Tool
                </Link>
              </Button>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12 text-muted-foreground">
                Loading tools...
              </div>
            ) : filteredTools.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? "No tools found matching your search" : "No tools yet"}
                </p>
                {!searchQuery && (
                  <Button asChild>
                    <Link href="/admin-panel/tools/new">Add Your First Tool</Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Tool</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Pricing</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-center">Views</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTools.map((tool) => (
                      <TableRow key={tool.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                              {tool.logoUrl ? (
                                <SmartImage
                                  src={tool.logoUrl}
                                  alt={tool.name}
                                  width={40}
                                  height={40}
                                  className="object-cover"
                                />
                              ) : (
                                <span className="text-lg font-bold text-muted-foreground">
                                  {tool.name.charAt(0)}
                                </span>
                              )}
                            </div>
                            <div>
                              <div className="font-medium">{tool.name}</div>
                              <div className="text-sm text-muted-foreground line-clamp-1">
                                {tool.tagline}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {formatCategory(tool.category)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {tool.pricing.replace(/_/g, ' ')}
                            {tool.priceInr && (
                              <span className="text-muted-foreground ml-1">
                                ₹{tool.priceInr}/mo
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center gap-1">
                            {tool.featured && (
                              <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                                <Sparkles className="h-3 w-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                            {tool.verified && (
                              <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                            {!tool.featured && !tool.verified && (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {tool.views}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={`/tools/${tool.slug}`} target="_blank">
                                <ExternalLink className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={`/admin-panel/tools/${tool.id}/edit`}>
                                <Pencil className="h-4 w-4" />
                              </Link>
                            </Button>
                            <AlertDialog open={deleteId === tool.id} onOpenChange={(open) => !open && setDeleteId(null)}>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => setDeleteId(tool.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete {tool.name}?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the
                                    tool from your directory.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(tool.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </ContentLayout>
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
