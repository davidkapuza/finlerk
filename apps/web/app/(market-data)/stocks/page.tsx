import { AssetsTable } from '@/widgets/asset-table';

export default async function StocksPage() {
  return (
    <div className="container m-auto m-h-screen">
      <h1 className="py-6 text-3xl font-bold">Stocks</h1>
      <AssetsTable />
    </div>
  );
}
