'use client';

import Link from 'next/link';
import { siteConfig } from '../config/site';
import { NavItem } from '../types/nav';
import { cn } from '@finlerk/shadcn-ui/lib/utils';
import { useSelectedLayoutSegment } from 'next/navigation';

interface MainNavProps {
  items?: NavItem[];
}

export function Navigation({ items }: MainNavProps) {
  const segment = useSelectedLayoutSegment();
  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <span className="inline-block font-bold">{siteConfig.name}</span>
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
