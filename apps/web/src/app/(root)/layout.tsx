import { Header } from '@/ui/header';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
}
