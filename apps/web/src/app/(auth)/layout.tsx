import { ThemeToggle } from '@/shared/ui/theme-toggle';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: RootLayoutProps) {
  return (
    <>
      <header className="fixed top-0 z-40 w-full bg-none">
        <div className="container flex flex-row items-center justify-end h-24 px-8 m-auto">
          <ThemeToggle />
        </div>
      </header>
      {children}
    </>
  );
}
