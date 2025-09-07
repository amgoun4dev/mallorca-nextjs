import Image from "next/image";

interface HotelHeroProps {
  backgroundImage?: string;
  overlayText: string;
}

export function HotelHero({ backgroundImage, overlayText }: HotelHeroProps) {
  const defaultImage = 'https://olrieidgokcnhhymksnf.supabase.co/storage/v1/object/public/general-images/mallorcamagic_fallback.jpg';

  return (
    <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={backgroundImage || defaultImage}
          alt={overlayText}
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
          unoptimized={backgroundImage?.includes('hotellook.com') ? true : false}
        />
      </div>
      <div className="absolute inset-0 bg-black/40" />
      
      <div className="relative z-10 text-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 capitalize tracking-wide">
          {overlayText}
        </h1>
      </div>
    </section>
  );
}
