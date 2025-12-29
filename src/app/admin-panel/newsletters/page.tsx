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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Plus, Mail, Send, FileText } from "lucide-react";
import Link from "next/link";

interface Newsletter {
  id: string;
  title: string;
  subject: string;
  status: "DRAFT" | "SCHEDULED" | "SENT" | "FAILED";
  sentAt: string | null;
  openRate: number | null;
  clickRate: number | null;
  createdAt: string;
}

export default function NewslettersPage() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNewsletters();
  }, []);

  const fetchNewsletters = async () => {
    try {
      const res = await fetch('/api/newsletter');
      const data = await res.json();
      setNewsletters(data.newsletters || []);
    } catch (error) {
      console.error('Failed to fetch newsletters:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: Newsletter["status"]) => {
    switch (status) {
      case "SENT":
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Sent</Badge>;
      case "DRAFT":
        return <Badge variant="outline">Draft</Badge>;
      case "SCHEDULED":
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">Scheduled</Badge>;
      case "FAILED":
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/20">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <>
      <SignedIn>
        <ContentLayout title="Newsletters">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin-panel">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Newsletters</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="mt-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">All Newsletters</h2>
                <p className="text-muted-foreground">
                  {newsletters.filter(n => n.status === 'SENT').length} sent, {newsletters.filter(n => n.status === 'DRAFT').length} drafts
                </p>
              </div>
              <Button asChild>
                <Link href="/admin-panel/newsletters/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Newsletter
                </Link>
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-12 text-muted-foreground">
                Loading newsletters...
              </div>
            ) : newsletters.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Mail className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No newsletters yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first newsletter to send to subscribers
                  </p>
                  <Button asChild>
                    <Link href="/admin-panel/newsletters/new">Create First Newsletter</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Newsletter</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Sent</TableHead>
                      <TableHead className="text-center">Open Rate</TableHead>
                      <TableHead className="text-center">Click Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {newsletters.map((newsletter) => (
                      <TableRow key={newsletter.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{newsletter.title}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-[250px]">
                              {newsletter.subject}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(newsletter.status)}
                        </TableCell>
                        <TableCell>
                          {formatDate(newsletter.sentAt)}
                        </TableCell>
                        <TableCell className="text-center">
                          {newsletter.openRate !== null ? `${newsletter.openRate}%` : '-'}
                        </TableCell>
                        <TableCell className="text-center">
                          {newsletter.clickRate !== null ? `${newsletter.clickRate}%` : '-'}
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
