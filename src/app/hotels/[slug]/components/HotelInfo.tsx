import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Calendar, Users, Layers } from "lucide-react";

interface HotelInfoProps {
  checkIn?: string;
  checkOut?: string;
  propertyType?: string;
  yearOpened?: number;
  yearRenovated?: number;
  cntRooms?: number;
  cntSuites?: number;
  cntFloors?: number;
}

export function HotelInfo({
  checkIn,
  checkOut,
  propertyType,
  yearOpened,
  yearRenovated,
  cntRooms,
  cntSuites,
  cntFloors
}: HotelInfoProps) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Hotel-Informationen
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {checkIn && (
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground mb-1">Check-in</span>
              <Badge variant="outline">{checkIn}</Badge>
            </div>
          )}
          
          {checkOut && (
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground mb-1">Check-out</span>
              <Badge variant="outline">{checkOut}</Badge>
            </div>
          )}
          
          {propertyType && (
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground mb-1">Typ</span>
              <Badge variant="secondary">{propertyType}</Badge>
            </div>
          )}
          
          {yearOpened && (
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground mb-1">Eröffnet</span>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{yearOpened}</span>
              </div>
            </div>
          )}
          
          {yearRenovated && (
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground mb-1">Renoviert</span>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{yearRenovated}</span>
              </div>
            </div>
          )}
          
          {cntRooms && (
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground mb-1">Zimmer</span>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{cntRooms}</span>
              </div>
            </div>
          )}
          
          {cntSuites && (
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground mb-1">Suiten</span>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{cntSuites}</span>
              </div>
            </div>
          )}
          
          {cntFloors && (
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground mb-1">Etagen</span>
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                <span>{cntFloors}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
