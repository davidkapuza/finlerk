import { HttpResponseError } from '../errors';

export function unauthorizedInterceptor<Target>(
  target: Target,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
) {
  const original = descriptor.value;
  descriptor.value = async function (...args: unknown[]) {
    try {
      return await original.apply(this, args);
    } catch (error) {
      const isServer = typeof window === 'undefined';
      if (
        error instanceof HttpResponseError &&
        error.response.status === 401 &&
        !isServer
      ) {
        const refreshResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/api/v1/auth/refresh`,
          {
            method: 'POST',
            credentials: 'include',
          },
        );

        if (!refreshResponse.ok) window.location.replace('/login');

        return await original.apply(this, args);
      }

      throw error;
    }
  };
}
