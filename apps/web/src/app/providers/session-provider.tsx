'use client';
import { authModel } from '@/entities/auth';
import {
  SessionProvider as NextAuthSessionProvider,
  useSession,
} from 'next-auth/react';
import React, { ReactNode } from 'react';

interface SessionProviderProps {
  children: ReactNode;
}

function SessionProviderWithZustand(props: SessionProviderProps) {
  const { data: session, status } = useSession();

  React.useEffect(() => {
    if (status === 'authenticated') {
      authModel.sessionStore
        .getState()
        .updateTokens(session.token, session.refreshToken);
    } else if (status === 'unauthenticated') {
      authModel.sessionStore.getState().clearTokens();
    }
  }, [session, status]);

  return <>{props.children}</>;
}

export function SessionProvider(props: SessionProviderProps) {
  return (
    <NextAuthSessionProvider>
      <SessionProviderWithZustand>{props.children}</SessionProviderWithZustand>
    </NextAuthSessionProvider>
  );
}
