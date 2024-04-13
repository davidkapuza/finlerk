'use client';

import { Icons } from '@qbick/lucide-react-icons';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import { authApi } from '../../lib/api/auth.api';
import { useRouter } from 'next/navigation';
import { handleApiError } from '@/utils/handle-api-error';
import { toast } from '@qbick/shadcn-ui';

export default function Confirmation() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const searchParams = useSearchParams();

  React.useEffect(() => {
    const hash = searchParams.get('hash');
    if (!hash) {
      toast({
        variant: 'destructive',
        title: 'The required data is missing',
        description: 'Missing hash',
      });
      router.push('/');
    }
    if (hash) {
      setIsLoading(true);
      authApi
        .confirmEamil({ hash })
        .then(() => router.push('/'))
        .catch((error) => {
          handleApiError(error);
          setIsLoading(false);
        });
    }
  }, [searchParams, router]);

  return (
    <div className="flex flex-col m-auto p-4 sm:w-[350px] h-screen justify-center">
      <h1>Email confirmation</h1>
      {isLoading && (
        <p className="flex flex-row items-center text-gray-400">
          <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
          Hold on, we&apos;re confirming your email...
        </p>
      )}
    </div>
  );
}