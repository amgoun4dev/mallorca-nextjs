'use client';
import { useState, useEffect, forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  priority?: boolean;
  sizes?: string;
  onLoadComplete?: () => void;
  onError?: () => void;
  placeholder?: 'blur' | 'skeleton' | 'none';
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
}

/**
 * Optimized image component with intelligent loading, caching and error handling
 */
export const OptimizedImage = forwardRef<HTMLImageElement, OptimizedImageProps>(
  ({ 
    src, 
    alt, 
    fallbackSrc = "https://olrieidgokcnhhymksnf.supabase.co/storage/v1/object/public/general-images/mallorcamagic_fallback.jpg",
    priority = false,
    sizes = '(max-width: 768px) 100vw, 33vw',
    onLoadComplete,
    onError,
    placeholder = 'skeleton',
    className,
    fill = false,
    width,
    height,
    ...props 
  }, ref) => {
    const [currentSrc, setCurrentSrc] = useState(src);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
      setCurrentSrc(src);
      setIsLoading(true);
      setHasError(false);
    }, [src]);

    const handleLoad = () => {
      setIsLoading(false);
      onLoadComplete?.();
    };

    const handleError = () => {
      setHasError(true);
      setIsLoading(false);
      if (currentSrc !== fallbackSrc) {
        setCurrentSrc(fallbackSrc);
      } else {
        onError?.();
      }
    };

    // Clean URL helper
    const getCleanImageUrl = (url: string) => {
      if (!url) return fallbackSrc;
      const cleanedUrl = url.replace(/([^:]\/)\/+/g, '$1');
      return cleanedUrl.endsWith('/') ? fallbackSrc : cleanedUrl;
    };

    const renderPlaceholder = () => {
      if (placeholder === 'none') return null;
      
      if (placeholder === 'blur') {
        return (
          <div className={cn(
            "absolute inset-0 bg-gradient-to-br from-muted to-muted-foreground/20 animate-pulse",
            className
          )} />
        );
      }
      
      // Skeleton placeholder
      return (
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br from-muted via-muted-foreground/10 to-muted animate-pulse",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
          "before:animate-[shimmer_2s_infinite] before:translate-x-[-100%]",
          className
        )} />
      );
    };

    return (
      <div className={cn("relative overflow-hidden", fill && "absolute inset-0")}>
        {isLoading && renderPlaceholder()}
        <img
          ref={ref}
          src={getCleanImageUrl(currentSrc)}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          sizes={sizes}
          width={!fill ? width : undefined}
          height={!fill ? height : undefined}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            "transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100",
            fill && "absolute inset-0 w-full h-full object-cover",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

OptimizedImage.displayName = 'OptimizedImage';
