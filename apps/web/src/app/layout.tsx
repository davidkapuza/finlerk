import { type AlpacaTrade } from '@alpacahq/alpaca-trade-api/dist/resources/datav2/entityv2';
import { Toaster, TooltipProvider } from '@qbick/shadcn-ui';
import { cn } from '@qbick/shadcn-ui/lib/utils';
import { Metadata } from 'next';
import { siteConfig } from '../config/site';
import api from '../lib/api';
import { fontSans } from '../lib/fonts';
import { ThemeProvider } from '../lib/providers/theme-provider';
import '../styles/globals.css';
import { Header } from '../ui/header';
import TradesPreviewCarousel from '../ui/trades-preview-carousel';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

async function getLatestTrades() {
  return await api
    .get<Map<string, AlpacaTrade>>('/api/v1/stocks/latest-trades')
    .then((response) => response.data);
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const latestTrades = await getLatestTrades();

  return (
    <>
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
              <div className="relative flex flex-col min-h-screen bg-background">
                <Header />
                <main className="container px-20">
                  <TradesPreviewCarousel latestTrades={latestTrades} />
                  {children}
                </main>
              </div>
            </TooltipProvider>
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
