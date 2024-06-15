import _ from 'lodash';
import { HttpResponseError } from '../errors';
import { Session } from 'next-auth';
import { User } from '@finlerk/shared';

export type ApiConfig = RequestInit & { baseUrl: string };

export type RequestConfig = Omit<
  RequestInit & {
    params?: Record<string, string>;
    baseUrl?: string;
  },
  'body'
>;

export type RequestResponse<T> = Response & { data: T };

// TODO Add the rest of the methods
/**
 * @class ApiClient Class is a fancy es6 wrapper for HTTP methods.
 */
export class ApiClient {
  private config: ApiConfig = {
    credentials: 'include',
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_DOMAIN,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };
  private session: Session;
  private update: (
    data: Partial<
      | Session
      | {
          user: Partial<User>;
        }
    >,
  ) => Promise<Session>;

  constructor(config?: ApiConfig) {
    if (config) this.config = _.merge({}, this.config, config);
  }
  /**
   * HTTP GET method.
   *
   * @template T - `TYPE`: expected object.
   * @template R - `RESPONSE`: expected response.
   * @param {string} url - endpoint you want to reach.
   * @param {RequestConfig} [config] - request configuration.
   * @returns {Promise<R>} - HTTP response payload.
   * @memberof ApiClient
   */
  protected async get<T, R = RequestResponse<T>>(
    url: string,
    config?: RequestConfig,
  ): Promise<R> {
    return this._request(url, 'GET', { config }) as R;
  }

  /**
   * HTTP POST method
   *
   * @template T - `TYPE`: expected object.
   * @template B - `BODY`: body request object.
   * @template R - `RESPONSE`: expected response.
   * @param {string} url - endpoint you want to reach.
   * @param {B} data - payload to be send as the `request body`,
   * @param {RequestConfig} [config] - axios request configuration.
   * @returns {Promise<R>} - HTTP response payload.
   * @memberof ApiClient
   */
  protected async post<T, B = unknown, R = RequestResponse<T>>(
    url: string,
    data?: B,
    config?: RequestConfig,
  ): Promise<R> {
    return this._request(url, 'POST', {
      data,
      config,
    }) as R;
  }

  /**
   * HTTP PATCH method
   *
   * @template T - `TYPE`: expected object.
   * @template B - `BODY`: body request object.
   * @template R - `RESPONSE`: expected response.
   * @param {string} url - endpoint you want to reach.
   * @param {B} data - payload to be send as the `request body`,
   * @param {RequestConfig} [config] - axios request configuration.
   * @returns {Promise<R>} - HTTP response payload.
   * @memberof ApiClient
   */
  protected async patch<T, B = unknown, R = RequestResponse<T>>(
    url: string,
    data?: B,
    config?: RequestConfig,
  ): Promise<R> {
    return this._request(url, 'PATCH', {
      data,
      config,
    }) as R;
  }

  /**
   * HTTP DELETE method.
   *
   * @template T - `TYPE`: expected object.
   * @template R - `RESPONSE`: expected response.
   * @param {string} url - endpoint you want to reach.
   * @param {RequestConfig} [config] - request configuration.
   * @returns {Promise<R>} - HTTP response payload.
   * @memberof ApiClient
   */
  protected async delete<T, R = RequestResponse<T>>(
    url: string,
    config?: RequestConfig,
  ): Promise<R> {
    return this._request(url, 'DELETE', { config }) as R;
  }

  public addBearerAuth(
    session: Session,
    update?: (
      data: Partial<Session | { user: Partial<User> }>,
    ) => Promise<Session>,
  ): this {
    this.session = session;
    this.update = update;
    if (session)
      this.config.headers['Authorization'] = `Bearer ${session.token}`;
    return this;
  }

  private async _request(
    url: string,
    method:
      | 'GET'
      | 'HEAD'
      | 'POST'
      | 'PUT'
      | 'DELETE'
      | 'CONNECT'
      | 'OPTIONS'
      | 'TRACE'
      | 'PATCH',
    {
      data,
      config,
    }: {
      data?: unknown;
      config?: RequestConfig;
    },
  ): Promise<unknown> {
    const requestConfig = _.merge({}, this.config, config);

    let requestUrl =
      url.startsWith('/') && requestConfig.baseUrl
        ? `${requestConfig.baseUrl}${url}`
        : url;

    if (requestConfig.params) {
      const searchParams = new URLSearchParams(requestConfig.params);
      requestUrl = `${requestUrl}?${searchParams}`;
    }

    const original = async (config: RequestConfig) => {
      return fetch(requestUrl, {
        ...config,
        method,
        body: data ? JSON.stringify(data) : undefined,
      });
    };
    let response = await original(requestConfig);

    const isServer = typeof window === 'undefined';

    if (!response.ok) {
      if (response.status === 401 && this.session?.refreshToken && !isServer) {
        const refreshResponse = await fetch(
          `${this.config.baseUrl}/api/v1/auth/refresh`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${this.session.refreshToken}`,
            },
          },
        );

        if (!refreshResponse.ok) throw new HttpResponseError(response);

        const updatedTokens = await refreshResponse.json();
        await this.update({ ...this.session, ...updatedTokens });
        requestConfig.headers[
          'Authorization'
        ] = `Bearer ${updatedTokens.token}`;

        response = await original(requestConfig);

        if (!response.ok) throw new HttpResponseError(response);
      } else {
        throw new HttpResponseError(response);
      }
    }

    const responseBody = await response.json().catch(() => null);

    return {
      ...response,
      data: responseBody,
    };
  }
}
