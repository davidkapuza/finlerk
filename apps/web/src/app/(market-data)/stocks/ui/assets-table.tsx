'use client';
import { Icons } from '@finlerk/lucide-react-icons';
import {
  Button,
  Input,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@finlerk/shadcn-ui';
import { Asset } from '@finlerk/shared';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import React from 'react';
import useSWRInfinite from 'swr/infinite';
import Link from 'next/link';
import { marketDataApi } from '@/lib/api/market-data.api';

const PAGE_SIZE = 30;

const columns: ColumnDef<Asset>[] = [
  {
    accessorKey: 'symbol',
    header: 'Symbol',
    cell: ({ row }) => {
      const symbol: string = row.getValue('symbol');
      return (
        <Button asChild size="sm" variant="secondary">
          <Link href={`/stocks/${symbol}`}>{symbol}</Link>
        </Button>
      );
    },
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'exchange',
    header: 'Exchange',
  },
];

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value, onChange, debounce]);

  return (
    <Input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

export default function AssetsTable() {
  const bottom = React.useRef(null);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const { data, size, setSize, isLoading } = useSWRInfinite(
    (index) =>
      `/api/v1/market-data/assets?page=${
        index + 1
      }&limit=${PAGE_SIZE}&globalFilter=${globalFilter}`,
    marketDataApi.assetsFetcher,
    {
      revalidateOnFocus: false,
      revalidateFirstPage: false,
    },
  );

  const assets = React.useMemo(() => {
    if (isLoading) return Array(PAGE_SIZE).fill(30);
    return data ? [].concat(...data) : [];
  }, [data, isLoading]);

  const [isLoadingMore, isReachingEnd] = React.useMemo(() => {
    const isLoadingMore =
      isLoading || (size > 0 && data && typeof data[size - 1] === 'undefined');
    const isReachingEnd =
      data?.[0]?.length === 0 || (data && data.at(-1)?.length < PAGE_SIZE);

    return [isLoadingMore, isReachingEnd];
  }, [isLoading, size, data]);

  React.useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (
        entries[0].isIntersecting &&
        !isLoadingMore &&
        !isReachingEnd &&
        data
      ) {
        setSize((prev) => prev + 1);
      }
    });
    observer.observe(bottom.current);
    return () => observer.disconnect();
  }, [isLoadingMore, setSize, data, isReachingEnd]);

  const tableColumns = React.useMemo(
    () =>
      isLoading
        ? columns.map((column) => ({
            ...column,
            cell: () => <Skeleton className="w-full h-4" />,
          }))
        : columns,
    [isLoading],
  );

  const table = useReactTable({
    data: assets,
    columns: tableColumns,
    state: {
      globalFilter: globalFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualFiltering: true,
    enableGlobalFilter: true,
    rowCount: assets.length,
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <>
      <div className="flex items-center py-4">
        <DebouncedInput
          type="text"
          value={globalFilter}
          placeholder="Search..."
          onChange={table.setGlobalFilter}
          className="max-w-sm"
        />
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {isLoadingMore ? (
        <div className="inline-flex items-center justify-center w-full py-4">
          <Icons.spinner className="inline-block w-4 h-4 mr-2 animate-spin" />
          <span>Loading...</span>
        </div>
      ) : null}
      <div ref={bottom} className="mb-12" />
    </>
  );
}
