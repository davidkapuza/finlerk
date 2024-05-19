import { Separator } from '@finlerk/shadcn-ui';

interface StockDetailsPageProps {
  params: { symbol: string };
  children: React.ReactNode;
}

export default function SymbolLayout({
  params,
  children,
}: StockDetailsPageProps) {
  return (
    <main className="container m-auto m-h-screen">
      <div className="h-[52px]">{params.symbol}</div>
      <Separator />
      {children}
    </main>
  );
}
