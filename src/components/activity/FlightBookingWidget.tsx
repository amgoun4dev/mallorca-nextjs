"use client";
import { useEffect } from 'react';
import { Card, CardContent } from '../ui/card';

export function FlightBookingWidget() {
  useEffect(() => {
    // Create script element
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://tpwdgt.com/content?currency=eur&trs=172688&shmarker=365883&combine_promos=101_7873&show_hotels=true&powered_by=false&locale=de&searchUrl=hotel.mallorca-magic.com%2Fflights&primary_override=%233176BC&color_button=%234EBBB8&color_icons=%233176BC&dark=%23262626&light=%23FFFFFF&secondary=%23FFFFFF&special=%23C4C4C4&color_focused=%233176BC&border_radius=5&plain=true&origin=MUC&destination=PMI&promo_id=7879&campaign_id=100';
    script.charset = 'utf-8';

    // Find the widget container and append script
    const widgetContainer = document.getElementById('flight-booking-widget');
    if (widgetContainer) {
      widgetContainer.appendChild(script);
    }

    // Cleanup function to remove script when component unmounts
    return () => {
      if (widgetContainer && script.parentNode) {
        widgetContainer.removeChild(script);
      }
    };
  }, []);

  return (
    <Card className="shadow-soft">
      <CardContent className="p-6">
        <h3 className="font-semibold mb-4 text-center">
          Buche deinen Flug
        </h3>
        <div id="flight-booking-widget"></div>
      </CardContent>
    </Card>
  );
}
