import { UseHttpMethods } from '../decorators';

@UseHttpMethods({
  credentials: 'include',
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_DOMAIN,
  headers: {
    'Content-Type': 'application/json',
  },
})
export class Api {
  public async get(url: RequestInfo | URL, init?: RequestInit) {
    return await fetch(url, {
      method: 'GET',
      ...init,
    });
  }

  public async post(url: RequestInfo | URL, init?: RequestInit) {
    return await fetch(url, {
      method: 'POST',
      ...init,
    });
  }
}

export const api = new Api();
