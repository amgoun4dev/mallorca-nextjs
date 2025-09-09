"use client";
import { useEffect } from 'react';
import { Card, CardContent } from '../ui/card';

export function CarRentalWidget() {
  useEffect(() => {
    // Create script element
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://tpwdgt.com/content?trs=172688&shmarker=365883&locale=de&default_pick_up_location=PMI&powered_by=false&border_radius=5&plain=false&show_logo=false&color_background=%233176BC&color_button=%234EBBB8&promo_id=4578&campaign_id=130';
    script.charset = 'utf-8';

    // Find the widget container and append script
    const widgetContainer = document.getElementById('car-rental-widget');
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
          Mietwagen buchen
        </h3>
        <div id="car-rental-widget"></div>
      </CardContent>
    </Card>
  );
}
