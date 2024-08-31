import { isServer } from '@/shared/constants';
import { httpError, networkError } from './fetch.errors';
import { formatUrl, formatHeaders } from './fetch.lib';
import { HttpMethod, RequestBody, FetchApiRecord } from './fetch.types';
import { getSession } from 'next-auth/react';
import { accessAuthorizationHeader } from '@/entities/auth/auth.model';
import { authModel } from '@/entities/auth';
import { auth } from '../next-auth';

interface ApiRequest {
  method: HttpMethod;
  body?: RequestBody;
  headers?: FetchApiRecord;
  query?: FetchApiRecord;
  url: string;
  withToken?: boolean;
}

interface ApiConfig {
  request: ApiRequest;
  abort?: AbortSignal;
}

export async function createApiRequest(config: ApiConfig) {
  const headers: FetchApiRecord = config.request.headers || {};

  if (config.request.withToken) {
    if (isServer) {
      const session = await auth();
      if (session) {
        Object.assign(headers, { Authorization: `Bearer ${session.token}` });
      }
    } else {
      Object.assign(headers, { ...accessAuthorizationHeader() });
    }
  }

  async function request(): Promise<Response> {
    return fetch(
      formatUrl({
        href: config.request.url,
        query: config.request.query || {},
      }),
      {
        method: config.request.method,
        headers: formatHeaders(headers),
        body: config.request.body,
        signal: config?.abort,
      },
    ).catch((error) => {
      throw networkError({
        reason: error?.message ?? null,
        cause: error,
      });
    });
  }

  let response = await request();

  if (
    !response.ok &&
    !isServer &&
    response.status === 401 &&
    config.request.withToken
  ) {
    const session = await getSession();
    Object.assign(headers, { Authorization: `Bearer ${session.token}` });
    authModel.sessionStore
      .getState()
      .updateTokens(session.token, session.refreshToken);
    response = await request();
  }

  if (!response.ok) {
    throw httpError({
      status: response.status,
      statusText: response.statusText,
      response: (await response.text().catch(() => null)) ?? null,
    });
  }

  const clonedResponse = response.clone();

  const data = !response.body
    ? null
    : await response.json().catch(() => clonedResponse.text());

  return data;
}
