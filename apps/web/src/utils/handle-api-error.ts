import { ApiErrorType } from '@/lib/api/types/api-error.type';
import { toast } from '@qbick/shadcn-ui';
import { ErrorOption } from 'react-hook-form';

export const handleApiError = <T>(
  error: ApiErrorType<T>,
  setError?: (
    name: keyof T | `root.${string}` | 'root',
    error: ErrorOption,
    options?: {
      shouldFocus: boolean;
    },
  ) => void,
): void => {
  const fieldsErrors = error.response.data.errors;
  if (fieldsErrors && setError)
    Object.entries(fieldsErrors).map(([field, message]) =>
      setError(field as keyof T, {
        message,
      }),
    );
  else
    toast({
      variant: 'destructive',
      title: error.message,
      description: error.response.data.message,
    });
};
