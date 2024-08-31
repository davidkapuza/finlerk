import { MostActiveAssetsCarousel } from '@/widgets/most-active-assets';
import { Button } from '@finlerk/shadcn-ui';
import { Icons } from '@finlerk/lucide-react-icons';
import Link from 'next/link';
import { marketDataApi } from '@/entities/market-data';
import { ThemeToggle } from '@/shared/ui/theme-toggle';

export default async function Page() {
  const data = await marketDataApi.mostActiveStocksSnapshotsQuery();

  return (
    <>
      <header className="fixed top-0 z-40 w-full bg-none">
        <div className="container flex flex-row items-center justify-end h-24 px-8 m-auto">
          <ThemeToggle />
        </div>
      </header>
      <div className="flex flex-col min-h-screen">
        <main className="container flex flex-col items-center justify-center flex-1 min-h-screen gap-8 p-3 m-auto">
          <div className="px-5">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Stay ahead of the market with Finlerk.
            </h1>
            <p className="my-6 text-muted-foreground md:w-[70%]">
              Access real-time market data and breaking financial news all in
              one place. Whether you&apos;re tracking stocks, commodities, or
              global indices, get the insights you need to make confident
              decisions, anywhere, anytime.
            </p>
            <Button asChild className="mt-6">
              <Link href="/stocks">
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
    </>
  );
}
