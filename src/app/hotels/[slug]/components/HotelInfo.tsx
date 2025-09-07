import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

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
  const infoItems = [
    { label: 'Check-in', value: checkIn || '14:00' },
    { label: 'Check-out', value: checkOut || '11:00' },
    { label: 'Objekttyp', value: propertyType },
    { label: 'Eröffnet', value: yearOpened },
    { label: 'Renoviert', value: yearRenovated },
    { label: 'Zimmer', value: cntRooms },
    { label: 'Suiten', value: cntSuites },
    { label: 'Etagen', value: cntFloors },
  ].filter(item => item.value);

  if (infoItems.length === 0) {
    return null;
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          Hotelinformationen
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {infoItems.map((item, index) => (
            <div key={index} className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-sm text-muted-foreground">{item.label}</div>
              <div className="font-semibold">{item.value}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
