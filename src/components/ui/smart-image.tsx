"use client";

import Image from 'next/image';
import { useState } from 'react';
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

  // If no src provided or error occurred, show placeholder
  if (!src || imageError) {
    return (
      <div className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`}>
        <ImageIcon className="w-8 h-8 text-gray-400" />
      </div>
    );
  }

  // Use proxy by default for all external URLs to avoid Next.js domain validation
  const isExternalUrl = src.startsWith('http') && !src.includes('localhost') && !src.includes('via.placeholder.com');
  const imageSrc = isExternalUrl ? `/api/image-proxy?url=${encodeURIComponent(src)}` : src;

  return (
    <>
      {isLoading && (
        <div className={`absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse ${className}`} />
      )}
      <Image
        src={imageSrc}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        className={className}
        priority={priority}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          console.warn(`Failed to load image: ${imageSrc}`);
          setImageError(true);
          setIsLoading(false);
        }}
      />
    </>
  );
}