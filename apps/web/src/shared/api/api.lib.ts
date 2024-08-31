import { Path, UseFormReturn } from 'react-hook-form';
import { HttpError } from '../lib/fetch';

export function setFormErrors<T>(form: UseFormReturn<T>) {
  return (errorResponse: HttpError['response']) => {
    if (typeof errorResponse === 'string') {
      const obj = JSON.parse(errorResponse) as {
        status: number;
        errors: Partial<T>;
      };
      Object.entries(obj.errors).forEach(([key, message]) => {
        if (typeof message !== 'string') return;
        form.setError(key as Path<T>, {
          type: 'custom',
          message: message as string,
        });
      });
    }
  };
}
