"use client";

import Image from 'next/image';
import { useState } from 'react';
import { SHOW_IMAGES } from '@/lib/app-config';
import { ImageIcon } from 'lucide-react';

interface SmartImageProps {
  src?: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export function SmartImage({ 
  src, 
  alt, 
  fill = false, 
  width, 
  height, 
  className = "",
  priority = false 
}: SmartImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (!SHOW_IMAGES) {
    return null;
  }

  if (!src || imageError) {
    return (
      <div className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`}>
        <ImageIcon className="w-8 h-8 text-gray-400" />
      </div>
    );
  }

  // Normalize URL
  let normalizedSrc = src;
  if (normalizedSrc.startsWith('//')) normalizedSrc = `https:${normalizedSrc}`;
  if (!/^https?:\/\//.test(normalizedSrc) && !normalizedSrc.startsWith('/')) {
    normalizedSrc = `https://${normalizedSrc}`;
  }

  return (
    <>
      {isLoading && (
        <div className={`absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse ${className}`} />
      )}
      <Image
        src={normalizedSrc}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        className={className}
        priority={priority}
        unoptimized // Skip Next.js image optimization for external URLs
        onLoad={() => setIsLoading(false)}
        onError={() => {
          console.warn(`SmartImage: Failed to load: ${normalizedSrc}`);
          setImageError(true);
          setIsLoading(false);
        }}
      />
    </>
  );
}