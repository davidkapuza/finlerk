'use client';

import { User } from '@finlerk/shared';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import React from 'react';
import { ApiConfig } from '../api-client';

export function useApi<
  T extends {
    addBearerAuth: (
      session: Session,
      update: (
        data: Partial<
          | Session
          | {
              user: Partial<User>;
            }
        >,
      ) => Promise<Session>,
    ) => T;
  },
>(Api: new (config?: ApiConfig) => T, config?: ApiConfig): T {
  const { data: session, update } = useSession();
  const api = React.useRef<T>(new Api(config));

  React.useEffect(() => {
    api.current.addBearerAuth(session, update);
  }, [session, update]);

  return api.current;
}
