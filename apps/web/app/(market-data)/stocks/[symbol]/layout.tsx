interface StockDetailsPageProps {
  params: { symbol: string };
  children: React.ReactNode;
}

export default function SymbolLayout({
  params,
  children,
}: StockDetailsPageProps) {
  return <main className="container m-auto m-h-screen">{children}</main>;
}
