"use client";
import { useState } from "react";
import Link from "next/link";
import { Calendar, MapPin, Clock, Euro, Users, Filter, Search, ArrowRight } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";

interface Event {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  startDate: string;
  endDate: string;
  startTime: string;
  venue: string;
  location: string;
  priceFrom: number;
  priceTo: number;
  capacity: number;
  isRecurring: boolean;
  featured: boolean;
}

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDate, setSelectedDate] = useState("all");

  const events: Event[] = [
    {
      id: 1,
      title: "Mallorca Classical Music Festival",
      description: "Experience world-class classical performances in historic venues across the island.",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop",
      category: "Music",
      startDate: "2024-08-15",
      endDate: "2024-08-20",
      startTime: "20:00",
      venue: "Palma Cathedral",
      location: "Palma",
      priceFrom: 45,
      priceTo: 120,
      capacity: 500,
      isRecurring: false,
      featured: true
    },
    {
      id: 2,
      title: "Traditional Folk Festival",
      description: "Celebrate Mallorcan culture with traditional music, dance, and local cuisine.",
      image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&h=400&fit=crop",
      category: "Culture",
      startDate: "2024-07-25",
      endDate: "2024-07-27",
      startTime: "18:00",
      venue: "Plaza Mayor",
      location: "Pollença",
      priceFrom: 0,
      priceTo: 0,
      capacity: 1000,
      isRecurring: true,
      featured: true
    },
    {
      id: 3,
      title: "Sunset Beach Party",
      description: "Dance the night away at our exclusive beach party with DJs and cocktails.",
      image: "https://images.unsplash.com/photo-1571266028243-e68f8570c9e2?w=600&h=400&fit=crop",
      category: "Party",
      startDate: "2024-08-10",
      endDate: "2024-08-10",
      startTime: "19:00",
      venue: "Playa de Muro",
      location: "Playa de Muro",
      priceFrom: 25,
      priceTo: 25,
      capacity: 300,
      isRecurring: false,
      featured: false
    },
    {
      id: 4,
      title: "Wine Tasting Experience",
      description: "Discover the finest Mallorcan wines with expert sommeliers and local producers.",
      image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=600&h=400&fit=crop",
      category: "Food & Wine",
      startDate: "2024-09-05",
      endDate: "2024-09-05",
      startTime: "17:00",
      venue: "Bodega Ribas",
      location: "Consell",
      priceFrom: 35,
      priceTo: 35,
      capacity: 50,
      isRecurring: false,
      featured: false
    },
    {
      id: 5,
      title: "Art Exhibition Opening",
      description: "Contemporary art from local and international artists in a stunning gallery setting.",
      image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=400&fit=crop",
      category: "Art",
      startDate: "2024-08-30",
      endDate: "2024-08-30",
      startTime: "19:30",
      venue: "Es Baluard Museum",
      location: "Palma",
      priceFrom: 15,
      priceTo: 15,
      capacity: 200,
      isRecurring: false,
      featured: false
    },
    {
      id: 6,
      title: "Hiking Adventure",
      description: "Explore the beautiful Tramuntana mountains with experienced guides.",
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=400&fit=crop",
      category: "Adventure",
      startDate: "2024-09-15",
      endDate: "2024-09-15",
      startTime: "08:00",
      venue: "Serra de Tramuntana",
      location: "Valldemossa",
      priceFrom: 40,
      priceTo: 40,
      capacity: 25,
      isRecurring: false,
      featured: false
    }
  ];

  const categories = ["all", "Music", "Culture", "Party", "Food & Wine", "Art", "Adventure"];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory;
    
    const matchesDate = selectedDate === "all" || 
                       (selectedDate === "this-week" && isThisWeek(event.startDate)) ||
                       (selectedDate === "this-month" && isThisMonth(event.startDate)) ||
                       (selectedDate === "next-month" && isNextMonth(event.startDate));
    
    return matchesSearch && matchesCategory && matchesDate;
  });

  const isThisWeek = (dateString: string) => {
    const eventDate = new Date(dateString);
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    const weekEnd = new Date(now.setDate(now.getDate() - now.getDay() + 6));
    return eventDate >= weekStart && eventDate <= weekEnd;
  };

  const isThisMonth = (dateString: string) => {
    const eventDate = new Date(dateString);
    const now = new Date();
    return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
  };

  const isNextMonth = (dateString: string) => {
    const eventDate = new Date(dateString);
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const nextMonthEnd = new Date(now.getFullYear(), now.getMonth() + 2, 0);
    return eventDate >= nextMonth && eventDate <= nextMonthEnd;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (priceFrom: number, priceTo: number) => {
    if (priceFrom === 0 && priceTo === 0) {
      return "Free";
    }
    if (priceFrom === priceTo) {
      return `€${priceFrom}`;
    }
    return `€${priceFrom} - €${priceTo}`;
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-primary text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20"></div>
        
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
            Events Mallorca
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
            Discover the best events, festivals, and experiences on the island
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search events, venues, or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg bg-white/95 backdrop-blur border-0 rounded-full shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-gray-700">Filters:</span>
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedDate} onValueChange={setSelectedDate}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Dates" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="next-month">Next Month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-gray-600">
              {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => (
                <Card key={event.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    {event.featured && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-accent text-accent-foreground font-semibold">
                          Featured
                        </Badge>
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/90 text-gray-900 font-semibold">
                        {formatPrice(event.priceFrom, event.priceTo)}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <Badge className="bg-primary text-primary-foreground font-semibold">
                        {event.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="font-display text-xl font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {event.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {event.description}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 text-primary" />
                        <span>{formatDate(event.startDate)}</span>
                        {event.startDate !== event.endDate && (
                          <span className="ml-1">- {formatDate(event.endDate)}</span>
                        )}
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2 text-primary" />
                        <span>{event.startTime}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-primary" />
                        <span>{event.venue}, {event.location}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-2 text-primary" />
                        <span>Up to {event.capacity} people</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Euro className="h-4 w-4 text-primary mr-1" />
                        <span className="text-sm font-medium text-primary">
                          {formatPrice(event.priceFrom, event.priceTo)}
                        </span>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/events/${event.id}`}>
                          View Details
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-2xl font-semibold mb-4">No events found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search criteria or filters to find more events.
              </p>
              <Button onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedDate("all");
              }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        
        <div className="relative container mx-auto px-4 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Hosting an Event?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            List your event on Mallorca Magic and reach thousands of visitors and locals looking for amazing experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              asChild
              className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-3 text-lg shadow-glow"
            >
              <Link href="/submit-event">
                Submit Your Event
                <Calendar className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              asChild
              className="border-white text-white hover:bg-white hover:text-primary font-semibold px-8 py-3 text-lg backdrop-blur"
            >
              <Link href="/contact">
                Get Help
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
