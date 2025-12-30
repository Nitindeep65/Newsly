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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Users, 
  Crown, 
  Download, 
  MoreVertical, 
  Trash2, 
  Mail,
  TrendingUp,
  Sparkles,
  Filter,
  UserCheck,
  UserX,
  IndianRupee,
  ChevronDown,
  RefreshCw
} from "lucide-react";

interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  tier: "FREE" | "PRO" | "PREMIUM";
  verified: boolean;
  subscribedAt: string;
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTier, setFilterTier] = useState<string>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [subscriberToDelete, setSubscriberToDelete] = useState<Subscriber | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([]);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/subscribers');
      const data = await res.json();
      setSubscribers(data.subscribers || []);
    } catch (error) {
      console.error('Failed to fetch subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubscriber = async () => {
    if (!subscriberToDelete) return;
    
    setDeleting(true);
    try {
      const res = await fetch(`/api/subscribers?id=${subscriberToDelete.id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        setSubscribers(subs => subs.filter(s => s.id !== subscriberToDelete.id));
        setDeleteDialogOpen(false);
        setSubscriberToDelete(null);
      } else {
        console.error('Failed to delete subscriber');
      }
    } catch (error) {
      console.error('Failed to delete subscriber:', error);
    } finally {
      setDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedSubscribers.length === 0) return;
    
    setDeleting(true);
    try {
      await Promise.all(
        selectedSubscribers.map(id => 
          fetch(`/api/subscribers?id=${id}`, { method: 'DELETE' })
        )
      );
      setSubscribers(subs => subs.filter(s => !selectedSubscribers.includes(s.id)));
      setSelectedSubscribers([]);
    } catch (error) {
      console.error('Failed to delete subscribers:', error);
    } finally {
      setDeleting(false);
    }
  };

  const toggleSelectSubscriber = (id: string) => {
    setSelectedSubscribers(prev => 
      prev.includes(id) 
        ? prev.filter(s => s !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedSubscribers.length === filteredSubscribers.length) {
      setSelectedSubscribers([]);
    } else {
      setSelectedSubscribers(filteredSubscribers.map(s => s.id));
    }
  };

  const filteredSubscribers = subscribers.filter(sub => {
    const matchesSearch = sub.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sub.name?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTier = filterTier === "all" || sub.tier === filterTier;
    return matchesSearch && matchesTier;
  });

  const proCount = subscribers.filter(s => s.tier === "PRO").length;
  const premiumCount = subscribers.filter(s => s.tier === "PREMIUM").length;
  const freeCount = subscribers.filter(s => s.tier === "FREE").length;
  const revenue = (proCount * 3) + (premiumCount * 10);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const exportCSV = () => {
    const headers = ['Email', 'Name', 'Tier', 'Subscribed Date'];
    const rows = subscribers.map(s => [
      s.email,
      s.name || '',
      s.tier,
      formatDate(s.subscribedAt)
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "PREMIUM":
        return (
          <Badge className="bg-gradient-to-r from-violet-500 to-purple-600 text-white border-0">
            <Crown className="h-3 w-3 mr-1" />
            Premium
          </Badge>
        );
      case "PRO":
        return (
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
            <Sparkles className="h-3 w-3 mr-1" />
            Pro
          </Badge>
        );
      default:
        return <Badge variant="outline">Free</Badge>;
    }
  };

  const statsCards = [
    {
      title: "Total Subscribers",
      value: subscribers.length,
      icon: <Users className="h-5 w-5" />,
      gradient: "from-violet-500 to-purple-600",
      description: "All time subscribers"
    },
    {
      title: "Premium Members",
      value: premiumCount,
      icon: <Crown className="h-5 w-5" />,
      gradient: "from-violet-500 to-purple-600",
      description: `₹${premiumCount * 10}/month`
    },
    {
      title: "Pro Members",
      value: proCount,
      icon: <Sparkles className="h-5 w-5" />,
      gradient: "from-amber-500 to-orange-600",
      description: `₹${proCount * 3}/month`
    },
    {
      title: "Total Revenue",
      value: `₹${revenue}`,
      icon: <IndianRupee className="h-5 w-5" />,
      gradient: "from-emerald-500 to-teal-600",
      description: "Monthly recurring"
    },
  ];

  return (
    <>
      <SignedIn>
        <ContentLayout title="Subscribers">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin-panel">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Subscribers</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="mt-6 space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {statsCards.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className="relative overflow-hidden border-0 shadow-lg dark:bg-zinc-900/50">
                    <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2`} />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.gradient} text-white`}>
                        {stat.icon}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{loading ? '...' : stat.value}</div>
                      <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Search, Filter & Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-0 shadow-lg dark:bg-zinc-900/50">
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full lg:w-auto">
                      <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search by email or name..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="gap-2">
                            <Filter className="h-4 w-4" />
                            {filterTier === "all" ? "All Tiers" : filterTier}
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => setFilterTier("all")}>
                            All Tiers
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setFilterTier("FREE")}>
                            Free
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setFilterTier("PRO")}>
                            Pro
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setFilterTier("PREMIUM")}>
                            Premium
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex gap-2 w-full lg:w-auto">
                      <Button variant="outline" onClick={fetchSubscribers} disabled={loading}>
                        <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                      </Button>
                      <Button variant="outline" onClick={exportCSV} disabled={subscribers.length === 0}>
                        <Download className="h-4 w-4 mr-2" />
                        Export CSV
                      </Button>
                      {selectedSubscribers.length > 0 && (
                        <Button 
                          variant="destructive" 
                          onClick={() => {
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete ({selectedSubscribers.length})
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Subscribers Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {loading ? (
                <Card className="border-0 shadow-lg dark:bg-zinc-900/50">
                  <CardContent className="py-16 text-center">
                    <RefreshCw className="h-8 w-8 mx-auto mb-4 text-muted-foreground animate-spin" />
                    <p className="text-muted-foreground">Loading subscribers...</p>
                  </CardContent>
                </Card>
              ) : filteredSubscribers.length === 0 ? (
                <Card className="border-0 shadow-lg dark:bg-zinc-900/50">
                  <CardContent className="py-16 text-center">
                    <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                    <h3 className="text-xl font-semibold mb-2">
                      {searchQuery || filterTier !== "all" ? "No subscribers found" : "No subscribers yet"}
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      {searchQuery || filterTier !== "all"
                        ? "Try adjusting your search or filter criteria" 
                        : "Share your landing page to get your first subscribers!"}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-0 shadow-lg dark:bg-zinc-900/50 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-stone-50 dark:bg-zinc-800/50">
                        <TableHead className="w-12">
                          <input
                            type="checkbox"
                            checked={selectedSubscribers.length === filteredSubscribers.length && filteredSubscribers.length > 0}
                            onChange={toggleSelectAll}
                            className="rounded border-gray-300"
                          />
                        </TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Tier</TableHead>
                        <TableHead>Subscribed</TableHead>
                        <TableHead className="w-12">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <AnimatePresence>
                        {filteredSubscribers.map((subscriber, index) => (
                          <motion.tr
                            key={subscriber.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ delay: index * 0.02 }}
                            className={`border-b last:border-0 hover:bg-stone-50 dark:hover:bg-zinc-800/50 transition-colors ${
                              selectedSubscribers.includes(subscriber.id) ? 'bg-violet-50 dark:bg-violet-500/10' : ''
                            }`}
                          >
                            <TableCell>
                              <input
                                type="checkbox"
                                checked={selectedSubscribers.includes(subscriber.id)}
                                onChange={() => toggleSelectSubscriber(subscriber.id)}
                                className="rounded border-gray-300"
                              />
                            </TableCell>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                                  {subscriber.email[0].toUpperCase()}
                                </div>
                                {subscriber.email}
                              </div>
                            </TableCell>
                            <TableCell>
                              {subscriber.name || <span className="text-muted-foreground">—</span>}
                            </TableCell>
                            <TableCell>
                              {getTierBadge(subscriber.tier)}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {formatDate(subscriber.subscribedAt)}
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSubscriberToDelete(subscriber);
                                      setDeleteDialogOpen(true);
                                    }}
                                    className="text-red-600 focus:text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </TableBody>
                  </Table>
                  <div className="p-4 border-t bg-stone-50 dark:bg-zinc-800/50">
                    <p className="text-sm text-muted-foreground">
                      Showing {filteredSubscribers.length} of {subscribers.length} subscribers
                    </p>
                  </div>
                </Card>
              )}
            </motion.div>
          </div>

          {/* Delete Confirmation Dialog */}
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Subscriber{selectedSubscribers.length > 1 ? 's' : ''}</AlertDialogTitle>
                <AlertDialogDescription>
                  {selectedSubscribers.length > 1 ? (
                    <>Are you sure you want to delete {selectedSubscribers.length} subscribers? This action cannot be undone.</>
                  ) : subscriberToDelete ? (
                    <>Are you sure you want to delete <strong>{subscriberToDelete.email}</strong>? This action cannot be undone.</>
                  ) : null}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={selectedSubscribers.length > 1 ? handleBulkDelete : handleDeleteSubscriber}
                  disabled={deleting}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {deleting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </>
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </ContentLayout>
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
