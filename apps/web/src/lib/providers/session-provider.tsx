'use client';
import React, { ReactNode } from 'react';
import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';

interface Props {
  children: ReactNode;
}

export function SessionProivder(props: Props) {
  return <NextAuthSessionProvider>{props.children}</NextAuthSessionProvider>;
}
