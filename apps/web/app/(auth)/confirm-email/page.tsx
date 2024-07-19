'use client';

import { authApi } from '@/entities/auth';
import { DEFAULT_REDIRECT, ROOT } from '@/shared/constants';
import { useToast } from '@finlerk/shadcn-ui';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

// TODO improve confirmation -> automatic user login after confirmation

export default function ConfirmEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { toast } = useToast();

  React.useEffect(() => {
    const hash = searchParams.get('hash');
    if (!hash) return router.push(ROOT);
    authApi
      .confirmEmail({ payload: { hash } })
      .then(() => {
        toast({
          title: 'The email has been successfully confirmed',
        });
        router.push(DEFAULT_REDIRECT);
      })
      .catch(() => {
        // TODO Better error handilng
        router.push(DEFAULT_REDIRECT);
      });
  }, [searchParams, router, toast]);

  return (
    <div className="flex flex-col m-auto p-4 sm:w-[350px] justify-center h-screen">
      <div className="flex flex-row items-end">
        <h1 className="text-3xl font-semibold tracking-tight">Confirmation</h1>
        <div className="flex flex-row gap-1 mb-1.5 ms-2">
          <div className="h-2 w-2 bg-foreground rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="h-2 w-2 bg-foreground rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 rounded-full bg-foreground animate-bounce" />
        </div>
      </div>
    </div>
  );
}
