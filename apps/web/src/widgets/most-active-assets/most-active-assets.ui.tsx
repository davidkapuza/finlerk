'use client';

import { marketDataQuery } from '@/entities/market-data';
import { cn } from '@/shared/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@finlerk/shadcn-ui';
import { MostActiveStocksSnapshotsResponseType } from '@finlerk/shared';
import Autoplay from 'embla-carousel-autoplay';
import Link from 'next/link';

type MostActiveAssetsCarouselProps = {
  initialData: MostActiveStocksSnapshotsResponseType;
};

export function MostActiveAssetsCarousel(props: MostActiveAssetsCarouselProps) {
  const { data } = marketDataQuery.useMostActiveStocksSnapshotsQuery({
    fallbackData: props.initialData,
  });

  if (!data) return null;

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
        {Object.entries(data).map(([stock, data]) => {
          const currentClose = data.dailyBar.c;
          const prevClose = data.prevDailyBar.c;
          const percentDiff = ((currentClose - prevClose) / prevClose) * 100;

          return (
            <CarouselItem
              key={stock}
              className="sm:basis-1/2 md:basis-1/3 lg:basis-1/5"
            >
              <Link
                href={`/stocks/${stock}`}
                className="flex flex-col items-start gap-2 p-3 text-sm text-left transition-all border rounded-lg hover:bg-accent"
              >
                {stock}
                <div>
                  <span className="text-2xl font-bold">
                    ${data?.dailyBar?.c}
                  </span>
                  <span
                    className={cn(
                      'ms-4',
                      percentDiff >= 0 ? 'text-green-500' : 'text-red-500',
                    )}
                  >
                    {percentDiff.toFixed(2)}%
                  </span>
                </div>
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
