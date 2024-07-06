import { withSuspense } from '@/shared/lib/react';
import { SessionProvider } from './providers/session-provider';
import { ThemeProvider } from './providers/theme-provider';
import { Icons } from '@finlerk/lucide-react-icons';
import { Toaster, TooltipProvider } from '@finlerk/shadcn-ui';

type ProvidersProps = {
  children: React.ReactNode;
};

function Providers(props: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider delayDuration={0}>
        <Toaster />
        <SessionProvider>{props.children}</SessionProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}

export const Provider = withSuspense(Providers, {
  fallback: <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />,
});
