'use client';

import { buttonVariants } from '@finlerk/shadcn-ui';
import { cn } from '@finlerk/shadcn-ui/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface ProfileSidebarProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
  }[];
}

export function ProfileSidebar({
  className,
  items,
  ...props
}: ProfileSidebarProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        'flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1',
        className,
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            pathname === item.href
              ? 'bg-muted hover:bg-muted'
              : 'hover:bg-transparent hover:underline',
            'justify-start',
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
