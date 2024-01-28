import { Metadata } from 'next';
import { cookies } from 'next/headers';
import ResizableLayout from './components/resizable-layout';

export const metadata: Metadata = {
  title: 'Examples',
  description: 'Check out some examples app built using the components.',
};

interface StocksLayoutProps {
  children: React.ReactNode;
}

export default async function StocksLayout({ children }: StocksLayoutProps) {
  const layout = cookies().get('react-resizable-panels:layout');

  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;

  return (
    <div className="flex flex-col gap-5">
      <ResizableLayout defaultLayout={defaultLayout} navCollapsedSize={4}>
        {children}
      </ResizableLayout>
    </div>
  );
}
