import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building } from "lucide-react";

export default function HotelNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <Building className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
        
        <h1 className="text-4xl font-bold mb-4">Hotel nicht gefunden</h1>
        
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Das gesuchte Hotel konnte nicht gefunden werden. Es könnte sein, dass die URL falsch ist 
          oder das Hotel nicht mehr verfügbar ist.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline">
            <Link href="/hotels">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zurück zu Hotels
            </Link>
          </Button>
          
          <Button asChild>
            <Link href="/">
              Zur Startseite
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
