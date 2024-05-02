import { Skeleton } from '@finlerk/shadcn-ui';

export default function Loading() {
  return (
    <div className="container min-h-screen p-3 m-auto">
      <h1 className="py-6 text-3xl font-bold">News</h1>
      <div className="grid gap-4 mb-4 md:grid-cols-2">
        {Array(20)
          .fill(null)
          .map((_, idx) => (
            <div key={idx} className="flex flex-row items-center gap-5 px-4">
              <div className="flex-1 py-3">
                <Skeleton className="w-full h-4 mb-3" />
                <Skeleton className="h-3 w-[50%] mb-1" />
                <Skeleton className="h-3 w-[40%] mb-1" />
              </div>
              <Skeleton className="h-24 rounded aspect-square" />
            </div>
          ))}
      </div>
    </div>
  );
}
