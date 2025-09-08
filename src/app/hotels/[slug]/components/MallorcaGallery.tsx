"use client";
import { useState, useEffect } from "react";

export function MallorcaGallery() {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const galleryImages = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1544264351-6e4ec31fdd93?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1568393691622-c7ba131d63b4?w=400&h=400&fit=crop'
  ];

  // Preload all gallery images in background
  useEffect(() => {
    let loadedCount = 0;
    const totalImages = galleryImages.length;

    const preloadImage = (src: string) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          loadedCount++;
          setProgress((loadedCount / totalImages) * 100);
          if (loadedCount === totalImages) {
            setIsComplete(true);
          }
          resolve(img);
        };
        img.onerror = reject;
        img.src = src;
      });
    };

    // Start preloading all images
    Promise.all(galleryImages.map(preloadImage)).catch(console.error);
  }, []);

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center mb-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2 text-foreground">
              Mallorca Gallery
            </h2>
            {!isComplete && (
              <div className="w-64 bg-muted rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
          {galleryImages.map((image, index) => (
            <div 
              key={index} 
              className="aspect-square overflow-hidden rounded-lg group cursor-pointer"
            >
              <img
                src={image}
                alt={`Mallorca gallery ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading={index < 6 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
