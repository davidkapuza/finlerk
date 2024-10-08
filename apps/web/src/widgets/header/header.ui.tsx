import Link from 'next/link';
import { Navigation } from '../navigation';
import { siteConfig } from '@/shared/config/site';
import { buttonVariants } from '@finlerk/shadcn-ui';
import { Icons } from '@finlerk/lucide-react-icons';
import { ThemeToggle } from '@/shared/ui/theme-toggle';
import { UserMenu } from '@/entities/user';

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
            <UserMenu />
          </nav>
        </div>
      </div>
    </header>
  );
}
