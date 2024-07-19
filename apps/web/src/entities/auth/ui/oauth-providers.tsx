'use client';
import { Icons } from '@finlerk/lucide-react-icons';
import { Button } from '@finlerk/shadcn-ui';
import { AuthProvidersEnum } from '@finlerk/shared';
import { signIn } from 'next-auth/react';
import React from 'react';

type OAuthProvidersEnum = Exclude<AuthProvidersEnum, AuthProvidersEnum.email>;

interface IProvider {
  title: string;
  provider: OAuthProvidersEnum;
  icon: React.ReactNode;
}

const providers: IProvider[] = [
  {
    title: 'Google',
    provider: AuthProvidersEnum.google,
    icon: <Icons.google className="w-4 h-4 mr-2" />,
  },
];

export function OAuthProviders() {
  const handleLogin = (provider: OAuthProvidersEnum) => () => {
    signIn(provider);
  };

  return providers.map((provider) => (
    <Button
      key={provider.provider}
      variant="outline"
      type="button"
      className="flex-1"
      onClick={handleLogin(provider.provider)}
    >
      {provider.icon}
      {provider.title}
    </Button>
  ));
}
