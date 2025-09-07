"use client";
import { useEffect, useRef } from "react";

interface Hotel {
  id: string;
  hotelid?: number | string | null;
}

interface HotelBookingWidgetProps {
  hotel: Hotel;
  language: "en" | "de" | "es";
  title?: string;
}

export function HotelBookingWidget({ hotel, language, title }: HotelBookingWidgetProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Widget nur laden, wenn eine hotelid vorhanden ist
    if (!hotel?.hotelid) {
      container.innerHTML = "";
      const fallback = document.createElement("div");
      fallback.className = "p-6 text-sm text-muted-foreground";
      fallback.textContent =
        language === "de"
          ? "Buchungs-Widget derzeit nicht verfügbar."
          : language === "es"
          ? "El widget de reserva no está disponible por el momento."
          : "Booking widget currently unavailable.";
      container.appendChild(fallback);
      return;
    }

    // Container säubern, damit beim Sprach-/Hotelwechsel nichts doppelt wird
    container.innerHTML = "";

    const params = new URLSearchParams({
      currency: "eur",
      trs: "172688",
      shmarker: "365883",
      host: "hotel.mallorca-magic.com",
      locale: language,
      hotel_id: String(hotel.hotelid),
      nobooking: "",
      powered_by: "false",
      width: "940",
      primary: "#3176BC",
      special: "#4EBBB8",
      promo_id: "4063",
      campaign_id: "101",
    });

    const script = document.createElement("script");
    script.async = true;
    script.charset = "utf-8";
    script.src = `https://tpwdgt.com/content?${params.toString()}`;
    container.appendChild(script);

    // Cleanup beim Unmount/Wechsel
    return () => {
      container.innerHTML = "";
    };
  }, [hotel?.hotelid, language]);

  return (
    <section className="w-full">
      <div className="container mx-auto px-4 py-8">
        {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
        {/* Widget-Container */}
        <div ref={containerRef} className="w-full overflow-x-auto" />
      </div>
    </section>
  );
}
