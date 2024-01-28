import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import api from '@/lib/api';
import { cn } from '@/lib/utils';
import { AlpacaNews } from '@alpacahq/alpaca-trade-api/dist/resources/datav2/entityv2';
import { formatDistanceToNow } from 'date-fns';
import { Dot } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment } from 'react';

const initialSymbols = ['TSLA', 'AAPL', 'NVDA', 'GOOG', 'NFLX', 'GOOGL'];

async function getNews() {
  return await api
    .get<AlpacaNews[]>('/api/v1/stocks/news', {
      params: {
        symbols: initialSymbols.join(','),
      },
    })
    .then((response) => response.data);
}

export default async function Index() {
  const news = await getNews();
  const { withImages, withoutImages } = news.reduce(
    (acc, n) => {
      if (n.Images.length > 0) {
        acc.withImages.push(n);
      } else acc.withoutImages.push(n);
      return acc;
    },
    { withImages: [], withoutImages: [] },
  );

  return (
    <div className="pb-10">
      <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-2">
        {withImages.map((n, idx) => {
          return (
            <Link
              key={n.ID}
              href={n.URL}
              target="_blank"
              className={cn(
                `hover:scale-105 flex cursor-pointer flex-col gap-5 ${
                  idx === 0 ? 'md:row-span-3' : 'md:flex-row'
                }`,
              )}
            >
              <div className="relative w-full h-full">
                <Image
                  loading="lazy"
                  src={n.Images[0].url}
                  alt={n.Headline}
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="object-cover w-full h-full transition-all rounded aspect-square"
                />
              </div>
              <div className="py-3 min-w-[65%]">
                <h1 className="font-semibold line-clamp-2">{n.Headline}</h1>
                <div className="flex flex-row items-center mb-3">
                  <div className="text-xs font-medium">{n.Source}</div>
                  <Dot />
                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(new Date(n.UpdatedAt), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
                <div
                  className="text-xs line-clamp-3 text-muted-foreground"
                  dangerouslySetInnerHTML={{
                    __html: n.Summary.substring(0, 300),
                  }}
                />
                {n.Symbols.length ? (
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    {n.Symbols.map((symbol) => (
                      <Badge key={symbol} variant="outline">
                        {symbol}
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </div>
            </Link>
          );
        })}
      </div>
      {withoutImages.map((n, idx) => {
        return (
          <Fragment key={n.ID}>
            <Separator />
            <Link
              href={n.URL}
              target="_blank"
              className="flex flex-col gap-5 my-5 cursor-pointer hover:scale-105"
            >
              <div className="py-3 min-w-[65%]">
                <h1 className="font-semibold line-clamp-2">{n.Headline}</h1>
                <div className="flex flex-row items-center mb-3">
                  <div className="text-xs font-medium">{n.Source}</div>
                  <Dot />
                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(new Date(n.UpdatedAt), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
                <div
                  className="text-xs line-clamp-3 text-muted-foreground"
                  dangerouslySetInnerHTML={{
                    __html: n.Summary.substring(0, 300),
                  }}
                />
                {n.Symbols.length ? (
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    {n.Symbols.map((symbol) => (
                      <Badge key={symbol} variant="outline">
                        {symbol}
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </div>
            </Link>
          </Fragment>
        );
      })}
    </div>
  );
}
