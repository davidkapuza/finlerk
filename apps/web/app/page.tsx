import { MostActiveAssetsCarousel } from '@/widgets/most-active-assets';
import { Button } from '@finlerk/shadcn-ui';
import { Icons } from '@finlerk/lucide-react-icons';
import Link from 'next/link';
import { marketDataApi } from '@/entities/market-data';

export default async function Page() {
  const data = await marketDataApi.mostActiveStocksSnapshotsQuery();

  return (
    <div className="flex flex-col min-h-screen">
      <main className="container flex flex-col items-center justify-center flex-1 min-h-screen gap-8 p-3 m-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
            Stay ahead of the market with Finlerk.
          </h1>
          <p className="my-6 text-muted-foreground">
            Real-time market insights at your fingertips.
          </p>
          <Button asChild>
            <Link href="/news">
              Get Started
              <Icons.chevronRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
        <div className="w-full p-12">
          <MostActiveAssetsCarousel initialData={data} />
        </div>
      </main>
    </div>
  );
}
