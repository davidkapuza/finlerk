'use client';

import { Icons } from '@qbick/lucide-react-icons';
import { Button, Input, Label } from '@qbick/shadcn-ui';
import { cn } from '@qbick/shadcn-ui/lib/utils';
import * as React from 'react';


interface RegistrationFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function RegistrationForm({
  className,
  ...props
}: RegistrationFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
            />
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              placeholder="password"
              type="password"
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect="off"
              disabled={isLoading}
            />
            <Label className="sr-only" htmlFor="repeat-password">
              Repeat password
            </Label>
            <Input
              id="repeat-password"
              placeholder="repeat password"
              type="password"
              autoCapitalize="none"
              autoComplete="repeat-password"
              autoCorrect="off"
              disabled={isLoading}
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
            )}
            Sign In with Email
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="px-2 bg-background text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button variant="outline" type="button" disabled={isLoading}>
        {isLoading ? (
          <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Icons.gitHub className="w-4 h-4 mr-2" />
        )}{' '}
        Github
      </Button>
    </div>
  );
}
