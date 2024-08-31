import { ThemeToggle } from '@/shared/ui/theme-toggle';
import { Button } from '@finlerk/shadcn-ui';
import { ChevronLeftIcon } from 'lucide-react';
import Link from 'next/link';
interface RootLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: RootLayoutProps) {
  return (
    <>
      <header className="fixed top-0 z-40 w-full bg-none">
        <div className="container flex flex-row items-center justify-between h-24 px-8 m-auto">
          <Button variant="ghost" asChild>
            <Link href="/">
              <ChevronLeftIcon className="w-4 h-4 me-3" />
              Back
            </Link>
          </Button>
          <ThemeToggle />
        </div>
      </header>
      {children}
    </>
  );
}
