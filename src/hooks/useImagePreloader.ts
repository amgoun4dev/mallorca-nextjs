import { useEffect, useState } from 'react';

interface PreloadOptions {
  priority?: boolean;
  sizes?: string;
  preloadNext?: number; // Number of next images to preload
}

/**
 * Hook for intelligent image preloading
 * Preloads current and next images for smooth carousel experience
 */
export function useImagePreloader(
  images: string[], 
  currentIndex: number, 
  options: PreloadOptions = {}
) {
  const { priority = false, sizes = '(max-width: 768px) 100vw, 33vw', preloadNext = 2 } = options;
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!images.length) return;

    // Calculate which images to preload
    const imagesToPreload = new Set<string>();
    
    // Always preload current image
    const currentImage = images[currentIndex];
    if (currentImage) imagesToPreload.add(currentImage);
    
    // Preload next images
    for (let i = 1; i <= preloadNext; i++) {
      const nextIndex = (currentIndex + i) % images.length;
      const nextImage = images[nextIndex];
      if (nextImage) imagesToPreload.add(nextImage);
    }
    
    // Preload previous image for smooth backward navigation
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    const prevImage = images[prevIndex];
    if (prevImage) imagesToPreload.add(prevImage);

    imagesToPreload.forEach(imageUrl => {
      if (!loadedImages.has(imageUrl) && !loadingImages.has(imageUrl)) {
        setLoadingImages(prev => new Set(prev).add(imageUrl));
        
        const img = new Image();
        img.decoding = 'async';
        img.loading = priority ? 'eager' : 'lazy';
        
        // Set sizes for responsive images
        if (sizes) {
          img.sizes = sizes;
        }
        
        img.onload = () => {
          setLoadedImages(prev => new Set(prev).add(imageUrl));
          setLoadingImages(prev => {
            const next = new Set(prev);
            next.delete(imageUrl);
            return next;
          });
        };
        
        img.onerror = () => {
          setLoadingImages(prev => {
            const next = new Set(prev);
            next.delete(imageUrl);
            return next;
          });
        };
        
        img.src = imageUrl;
      }
    });
  }, [images, currentIndex, loadedImages, loadingImages, priority, sizes, preloadNext]);

  return {
    isLoaded: (url: string) => loadedImages.has(url),
    isLoading: (url: string) => loadingImages.has(url),
    loadedCount: loadedImages.size,
    totalCount: images.length
  };
}

/**
 * Hook for preloading all images in background
 * Use for galleries where you want all images ready
 */
export function useImagePreloaderAll(images: string[]) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!images.length) return;

    let completed = 0;
    const total = images.length;

    images.forEach(imageUrl => {
      if (!loadedImages.has(imageUrl)) {
        const img = new Image();
        img.decoding = 'async';
        img.loading = 'lazy';
        
        const handleComplete = () => {
          completed++;
          setProgress(Math.round((completed / total) * 100));
          setLoadedImages(prev => new Set(prev).add(imageUrl));
        };
        
        img.onload = handleComplete;
        img.onerror = handleComplete; // Count errors as completed to not block progress
        img.src = imageUrl;
      }
    });
  }, [images, loadedImages]);

  return {
    isLoaded: (url: string) => loadedImages.has(url),
    progress,
    isComplete: progress === 100,
    loadedCount: loadedImages.size
  };
}
