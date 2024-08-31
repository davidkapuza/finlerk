export function baseUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/api${path}`;
}

export * as apiLib from './api.lib';
