import { Icons } from '@qbick/lucide-react-icons';
import { buttonVariants } from '@qbick/shadcn-ui';
import Link from 'next/link';
import { siteConfig } from '../config/site';
import Navbar from './navbar';
import { ThemeToggle } from './theme-toggle';
import { UserNav } from './user-nav';

export function Header() {
  return (
    <header className="sticky top-0 z-40 flex flex-row w-full h-16 px-4 border-b bg-background">
      <Navbar items={siteConfig.mainNav} />
      <div className="flex items-center justify-end flex-1 space-x-4">
        <nav className="flex items-center space-x-2">
          <Link href={siteConfig.links.github} target="_blank" rel="noreferrer">
            <div
              className={buttonVariants({
                size: 'icon',
                variant: 'ghost',
              })}
            >
              <Icons.gitHub className="w-5 h-5" />
              <span className="sr-only">GitHub</span>
            </div>
          </Link>
          <ThemeToggle />
          <UserNav />
        </nav>
      </div>
    </header>
  );
}
