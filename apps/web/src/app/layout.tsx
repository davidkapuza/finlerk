import { fontSans } from '@/lib/fonts';
import { SessionProivder, ThemeProvider } from '@/lib/providers';
import { Toaster, TooltipProvider } from '@finlerk/shadcn-ui';
import { cn } from '@finlerk/shadcn-ui/lib/utils';
import { Metadata } from 'next';
import { siteConfig } from '../lib/config/site';
import '../../reflect-metadata-client-side';
import './global.css';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TooltipProvider delayDuration={0}>
            <Toaster />
            <SessionProivder>{children}</SessionProivder>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
