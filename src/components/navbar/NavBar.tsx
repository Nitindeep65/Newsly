"use client";

import Link from 'next/link';
import { useState } from 'react';
import { UserButton } from '@clerk/nextjs';
import { ModeToggle } from '@/components/togglemode';

export function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-black/90 backdrop-blur-sm z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-lg">N</span>
            </div>
            <span className="text-xl font-light tracking-wide">Newsly</span>
          </div>

          <div className="hidden md:flex items-center space-x-10 text-sm">
            <Link href="#features" className="hover:text-gray-400 transition-colors">Features</Link>
            <Link href="#how" className="hover:text-gray-400 transition-colors">How it Works</Link>
            <Link href="#pricing" className="hover:text-gray-400 transition-colors">Pricing</Link>
            <Link href={'/sign-in'} className="hover:text-gray-400 transition-colors">Sign In</Link>
            <Link href={'/sign-up'}  className="bg-white text-black px-6 py-2 rounded hover:bg-gray-200 transition-colors font-medium">Get Started</Link>
            <UserButton afterSignOutUrl="/" />
            <ModeToggle />
          </div>

          <div className="flex md:hidden items-center space-x-3">
            <Link href={'/sign-in'} className="text-sm hover:text-gray-300">Sign In</Link>
            <Link href={'/sign-up'} className="bg-white text-black px-3 py-1 rounded hover:bg-gray-200 transition-colors text-sm">Get Started</Link>
            <button onClick={() => setOpen((v) => !v)} aria-label="Open menu" className="p-2">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18M3 6h18M3 18h18"></path></svg>
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-black/95 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 py-3 flex flex-col gap-3">
            <Link href={'/sign-in'} className="text-sm hover:text-gray-300">Sign In</Link>
            <Link href={'/sign-up'} className="bg-white text-black px-4 py-2 rounded inline-block w-max">Get Started</Link>
            <div className="pt-2"><UserButton afterSignOutUrl="/" /></div>
            <div className="pt-2"><ModeToggle /></div>
          </div>
        </div>
      )}
    </nav>
  );
}
