import 'reflect-metadata';
import '../reflect-metadata-client-side';
import { Provider } from '@/app';
import { fontSans } from '@/shared/fonts';
import { cn } from '@finlerk/shadcn-ui/lib/utils';
import { Metadata } from 'next';
import { siteConfig } from '../src/shared/config/site';
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
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
