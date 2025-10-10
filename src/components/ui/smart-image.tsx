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
  const [triedFallbackImg, setTriedFallbackImg] = useState(false);

  
  if (!src || imageError) {
    return (
      <div className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`}>
        <ImageIcon className="w-8 h-8 text-gray-400" />
      </div>
    );
  }

  
  
  let normalizedSrc = src;
  if (normalizedSrc.startsWith('//')) normalizedSrc = `https:${normalizedSrc}`;
  
  if (!/^https?:\/\//.test(normalizedSrc)) {
    normalizedSrc = `https://${normalizedSrc}`;
  }

  const isExternalUrl = /^https?:\/\//.test(normalizedSrc);
  const imageSrc = isExternalUrl ? `/api/image-proxy?url=${encodeURIComponent(normalizedSrc)}` : normalizedSrc;

  if (isExternalUrl) {
    
    console.debug('[SmartImage] proxying image', { original: src, normalized: normalizedSrc, proxied: imageSrc });
  }

  return (
    <>
      {isLoading && (
        <div className={`absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse ${className}`} />
      )}
      {!imageError && (
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
            console.warn(`SmartImage: Next/Image failed to load: ${imageSrc}`);
            setImageError(true);
            setIsLoading(false);
          }}
        />
      )}
      
      {imageError && !triedFallbackImg && (

        <Image
          src={normalizedSrc}
          alt={alt}
          className={`${className} object-cover`}
          style={fill ? { position: 'absolute', inset: 0, width: '100%', height: '100%' } : undefined}
          onLoad={() => {
            setTriedFallbackImg(true);
            setImageError(false);
            setIsLoading(false);
          }}
          onError={() => {
            console.warn(`SmartImage: fallback <img> also failed: ${normalizedSrc}`);
            setTriedFallbackImg(true);
            setIsLoading(false);
          }}
        />
      )}
    </>
  );
}