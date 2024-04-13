import { Toaster, TooltipProvider } from '@qbick/shadcn-ui';
import { cn } from '@qbick/shadcn-ui/lib/utils';
import { Metadata } from 'next';
import { siteConfig } from '../config/site';
import { fontSans } from '../lib/fonts';
import { ThemeProvider } from '../lib/providers/theme-provider';
import '../styles/globals.css';

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
// TODO Trade getting most popular stocks preview
// async function getLatestTrades() {
//   return await api
//     .get<Map<string, AlpacaTrade>>('/api/v1/stocks/latest-trades')
//     .then((response) => response.data);
// }

export default async function RootLayout({ children }: RootLayoutProps) {
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
              {children}
            </TooltipProvider>
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
