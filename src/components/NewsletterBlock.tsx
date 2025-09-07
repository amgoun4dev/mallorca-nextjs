"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface NewsletterBlockProps {
  language?: 'en' | 'de' | 'es';
}

export function NewsletterBlock({ language = 'de' }: NewsletterBlockProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getLabels = () => {
    switch (language) {
      case 'de': return {
        title: 'Abonnieren und 20% sparen',
        subtitle: 'Erhalten Sie exklusive Angebote und Insider-Tipps für Mallorca',
        placeholder: 'Ihre E-Mail-Adresse',
        submit: 'Anmelden',
        success: 'Erfolgreich angemeldet!',
        privacy: 'Wir respektieren Ihre Privatsphäre. Keine Weitergabe an Dritte.'
      };
      case 'es': return {
        title: 'Suscríbete y ahorra 20%',
        subtitle: 'Recibe ofertas exclusivas y consejos de expertos sobre Mallorca',
        placeholder: 'Tu dirección de correo',
        submit: 'Suscribirse',
        success: '¡Suscripción exitosa!',
        privacy: 'Respetamos tu privacidad. No compartimos datos con terceros.'
      };
      default: return {
        title: 'Subscribe and get 20% off',
        subtitle: 'Get exclusive deals and insider tips for Mallorca',
        placeholder: 'Your email address',
        submit: 'Subscribe',
        success: 'Successfully subscribed!',
        privacy: 'We respect your privacy. No sharing with third parties.'
      };
    }
  };

  const labels = getLabels();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          language 
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Unbekannter Fehler');
      }
      
      toast({
        title: labels.success,
        description: labels.privacy,
      });
      
      setEmail("");
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: error?.message || "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section 
      className="py-16 bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url('https://olrieidgokcnhhymksnf.supabase.co/storage/v1/object/public/general-images/mallorcamagic_fallback.jpg')`
      }}
    >
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="p-8 bg-white/95 backdrop-blur-sm shadow-xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              {labels.title}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {labels.subtitle}
            </p>
            
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
              <Input
                type="email"
                placeholder={labels.placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1"
              />
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-gradient-primary hover:opacity-90 text-white px-8"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ...
                  </>
                ) : (
                  labels.submit
                )}
              </Button>
            </form>
            
            <p className="text-xs text-muted-foreground mt-4">
              {labels.privacy}
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}
