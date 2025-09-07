"use client";
import { MapPin, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Lottie from "lottie-react";
import emailSentAnimation from "@/assets/email-sent-animation.json";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ValidationError {
  field: string;
  message: string;
}

const ContactClient = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Handle success animation
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const validateContactForm = (data: ContactFormData): ValidationError[] => {
    const errors: ValidationError[] = [];
    
    if (!data.name.trim()) {
      errors.push({ field: 'name', message: 'Name ist erforderlich' });
    }
    
    if (!data.email.trim()) {
      errors.push({ field: 'email', message: 'E-Mail ist erforderlich' });
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.push({ field: 'email', message: 'Ungültige E-Mail-Adresse' });
    }
    
    if (!data.subject.trim()) {
      errors.push({ field: 'subject', message: 'Betreff ist erforderlich' });
    }
    
    if (!data.message.trim()) {
      errors.push({ field: 'message', message: 'Nachricht ist erforderlich' });
    }
    
    return errors;
  };

  const sanitizeInput = (input: string): string => {
    return input.trim().replace(/<[^>]*>?/gm, '');
  };

  const getFieldError = (fieldName: string) => {
    return errors.find(error => error.field === fieldName)?.message;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setErrors([]);
    
    // Sanitize inputs
    const sanitizedData: ContactFormData = {
      name: sanitizeInput(formData.name),
      email: sanitizeInput(formData.email),
      subject: sanitizeInput(formData.subject),
      message: sanitizeInput(formData.message)
    };
    
    // Validate form
    const validationErrors = validateContactForm(sanitizedData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      toast({
        title: "Validierungsfehler",
        description: "Bitte überprüfen Sie Ihre Eingaben.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('🚀 Starting form submission via Edge Function');
      
      // Try Edge Function first, fallback to local API if it fails
      let response;
      try {
        console.log('🚀 Trying Edge Function first...');
        response = await fetch(`https://olrieidgokcnhhymksnf.supabase.co/functions/v1/submit-contact-form`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9scmllaWRnb2tjbmhoeW1rc25mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4MTc0MjcsImV4cCI6MjA2ODM5MzQyN30.PXgv8zg4VQhTfXWKiawVz5_jWLzfl5BG1e-SDSd0IpQ`,
          },
          body: JSON.stringify(sanitizedData),
        });
        
        // If Edge Function returns non-2xx status, use fallback
        if (!response.ok) {
          throw new Error(`Edge Function failed with status ${response.status}`);
        }
      } catch (edgeError) {
        console.log('⚠️ Edge Function failed, using fallback API:', edgeError);
        response = await fetch('/api/contact-fallback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(sanitizedData),
        });
      }

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      const responseText = await response.text();
      console.log('Raw response text:', responseText);
      
      let result;
      try {
        result = JSON.parse(responseText);
        console.log('📧 Edge Function response:', result);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Response was not valid JSON:', responseText);
        throw new Error(`Server returned invalid response: ${responseText.substring(0, 100)}`);
      }

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Unbekannter Fehler');
      }

      // Success!
      console.log('✅ SUCCESS! Inquiry ID:', result.inquiryId);
      
      // Trigger success animation
      setShowSuccess(true);
      
      toast({
        title: "🎉 Nachricht erfolgreich gesendet!",
        description: `Ihre Nachricht wurde gespeichert und an Vbout weitergeleitet. Referenz-ID: ${result.inquiryId?.slice(0,8)}`,
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      
    } catch (error: any) {
      console.error('Form submission error:', error);
      
      toast({
        title: "Fehler beim Senden",
        description: `Fehler: ${error?.message || 'Unbekannter Fehler'}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field-specific error when user starts typing
    if (errors.some(error => error.field === name)) {
      setErrors(prev => prev.filter(error => error.field !== name));
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "E-Mail",
      content: "info@mallorcamagic.es",
      description: "Schreiben Sie uns jederzeit"
    },
    {
      icon: MapPin,
      title: "Adresse",
      content: "Palma, Mallorca, Spain",
      description: "Besuchen Sie uns vor Ort"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Kontakt
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Haben Sie Fragen zu Mallorca oder benötigen Sie persönliche Empfehlungen? 
            Wir sind hier, um Ihnen zu helfen!
          </p>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 xl:gap-20">
            {/* Contact Information */}
            <div className="lg:pr-8">
              <h2 className="font-display text-3xl font-bold mb-8 text-foreground">
                Nehmen Sie Kontakt auf
              </h2>
              
              <div className="space-y-6 mb-8">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <info.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">{info.title}</h3>
                      <p className="text-foreground font-medium">{info.content}</p>
                      <p className="text-muted-foreground text-sm">{info.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Card className="bg-gradient-subtle border-0">
                <CardHeader>
                  <CardTitle className="text-xl">Warum uns kontaktieren?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm">Persönliche Reiseberatung</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm">Maßgeschneiderte Empfehlungen</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm">Lokale Insider-Tipps</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm">Unterstützung bei der Reiseplanung</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">Schreiben Sie uns</CardTitle>
                  <p className="text-muted-foreground">
                    Wir antworten normalerweise innerhalb von 24 Stunden
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2">
                          Name *
                        </label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Ihr Name"
                          className={getFieldError('name') ? 'border-red-500' : ''}
                        />
                        {getFieldError('name') && (
                          <p className="text-red-500 text-sm mt-1">{getFieldError('name')}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                          E-Mail *
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="ihre@email.com"
                          className={getFieldError('email') ? 'border-red-500' : ''}
                        />
                        {getFieldError('email') && (
                          <p className="text-red-500 text-sm mt-1">{getFieldError('email')}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-2">
                        Betreff *
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Worum geht es?"
                        className={getFieldError('subject') ? 'border-red-500' : ''}
                      />
                      {getFieldError('subject') && (
                        <p className="text-red-500 text-sm mt-1">{getFieldError('subject')}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
                        Nachricht *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Teilen Sie uns mit, wie wir Ihnen helfen können..."
                        className={getFieldError('message') ? 'border-red-500' : ''}
                      />
                      {getFieldError('message') && (
                        <p className="text-red-500 text-sm mt-1">{getFieldError('message')}</p>
                      )}
                    </div>
                    
                    <Button type="submit" className="w-full bg-gradient-primary" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Wird gesendet...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Nachricht senden
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Success Animation Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 text-center max-w-sm mx-4">
            <Lottie
              animationData={emailSentAnimation}
              style={{ width: 120, height: 120, margin: '0 auto' }}
              loop={false}
            />
            <h3 className="text-xl font-bold text-foreground mt-4 mb-2">
              Nachricht gesendet! 🎉
            </h3>
            <p className="text-muted-foreground">
              Wir werden uns bald bei Ihnen melden.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactClient;
