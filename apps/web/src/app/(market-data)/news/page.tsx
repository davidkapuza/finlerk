import { Badge } from '@qbick/shadcn-ui';
import { formatDistanceToNow } from 'date-fns';
import { Dot } from 'lucide-react';
import Image from 'next/image';
import { marketDataApi } from '../api/market-data.api';

export default async function NewsPage() {
  const newsData = await marketDataApi.getNews();

  return (
    <div className="container min-h-screen p-3 m-auto">
      <h1 className="py-6 text-3xl font-bold">News</h1>
      <div className="grid gap-4 mb-4 md:grid-cols-2">
        {newsData.news.map((n, idx) => (
          <a
            key={n.id}
            href={n.url}
            target="_blank"
            className="overflow-hidden cursor-pointer rounded-xl"
          >
            <div className="flex flex-row items-center gap-5 px-4 hover:scale-105">
              <div className="py-3">
                <h2 className="font-semibold line-clamp-2">{n.headline}</h2>
                <div className="flex flex-row items-center mb-3">
                  <div className="text-xs font-medium">{n.source}</div>
                  <Dot />
                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(new Date(n.updated_at), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
                <div
                  className="text-xs line-clamp-3 text-muted-foreground"
                  dangerouslySetInnerHTML={{
                    __html: n.summary.substring(0, 300),
                  }}
                />
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  {n.symbols.map((symbol) => (
                    <Badge key={symbol} variant="outline">
                      {symbol}
                    </Badge>
                  ))}
                </div>
              </div>
              <Image
                src={n.images[0].url}
                alt={n.headline}
                width={200}
                height={200}
                className="object-cover transition-all rounded max-h-24 aspect-square"
              />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
