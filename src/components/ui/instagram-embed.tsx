"use client";
import { useState, useEffect } from 'react';
import { Button } from './button';
import { ExternalLink, Instagram } from 'lucide-react';

interface InstagramEmbedProps {
  embedUrl: string;
  mode?: 'preview' | 'load-on-click' | 'auto-load';
}

export function InstagramEmbed({ embedUrl, mode = 'auto-load' }: InstagramEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-load Instagram embed on mount for auto-load mode
  useEffect(() => {
    if (mode === 'auto-load') {
      loadInstagramEmbed();
    }
  }, [mode]);

  const extractPostId = (url: string) => {
    const match = url.match(/\/p\/([^\/]+)/);
    return match ? match[1] : null;
  };

  const loadInstagramEmbed = async () => {
    if (isLoaded || isLoading) return;
    
    setIsLoading(true);
    
    try {
      // Dynamically load Instagram's embed script
      if (typeof window !== 'undefined' && !(window as any).instgrm) {
        const script = document.createElement('script');
        script.src = 'https://www.instagram.com/embed.js';
        script.async = true;
        document.body.appendChild(script);
        
        // Wait for script to load
        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }
      
      setIsLoaded(true);
      
      // Process embeds after script is loaded
      setTimeout(() => {
        if (typeof window !== 'undefined' && (window as any).instgrm?.Embeds) {
          (window as any).instgrm.Embeds.process();
        }
      }, 100);
    } catch (error) {
      console.error('Failed to load Instagram embed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderPreview = () => (
    <div className="my-8 max-w-md mx-auto">
      <div className="bg-gradient-to-br from-purple-400 via-pink-500 to-orange-400 p-6 rounded-xl shadow-lg">
        <div className="bg-white rounded-lg p-6 text-center">
          <Instagram className="w-12 h-12 mx-auto mb-4 text-pink-500" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Instagram-Beitrag
          </h3>
          <p className="text-gray-600 mb-4 text-sm">
            Diesen Beitrag auf Instagram ansehen
          </p>
          <Button
            onClick={() => window.open(embedUrl, '_blank', 'noopener,noreferrer')}
            variant="outline"
            className="w-full"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Auf Instagram öffnen
          </Button>
        </div>
      </div>
    </div>
  );

  const renderLoadOnClick = () => {
    if (isLoaded) {
      const postId = extractPostId(embedUrl);
      return (
        <div className="my-8 flex justify-center">
          <blockquote
            className="instagram-media"
            data-instgrm-permalink={embedUrl}
            data-instgrm-version="14"
            style={{
              background: '#FFF',
              border: '0',
              borderRadius: '3px',
              boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
              margin: '1px',
              maxWidth: '540px',
              minWidth: '326px',
              padding: '0',
              width: 'calc(100% - 2px)'
            }}
          >
            <div style={{ padding: '16px' }}>
              <a
                href={embedUrl}
                style={{
                  background: '#FFFFFF',
                  lineHeight: '0',
                  padding: '0 0',
                  textAlign: 'center',
                  textDecoration: 'none',
                  width: '100%'
                }}
                target="_blank"
                rel="noopener noreferrer"
              >
                Sieh dir diesen Beitrag auf Instagram an
              </a>
            </div>
          </blockquote>
        </div>
      );
    }

    return (
      <div className="my-8 max-w-md mx-auto">
        <div className="bg-gradient-to-br from-purple-400 via-pink-500 to-orange-400 p-6 rounded-xl shadow-lg">
          <div className="bg-white rounded-lg p-6 text-center">
            <Instagram className="w-12 h-12 mx-auto mb-4 text-pink-500" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Instagram-Beitrag
            </h3>
            <p className="text-gray-600 mb-4 text-sm">
              Klicke hier, um den Instagram-Beitrag zu laden
            </p>
            <div className="space-y-2">
              <Button
                onClick={loadInstagramEmbed}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Lädt...' : 'Beitrag laden'}
              </Button>
              <Button
                onClick={() => window.open(embedUrl, '_blank', 'noopener,noreferrer')}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Direkt auf Instagram öffnen
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (mode === 'preview') {
    return renderPreview();
  } else {
    return renderLoadOnClick();
  }
}

// Extend window interface for Instagram embed script
declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}
