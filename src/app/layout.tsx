
import type { Metadata } from "next";
import { Nunito, Poppins } from "next/font/google";
import "./globals.css";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Toaster } from "../components/ui/toaster";
import { WebVitals } from "../components/performance/WebVitals";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-nunito",
  display: "swap",
  preload: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
  preload: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
});

export const metadata: Metadata = {
  title: {
    default: "Mallorca Magic - Ihr ultimativer Mallorca Guide",
    template: "%s | Mallorca Magic"
  },
  description: "Entdecken Sie die Magie Mallorcas mit unserem ultimativen Guide. Von versteckten Stränden zu Luxusunterkünften, unvergessliche Abenteuer bis hin zu Traumimmobilien.",
  keywords: ["Mallorca", "Guide", "Hotels", "Aktivitäten", "Strände", "Traumimmobilien", "Balearen", "Urlaub", "Reise"],
  authors: [{ name: "Mallorca Magic Team" }],
  creator: "Mallorca Magic",
  publisher: "Mallorca Magic",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.mallorcamagic.de"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.ico?v=4",
    shortcut: "/favicon.ico?v=4",
    apple: "/favicon.ico?v=4",
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "/",
    title: "Mallorca Magic - Ihr ultimativer Mallorca Guide",
    description: "Entdecken Sie die Magie Mallorcas mit unserem ultimativen Guide. Von versteckten Stränden zu Luxusunterkünften, unvergessliche Abenteuer bis hin zu Traumimmobilien.",
    siteName: "Mallorca Magic",
    images: [
      {
        url: "/lovable-uploads/4223ae41-b263-48cb-a4eb-c54e7d88de5e.png",
        width: 1200,
        height: 630,
        alt: "Mallorca Magic Hero Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mallorca Magic - Ihr ultimativer Mallorca Guide",
    description: "Entdecken Sie die Magie Mallorcas mit unserem ultimativen Guide. Von versteckten Stränden zu Luxusunterkünften, unvergessliche Abenteuer bis hin zu Traumimmobilien.",
    images: ["/lovable-uploads/4223ae41-b263-48cb-a4eb-c54e7d88de5e.png"],
    creator: "@mallorcamagic",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico?v=4" sizes="any" />
        <link rel="shortcut icon" href="/favicon.ico?v=4" />
        <link rel="apple-touch-icon" href="/favicon.ico?v=4" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico?v=4" />
        
        {/* Critical resource hints for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://olrieidgokcnhhymksnf.supabase.co" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://api.mapbox.com" />
        
        {/* Mapbox CSS */}
        <link href="https://api.mapbox.com/mapbox-gl-js/v3.14.0/mapbox-gl.css" rel="stylesheet" />
        
        {/* Preload critical hero image */}
        <link rel="preload" href="/lovable-uploads/4223ae41-b263-48cb-a4eb-c54e7d88de5e.png" as="image" type="image/png" />
        
        {/* Critical CSS inline styles */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical above-the-fold styles */
            .hero-section { min-height: 90vh; display: flex; align-items: center; justify-content: center; }
            .hero-bg { position: absolute; inset: 0; background-size: cover; background-position: center; background-repeat: no-repeat; }
            .hero-overlay { position: absolute; inset: 0; background-color: rgba(0, 0, 0, 0.4); }
            .fade-in { opacity: 0; animation: fadeIn 0.6s ease-out forwards; }
            .scale-in { opacity: 0; transform: scale(0.95); animation: scaleIn 0.6s ease-out forwards; }
            @keyframes fadeIn { to { opacity: 1; } }
            @keyframes scaleIn { to { opacity: 1; transform: scale(1); } }
          `
        }} />
      </head>
      <body className={`${nunito.variable} ${poppins.variable} antialiased`}>
        <WebVitals />
        <Header />
        <main>{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
