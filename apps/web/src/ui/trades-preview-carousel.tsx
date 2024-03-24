'use client';

import { type AlpacaTrade } from '@alpacahq/alpaca-trade-api/dist/resources/datav2/entityv2';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@qbick/shadcn-ui';
import Autoplay from 'embla-carousel-autoplay';
import Link from 'next/link';

interface TradesPreviewCarouselProps {
  latestTrades: Map<string, AlpacaTrade>;
}

export default function TradesPreviewCarousel({
  latestTrades,
}: TradesPreviewCarouselProps) {
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
          const tradeData: AlpacaTrade = latestTrades[stock];

          return (
            <CarouselItem
              key={index}
              className="sm:basis-1/2 md:basis-1/3 lg:basis-1/5"
            >
              <Link
                href={`/stocks/${tradeData.Symbol}`}
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
