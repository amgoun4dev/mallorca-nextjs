import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  Search, Filter, X, MapPin, Star, Euro, Bed, Users, Car, 
  Wifi, Utensils, Waves, Dumbbell, Coffee, Sparkles 
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export interface HotelFilters {
  search: string;
  location: string;
  stars: string;
  rating: number[];
  price: number[];
  amenities: string[];
  propertyType: string;
  sortBy: string;
}

interface HotelFiltersProps {
  filters: HotelFilters;
  onFiltersChange: (filters: HotelFilters) => void;
  onClearFilters: () => void;
  availableLocations: string[];
  className?: string;
}

const amenityOptions = [
  { value: "restaurant", label: "Restaurant", icon: Utensils },
  { value: "parking", label: "Parkplatz", icon: Car },
  { value: "pool", label: "Pool", icon: Waves },
  { value: "fitness", label: "Fitness", icon: Dumbbell },
  { value: "wi-fi in public areas", label: "WLAN", icon: Wifi },
  { value: "spa", label: "Spa", icon: Sparkles },
  { value: "bar", label: "Bar", icon: Coffee },
  { value: "air conditioning", label: "Klimaanlage", icon: Star },
];

const propertyTypes = [
  { value: "all", label: "Alle Arten" },
  { value: "1", label: "Hotel" },
  { value: "12", label: "Strandhaus" },
  { value: "boutique", label: "Boutique Hotel" },
  { value: "resort", label: "Resort" },
];

const sortOptions = [
  { value: "rating", label: "Bestbewertet" },
  { value: "price_low", label: "Preis: Niedrig bis Hoch" },
  { value: "price_high", label: "Preis: Hoch bis Niedrig" },
  { value: "stars", label: "Sterne-Bewertung" },
  { value: "newest", label: "Neueste zuerst" },
];

export function HotelFilters({ 
  filters, 
  onFiltersChange, 
  onClearFilters, 
  availableLocations,
  className = "" 
}: HotelFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (key: keyof HotelFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleAmenity = (amenity: string) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    updateFilter('amenities', newAmenities);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.location !== "all") count++;
    if (filters.stars !== "all") count++;
    if (filters.rating[0] > 0 || filters.rating[1] < 100) count++;
    if (filters.price[0] > 0 || filters.price[1] < 2000) count++;
    if (filters.amenities.length > 0) count++;
    if (filters.propertyType !== "all") count++;
    return count;
  };

  return (
    <Card className={`border-border/50 ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5" />
            Hotels filtern
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Zurücksetzen
            </Button>
            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {isExpanded ? "Weniger" : "Mehr"} Filter
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Basic Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Suchen</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Hotelname, Ort..."
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Ort</Label>
            <Select value={filters.location} onValueChange={(value) => updateFilter('location', value)}>
              <SelectTrigger>
                <MapPin className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Alle Orte" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Orte</SelectItem>
                {availableLocations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Stars */}
          <div className="space-y-2">
            <Label htmlFor="stars">Sterne-Bewertung</Label>
            <Select value={filters.stars} onValueChange={(value) => updateFilter('stars', value)}>
              <SelectTrigger>
                <Star className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Alle Bewertungen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Bewertungen</SelectItem>
                <SelectItem value="5">5 Sterne</SelectItem>
                <SelectItem value="4">4+ Sterne</SelectItem>
                <SelectItem value="3">3+ Sterne</SelectItem>
                <SelectItem value="2">2+ Sterne</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleContent className="space-y-6">
            {/* Advanced Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Rating Range */}
              <div className="space-y-3">
                <Label>Gästebewertung (0-100 Punkte)</Label>
                <div className="px-3">
                  <Slider
                    value={filters.rating}
                    onValueChange={(value) => updateFilter('rating', value)}
                    max={100}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>{filters.rating[0]}</span>
                    <span>{filters.rating[1]}</span>
                  </div>
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-3">
                <Label>Preisbereich (€ pro Nacht)</Label>
                <div className="px-3">
                  <Slider
                    value={filters.price}
                    onValueChange={(value) => updateFilter('price', value)}
                    max={2000}
                    min={0}
                    step={50}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>€{filters.price[0]}</span>
                    <span>€{filters.price[1]}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Property Type */}
            <div className="space-y-2">
              <Label>Unterkunftsart</Label>
              <Select value={filters.propertyType} onValueChange={(value) => updateFilter('propertyType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Alle Arten" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Amenities */}
            <div className="space-y-3">
              <Label>Ausstattung</Label>
              <div className="flex flex-wrap gap-2">
                {amenityOptions.map((amenity) => {
                  const IconComponent = amenity.icon;
                  const isSelected = filters.amenities.includes(amenity.value);
                  return (
                    <Button
                      key={amenity.value}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleAmenity(amenity.value)}
                      className="h-auto py-2 px-3"
                    >
                      <IconComponent className="h-4 w-4 mr-2" />
                      {amenity.label}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Sort By */}
            <div className="space-y-2">
              <Label>Sortieren nach</Label>
              <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sortieren nach..." />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
