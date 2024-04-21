'use client';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  Separator,
} from '@qbick/shadcn-ui';
import { cn } from '@qbick/shadcn-ui/lib/utils';
import { BarChart3 } from 'lucide-react';
import * as React from 'react';
import { Nav } from './nav';

interface ResizableLayoutProps {
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
  children: React.ReactNode;
}

export default function ResizableLayout({
  defaultLayout = [96, 4],
  defaultCollapsed = false,
  navCollapsedSize,
  children,
}: ResizableLayoutProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  return (
    <div className="rounded-[0.5rem] border bg-background shadow-md md:shadow-xl">
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes,
          )}`;
        }}
        className="h-full max-h-[800px] items-stretch"
      >
        <ResizablePanel defaultSize={defaultLayout[0]}>
          {children}
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          defaultSize={defaultLayout[1]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={15}
          maxSize={20}
          onCollapse={(collapsed) => {
            setIsCollapsed(collapsed);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              collapsed,
            )}`;
          }}
          className={cn(
            isCollapsed &&
              'min-w-[50px] transition-all duration-300 ease-in-out',
          )}
        >
          <div className="h-[52px]"></div>
          <Separator />
          <Nav
            isCollapsed={isCollapsed}
            links={[
              {
                title: 'Chart',
                icon: BarChart3,
                variant: 'default',
                href: '/',
              },
            ]}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
