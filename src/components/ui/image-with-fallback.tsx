"use client";
import { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  onLoad?: () => void;
  onError?: () => void;
  loading?: 'eager' | 'lazy';
  style?: React.CSSProperties;
}

export function ImageWithFallback({ 
  src, 
  alt, 
  className, 
  fallbackSrc = "https://olrieidgokcnhhymksnf.supabase.co/storage/v1/object/public/general-images/mallorcamagic_fallback.jpg",
  onLoad,
  onError,
  loading = 'lazy',
  style
}: ImageWithFallbackProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setCurrentSrc(src);
    setHasError(false);
    setIsLoading(true);
  }, [src]);

  const handleError = () => {
    if (!hasError && currentSrc !== fallbackSrc) {
      setHasError(true);
      setCurrentSrc(fallbackSrc);
      setIsLoading(false); // Stop loading state on error
      onError?.();
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  return (
    <div className={cn("relative overflow-hidden", className)} style={style}>
      {isLoading && (
        <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center z-10">
          <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={currentSrc}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        loading={loading}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-500",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        style={{ 
          minHeight: '100%',
          objectFit: 'cover'
        }}
        // Timeout for better UX if images take too long to load
        onLoadStart={() => {
          const timeout = setTimeout(() => {
            if (isLoading && !hasError) {
              handleError();
            }
          }, 8000); // 8 seconds timeout
          
          return () => clearTimeout(timeout);
        }}
      />
    </div>
  );
}
