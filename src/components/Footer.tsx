import Link from "next/link";
import Image from "next/image";
import { MapPin, Mail, Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const footerSections = [
  {
    title: "Entdecken",
    links: [
      { name: "Guides", href: "/guide-instagram" },
      { name: "Aktivitäten", href: "/activities" },
      { name: "Events", href: "/events" },
      { name: "News", href: "/news" },
    ],
  },
  {
    title: "Unterkünfte",
    links: [
      { name: "Hotels", href: "/hotels" },
      { name: "Ferienwohnungen", href: "/holiday-rentals" },
      { name: "Immobilien", href: "/real-estate" },
    ],
  },
  {
    title: "Unternehmen",
    links: [
      { name: "Über uns", href: "/about" },
      { name: "Kontakt", href: "/contact" },
      { name: "Datenschutz", href: "/privacy" },
      { name: "Nutzungsbedingungen", href: "/terms" },
    ],
  },
];
const socialLinks = [
  { icon: Facebook, href: "https://facebook.com/mallorca.is.magic", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com/mallorcamagic", label: "Instagram" },
  { icon: Twitter, href: "https://twitter.com/mallorcamagic", label: "Twitter" },
  { icon: Youtube, href: "https://youtube.com/@mallorcamagic", label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="bg-gradient-subtle border-t">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-3 mb-4 group">
              <Image 
                src="/lovable-uploads/ba360617-1620-43d6-b46a-c6e32347b7ef.png" 
                alt="Mallorca Magic Logo" 
                width={150}
                height={40}
                className="h-10 w-auto transition-all duration-300 group-hover:scale-105" 
              />
            </Link>
            <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
              Ihr ultimativer Guide zur Entdeckung der Magie Mallorcas. Von versteckten Stränden
              bis hin zu Luxusimmobilien helfen wir Ihnen, das Beste zu erleben, was diese wunderschöne Insel zu bieten hat.
            </p>
            {/* Contact Info */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Palma, Mallorca, Spain</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground"></div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>info@mallorcamagic.es</span>
              </div>
            </div>
          </div>
          {/* Link Sections */}
          {footerSections.map(section => (
            <div key={section.title}>
              <h4 className="font-semibold mb-4 text-foreground">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map(link => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {/* Bottom Section */}
        <div className="border-t pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="text-sm text-muted-foreground">
            © 2024 Mallorca Magic. Alle Rechte vorbehalten.
          </div>
          {/* Social Links */}
          <div className="flex items-center space-x-4">
            {socialLinks.map(social => (
              <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors duration-200" aria-label={social.label}>
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
