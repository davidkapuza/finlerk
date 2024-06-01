import { UseApiMethods } from '../decorators';

export type ApiConfig = RequestInit & { baseUrl: string };

export type RequestConfig = Omit<
  ApiConfig & {
    params?: Record<string, string>;
  },
  'body'
>;

export type RequestResponse<T> = Response & { data: T };

export const config: ApiConfig = {
  credentials: 'include',
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_DOMAIN,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

// TODO Add the rest of the methods
/**
 * @class Api Class is a fancy es6 wrapper for HTTP methods.
 */
@UseApiMethods(config)
export class Api {
  constructor() {
    this.get = this.get.bind(this);
    this.post = this.post.bind(this);
    this.patch = this.patch.bind(this);
    this.delete = this.delete.bind(this);
  }
  /**
   * HTTP GET method.
   *
   * @access public
   * @template T - `TYPE`: expected object.
   * @template R - `RESPONSE`: expected response.
   * @param {string} url - endpoint you want to reach.
   * @param {RequestConfig} [config] - request configuration.
   * @returns {Promise<R>} - HTTP response payload.
   * @memberof Api
   */
  public async get<T, R = RequestResponse<T>>(
    url: string,
    config?: RequestConfig,
  ): Promise<R> {
    return fetch(url, {
      ...config,
      method: 'GET',
    }) as R;
  }

  /**
   * HTTP POST method
   *
   * @access public
   * @template T - `TYPE`: expected object.
   * @template B - `BODY`: body request object.
   * @template R - `RESPONSE`: expected response.
   * @param {string} url - endpoint you want to reach.
   * @param {B} data - payload to be send as the `request body`,
   * @param {RequestConfig} [config] - axios request configuration.
   * @returns {Promise<R>} - HTTP response payload.
   * @memberof Api
   */
  public async post<T, B = unknown, R = RequestResponse<T>>(
    url: string,
    data?: B,
    config?: RequestConfig,
  ): Promise<R> {
    return fetch(url, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }) as R;
  }

  /**
   * HTTP PATCH method
   *
   * @access public
   * @template T - `TYPE`: expected object.
   * @template B - `BODY`: body request object.
   * @template R - `RESPONSE`: expected response.
   * @param {string} url - endpoint you want to reach.
   * @param {B} data - payload to be send as the `request body`,
   * @param {RequestConfig} [config] - axios request configuration.
   * @returns {Promise<R>} - HTTP response payload.
   * @memberof Api
   */
  public async patch<T, B = unknown, R = RequestResponse<T>>(
    url: RequestInfo | URL,
    data?: B,
    config?: RequestConfig,
  ): Promise<R> {
    return fetch(url, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }) as R;
  }

  /**
   * HTTP DELETE method.
   *
   * @access public
   * @template T - `TYPE`: expected object.
   * @template R - `RESPONSE`: expected response.
   * @param {string} url - endpoint you want to reach.
   * @param {RequestConfig} [config] - request configuration.
   * @returns {Promise<R>} - HTTP response payload.
   * @memberof Api
   */
  public async delete<T, R = RequestResponse<T>>(
    url: string,
    config?: RequestConfig,
  ): Promise<R> {
    return fetch(url, {
      ...config,
      method: 'DELETE',
    }) as R;
  }
}

export const api = new Api();
