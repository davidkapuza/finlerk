import { Icons } from '@finlerk/lucide-react-icons';
import { buttonVariants } from '@finlerk/shadcn-ui';
import Link from 'next/link';
import { siteConfig } from '../config/site';
import { Navigation } from './navbar';
import { ThemeToggle } from './theme-toggle';
import { NavMenu } from './nav-menu';

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b backdrop-blur-sm">
      <div className="container flex flex-row items-center h-16 m-auto">
        <Navigation items={siteConfig.navigation} />
        <div className="flex items-center justify-end flex-1 space-x-4">
          <nav className="flex items-center space-x-2">
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
            >
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
            <NavMenu />
          </nav>
        </div>
      </div>
    </header>
  );
}
