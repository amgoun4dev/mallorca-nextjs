"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface Photo {
  url: string;
  caption?: string;
}

interface HotelGalleryProps {
  photos: Photo[];
  photosByRoomType: Record<string, Photo[]>;
  gallery: Photo[];
}

export function HotelGallery({ photos, photosByRoomType, gallery }: HotelGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Kombiniere alle Bilder
  const allPhotos: Photo[] = [
    ...photos,
    ...gallery,
    ...Object.values(photosByRoomType).flat()
  ].filter((photo, index, self) => 
    index === self.findIndex(p => p.url === photo.url)
  );

  if (allPhotos.length === 0) {
    return null;
  }

  const openLightbox = (imageUrl: string) => {
    const index = allPhotos.findIndex(photo => photo.url === imageUrl);
    setCurrentIndex(index);
    setSelectedImage(imageUrl);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' 
      ? (currentIndex - 1 + allPhotos.length) % allPhotos.length
      : (currentIndex + 1) % allPhotos.length;
    
    setCurrentIndex(newIndex);
    setSelectedImage(allPhotos[newIndex].url);
  };

  return (
    <>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Galerie</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allPhotos.slice(0, 12).map((photo, index) => (
              <div 
                key={index}
                className="relative aspect-video overflow-hidden rounded-lg cursor-pointer group"
                onClick={() => openLightbox(photo.url)}
              >
                <Image
                  src={photo.url}
                  alt={photo.caption || `Hotel Bild ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                {photo.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 text-xs">
                    {photo.caption}
                  </div>
                )}
              </div>
            ))}
            
            {allPhotos.length > 12 && (
              <div 
                className="relative aspect-video overflow-hidden rounded-lg cursor-pointer bg-black/10 flex items-center justify-center"
                onClick={() => openLightbox(allPhotos[12].url)}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold">+{allPhotos.length - 12}</div>
                  <div className="text-sm">weitere Bilder</div>
                </div>
              </div>
            )}
          </div>

          {/* Room Type Categories */}
          {Object.keys(photosByRoomType).length > 0 && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-3">Nach Zimmerkategorie</h4>
              <div className="flex flex-wrap gap-2">
                {Object.keys(photosByRoomType).map((roomType) => (
                  <Badge key={roomType} variant="outline">
                    {roomType} ({photosByRoomType[roomType].length})
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedImage}
              alt="Hotel Bild"
              className="max-w-full max-h-full object-contain"
            />
            
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Navigation */}
            {allPhotos.length > 1 && (
              <>
                <button
                  onClick={() => navigateImage('prev')}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black/50 rounded-full p-2 hover:bg-black/70"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={() => navigateImage('next')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black/50 rounded-full p-2 hover:bg-black/70"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black/50 px-3 py-1 rounded">
              {currentIndex + 1} / {allPhotos.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
