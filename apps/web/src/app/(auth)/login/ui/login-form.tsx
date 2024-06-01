'use client';
import { Icons } from '@finlerk/lucide-react-icons';
import { Button } from '@finlerk/shadcn-ui';
import { signIn } from 'next-auth/react';
import React from 'react';

const providers = [
  {
    provider: 'google',
    title: 'Google',
    icon: <Icons.google className="w-4 h-4 mr-2" />,
  },
  {
    provider: 'github',
    title: 'Github',
    icon: <Icons.gitHub className="w-4 h-4 mr-2" />,
  },
];

export function LoginForm() {
  const handleLogin = (provider: string) => () => {
    signIn(provider);
  };

  return (
    <div className="flex flex-col gap-4">
      {providers.map(({ provider, icon, title }) => (
        <Button
          key={provider}
          variant="outline"
          type="button"
          className="flex-1"
          onClick={handleLogin(provider)}
        >
          {icon}
          {title}
        </Button>
      ))}
    </div>
  );
}
