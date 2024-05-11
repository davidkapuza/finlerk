import { HttpResponseError } from '../errors';

export function UseHttpMethods<T>(
  httpConfig?: RequestInit & { baseUrl: string },
) {
  return (target: { new (): T }) => {
    const descriptors = Object.getOwnPropertyDescriptors(target.prototype);
    for (const [propertyKey, descriptor] of Object.entries(descriptors)) {
      const isMethod =
        typeof descriptor.value == 'function' && propertyKey != 'constructor';

      if (!isMethod) continue;

      const original = descriptor.value;
      descriptor.value = async function (
        input: RequestInfo | URL,
        init?: RequestInit,
      ) {
        const config: RequestInit = { ...init, ...httpConfig };
        const isServer = typeof window === 'undefined';
        if (isServer) {
          const { cookies } = await import('next/headers');

          config.headers = {
            ...config.headers,
            Cookie: cookies().toString(),
          };
        }

        input =
          typeof input === 'string' &&
          input.startsWith('/') &&
          httpConfig.baseUrl
            ? `${httpConfig.baseUrl}${input}`
            : input;

        const response = (await original.call(this, input, config)) as Response;

        if (!response.ok) {
          throw new HttpResponseError(response);
        }

        return response;
      };

      Object.defineProperty(target.prototype, propertyKey, descriptor);
    }
  };
}
