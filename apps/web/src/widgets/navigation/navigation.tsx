'use client';

import Link from 'next/link';
import { NavItem } from '../../shared/types/nav';
import { useSelectedLayoutSegment } from 'next/navigation';
import { cn } from '@/shared/utils';
import { TrendingUp } from 'lucide-react';

interface NavigationProps {
  items?: NavItem[];
}

export function Navigation({ items }: NavigationProps) {
  const segment = useSelectedLayoutSegment();

  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <TrendingUp className="w-6 h-6" />
      </Link>
      {items?.length ? (
        <nav className="flex gap-6">
          {items?.map((item, index) => (
            <Link
              key={index}
              href={item.disabled ? '#' : item.href}
              className={cn(
                'flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm',
                item.href.startsWith(`/${segment}`)
                  ? 'text-foreground'
                  : 'text-foreground/60',
                item.disabled && 'cursor-not-allowed opacity-80',
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      ) : null}
    </div>
  );
}
