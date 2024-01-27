'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import Link from 'next/link';

export default function TradesPreviewCarousel({ latestTrades }) {
  return (
    <Carousel
      opts={{
        align: 'start',
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 2000,
        }),
      ]}
      className="w-full py-8"
    >
      <CarouselContent>
        {Object.keys(latestTrades).map((stock, index) => {
          const tradeData = latestTrades[stock];
          console.log(tradeData);
          return (
            <CarouselItem
              key={index}
              className="sm:basis-1/2 md:basis-1/3 lg:basis-1/5"
            >
              <Link
                href="#"
                className="flex flex-col items-start gap-2 p-3 text-sm text-left transition-all border rounded-lg hover:bg-accent"
              >
                {tradeData.Symbol}
                <div className="text-2xl font-bold">${tradeData.Price}</div>
              </Link>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
