"use client";

import { useUser, UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Newspaper,
  Bell,
  Menu,
  Home,
  Target,
  Crown,
  Settings,
  User,
  Shield,
  FileText,
  HelpCircle,
  LogOut,
  ChevronRight,
  Sparkles,
  X,
  Mail,
  CreditCard,
  Moon,
  Sun,
  ExternalLink,
} from "lucide-react";
import { useTheme } from "next-themes";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const MENU_ITEMS = [
  { 
    title: "Dashboard", 
    href: "/my-newsletters", 
    icon: Home,
    description: "Overview of your subscription"
  },
  { 
    title: "My Topics", 
    href: "/my-newsletters/topics", 
    icon: Target,
    description: "Manage your interests"
  },
  { 
    title: "Subscription", 
    href: "/my-newsletters/subscription", 
    icon: Crown,
    description: "Upgrade your plan"
  },
];

const SETTINGS_ITEMS = [
  { title: "Account Details", href: "/my-newsletters/settings/account", icon: User },
  { title: "Email Preferences", href: "/my-newsletters/settings/email", icon: Mail },
  { title: "Billing", href: "/my-newsletters/settings/billing", icon: CreditCard },
  { title: "Privacy", href: "/my-newsletters/settings/privacy", icon: Shield },
];

const POLICY_ITEMS = [
  { title: "Terms of Service", href: "/terms", icon: FileText },
  { title: "Privacy Policy", href: "/privacy", icon: Shield },
  { title: "Help Center", href: "/help", icon: HelpCircle },
];

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoaded } = useUser();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Newsletter Delivered",
      message: "Your morning digest has been sent to your inbox",
      time: "2 hours ago",
      read: false,
    },
    {
      id: "2",
      title: "New Topic Available",
      message: "Productivity Hacks is now available for Premium users",
      time: "1 day ago",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-200/20 dark:bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-violet-200/20 dark:bg-violet-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-emerald-200/20 dark:bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Left Side - Logo & Mobile Menu */}
            <div className="flex items-center gap-4">
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0">
                  <SheetHeader className="p-6 border-b">
                    <SheetTitle className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600">
                        <Newspaper className="h-5 w-5 text-white" />
                      </div>
                      <span className="font-bold text-xl">Newsly</span>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="p-4 space-y-6">
                    {/* Menu Items */}
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-muted-foreground uppercase px-3 mb-2">Menu</p>
                      {MENU_ITEMS.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                            pathname === item.href
                              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                              : 'hover:bg-stone-100 dark:hover:bg-zinc-800'
                          }`}
                        >
                          <item.icon className="h-5 w-5" />
                          <div className="flex-1">
                            <p className="font-medium">{item.title}</p>
                            <p className={`text-xs ${pathname === item.href ? 'text-white/70' : 'text-muted-foreground'}`}>
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* Settings */}
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-muted-foreground uppercase px-3 mb-2">Settings</p>
                      {SETTINGS_ITEMS.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                          <item.icon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{item.title}</span>
                        </Link>
                      ))}
                    </div>

                    {/* Policies */}
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-muted-foreground uppercase px-3 mb-2">Policies</p>
                      {POLICY_ITEMS.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                          <item.icon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{item.title}</span>
                          <ExternalLink className="h-3 w-3 text-muted-foreground ml-auto" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <Link href="/my-newsletters" className="flex items-center gap-2">
                <motion.div 
                  whileHover={{ rotate: 10 }}
                  className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600"
                >
                  <Newspaper className="h-5 w-5 text-white" />
                </motion.div>
                <span className="font-bold text-xl hidden sm:block">Newsly</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {MENU_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    pathname === item.href
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                      : 'hover:bg-stone-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              ))}
            </nav>

            {/* Right Side - Actions */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="rounded-full"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative rounded-full">
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                      <Button variant="ghost" size="sm" className="text-xs h-auto py-1" onClick={markAllAsRead}>
                        Mark all read
                      </Button>
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        onClick={() => markAsRead(notification.id)}
                        className="flex flex-col items-start gap-1 p-3 cursor-pointer"
                      >
                        <div className="flex items-start gap-2 w-full">
                          {!notification.read && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 shrink-0" />
                          )}
                          <div className={!notification.read ? '' : 'ml-4'}>
                            <p className="font-medium text-sm">{notification.title}</p>
                            <p className="text-xs text-muted-foreground">{notification.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Menu */}
              <SignedIn>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 rounded-full pl-2 pr-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                        {user?.firstName?.[0] || user?.emailAddresses[0]?.emailAddress[0].toUpperCase() || 'U'}
                      </div>
                      <span className="hidden sm:block text-sm font-medium">
                        {user?.firstName || 'User'}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span>{user?.fullName || 'User'}</span>
                        <span className="text-xs font-normal text-muted-foreground">
                          {user?.emailAddresses[0]?.emailAddress}
                        </span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/my-newsletters/settings/account" className="cursor-pointer">
                        <User className="h-4 w-4 mr-2" />
                        Account Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/my-newsletters/subscription" className="cursor-pointer">
                        <Crown className="h-4 w-4 mr-2" />
                        Subscription
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/my-newsletters/settings/billing" className="cursor-pointer">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Billing
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/help" className="cursor-pointer">
                        <HelpCircle className="h-4 w-4 mr-2" />
                        Help Center
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600 focus:text-red-600">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SignedIn>

              <SignedOut>
                <SignInButton mode="modal">
                  <Button className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Newspaper className="h-4 w-4 text-amber-500" />
              <span className="text-sm text-muted-foreground">© 2025 Newsly. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="/help" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Help
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
