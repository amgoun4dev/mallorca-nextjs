"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Globe, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SearchModal } from "@/components/ui/search-modal";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Startseite", href: "/" },
  { name: "News", href: "/news" },
  { name: "Guides", href: "/guide-instagram" },
  { name: "Aktivitäten", href: "/activities" },
];
const languages = [
  { code: "en", name: "English", flag: "🇬🇧", url: "https://www.mallorca-magic.com" },
  { code: "de", name: "Deutsch", flag: "🇩🇪", url: "https://www.mallorcamagic.de" },
  { code: "es", name: "Español", flag: "🇪🇸", url: "https://www.mallorcamagic.es" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <Image 
            src="/lovable-uploads/ba360617-1620-43d6-b46a-c6e32347b7ef.png" 
            alt="Mallorca Magic Logo" 
            width={120}
            height={32}
            className="h-8 w-auto transition-all duration-300 group-hover:scale-105" 
          />
        </Link>
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navigation.filter(item => !(item.href === "/" && pathname === "/")).map(item => (
            <Link 
              key={item.name} 
              href={item.href} 
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 relative group",
                isActive(item.href) 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {item.name}
              {isActive(item.href) && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-primary rounded-full"></div>
              )}
            </Link>
          ))}
        </nav>
        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={() => setIsSearchOpen(true)}
            {...(isClient && { "aria-label": "Suche öffnen" })}
          >
            <Search className="h-4 w-4" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0"
                {...(isClient && { "aria-label": "Sprache wählen" })}
              >
                <Globe className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {languages.map(lang => (
                <DropdownMenuItem key={lang.code} asChild>
                  <a 
                    href={lang.url} 
                    className="flex items-center space-x-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </a>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="lg:hidden h-8 w-8 p-0" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          {...(isClient && { "aria-label": "Navigation Menü" })}
        >
          {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden border-t bg-background">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {navigation.filter(item => !(item.href === "/" && pathname === "/")).map(item => (
              <Link 
                key={item.name} 
                href={item.href} 
                className={cn(
                  "block px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive(item.href) 
                    ? "text-primary bg-primary/10" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-2 border-t flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0" 
                  onClick={() => setIsSearchOpen(true)}
                  {...(isClient && { "aria-label": "Suche öffnen" })}
                >
                  <Search className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0" 
                      {...(isClient && { "aria-label": "Sprache wählen" })}
                    >
                      <Globe className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    {languages.map(lang => (
                      <DropdownMenuItem key={lang.code} asChild>
                        <a 
                          href={lang.url} 
                          className="flex items-center space-x-2"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span>{lang.flag}</span>
                          <span>{lang.name}</span>
                        </a>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <SearchModal open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </header>
  );
}
