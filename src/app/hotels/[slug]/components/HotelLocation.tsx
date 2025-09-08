"use client";

import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Navigation } from "lucide-react";

interface HotelLocationProps {
  latitude?: string;
  longitude?: string;
  address?: string;
  location?: string;
}

export function HotelLocation({ latitude, longitude, address, location }: HotelLocationProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const hasLocation = Boolean(latitude && longitude);

  useEffect(() => {
    if (!hasLocation || !mapContainer.current) return;

    // Sanitize and normalize coordinates
    const sanitize = (value?: string, isLon: boolean = false): number | null => {
      if (!value) return null;
      let v = value.trim().replace(/,/g, '.').replace(/[^\d.\-]/g, '');
      const dotIdx = v.indexOf('.');
      if (dotIdx !== -1) {
        const head = v.slice(0, dotIdx + 1);
        const tail = v.slice(dotIdx + 1).replace(/\./g, '');
        v = head + tail;
      }
      let num = parseFloat(v);
      if (Number.isNaN(num)) return null;
      if (isLon) {
        if (Math.abs(num) > 180) {
          num = (((num + 180) % 360) + 360) % 360 - 180;
        }
      } else {
        if (Math.abs(num) > 90) {
          num = Math.max(-90, Math.min(90, num));
        }
      }
      return num;
    };

    let lat = sanitize(latitude, false);
    let lng = sanitize(longitude, true);

    // If looks swapped, try swap
    if (lat !== null && lng !== null) {
      if (Math.abs(lat) < 10 && Math.abs(lng) > 10 && Math.abs(lng) <= 180) {
        const tmp = lat; lat = lng; lng = tmp;
      }
    }

    // Mallorca fallback if still invalid/suspicious
    if (
      lat === null ||
      lng === null ||
      Math.abs(lat) < 20 ||
      Math.abs(lng) > 180
    ) {
      if (location?.toLowerCase().includes('mallorca')) {
        lat = 39.6953;
        lng = 3.0176;
      }
    }

    if (lat === null || lng === null) return;

    // Load Mapbox GL JS dynamically
    const loadMap = async () => {
      try {
        const mapboxgl = (await import('mapbox-gl')).default;
        
        // Set the access token
        mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

        // Initialize the map
        map.current = new mapboxgl.Map({
          container: mapContainer.current!,
          style: 'mapbox://styles/mapbox/light-v11',
          center: [lng, lat],
          zoom: 13
        });

        // Add a marker for the hotel
        new mapboxgl.Marker({ color: '#3176BC' })
          .setLngLat([lng, lat])
          .addTo(map.current);

        // Add navigation controls
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      } catch (error) {
        console.error('Error loading map:', error);
        // Fallback to static map if dynamic loading fails
        if (mapContainer.current) {
          mapContainer.current.innerHTML = `
            <div class="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
              <div class="text-center">
                <p class="text-muted-foreground mb-2">Karte wird geladen...</p>
                <a href="https://www.google.com/maps?q=${lat},${lng}&z=15" 
                   target="_blank" 
                   class="text-primary hover:underline">
                  Auf Google Maps anzeigen
                </a>
              </div>
            </div>
          `;
        }
      }
    };

    loadMap();

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [hasLocation, latitude, longitude, location]);

  if (!address && !location && !hasLocation) {
    return null;
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Lage & Anfahrt
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {address && (
            <div>
              <h4 className="font-semibold mb-2">Adresse</h4>
              <p className="text-muted-foreground">{address}</p>
            </div>
          )}
          
          {location && (
            <div>
              <h4 className="font-semibold mb-2">Lage</h4>
              <p className="text-muted-foreground">{location}</p>
            </div>
          )}
          
          {hasLocation && (
            <div>
              <h4 className="font-semibold mb-2">Koordinaten</h4>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Navigation className="h-4 w-4" />
                <span>
                  {parseFloat(latitude!).toFixed(6)}, {parseFloat(longitude!).toFixed(6)}
                </span>
              </div>
            </div>
          )}
          
          {hasLocation && (
            <div className="mt-6">
              <div className="space-y-2">
                <h4 className="font-semibold">Standort & Hotels in der Nähe</h4>
                <div 
                  ref={mapContainer}
                  className="w-full h-96 rounded-lg border border-border"
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
