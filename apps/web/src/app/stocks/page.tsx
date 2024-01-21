import { Badge } from '@/components/ui/badge';
import api from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

async function getNews() {
  return await api
    .get('/api/v1/stocks/news?symbols=TSLA')
    .then((response) => response.data);
}

export default async function NewsPage() {
  const news = await getNews();
  return (
    <div className="w-full h-full py-10 overflow-scroll">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {news.map((item) => (
          <div
            key={item.id}
            className="flex flex-col items-start gap-2 p-3 text-sm text-left transition-all border rounded-lg"
          >
            <div className="flex flex-col w-full gap-1">
              <Link
                href={item.URL}
                target="_blank"
                className="font-semibold line-clamp-2 hover:underline"
              >
                {item.Headline}
              </Link>
              <div className="flex flex-row items-center gap-1">
                <div className="text-xs font-medium">{item.Source}</div>&#x2022;
                <div className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatDistanceToNow(new Date(item.UpdatedAt), {
                    addSuffix: true,
                  })}
                </div>
              </div>
            </div>
            <div className="text-xs line-clamp-2 text-muted-foreground">
              {item.Summary.substring(0, 300)}
            </div>
            {item.Symbols.length ? (
              <div className="flex flex-wrap items-center gap-2">
                {item.Symbols.map((symbol) => (
                  <Badge key={symbol} variant="outline">
                    {symbol}
                  </Badge>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
