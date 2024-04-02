import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Axios } from './axios';

/**
 * @class Api Class is a fancy es6 wrapper class for axios.
 *
 * @param {import("axios").AxiosRequestConfig} config - axios Request Config.
 * @link [AxiosRequestConfig](https://github.com/axios/axios#request-config)
 */
export class Api extends Axios {
  private isServer: boolean;

  /**
   * Creates an instance of api.
   * @param {import("axios").AxiosRequestConfig} conf
   */
  public constructor(conf: AxiosRequestConfig) {
    super(conf);

    this.isServer = typeof window === 'undefined';

    this.interceptors.request.use(async (config) => {
      if (this.isServer) {
        const { cookies } = await import('next/headers');
        config.headers.Cookie = cookies().toString();
      }
      return config;
    });

    // this middleware is been called right before the response is get it by the method that triggers the request
    this.interceptors.response.use(
      (config) => {
        return config;
      },
      async (error) => {
        const originalRequest = error.config;
        if (
          error.response?.status == 401 &&
          error.config &&
          !error.config._isRetry
        ) {
          originalRequest._isRetry = true;
          await this.post(`/api/v1/auth/refresh`)
            .then(() => {
              return this.request(originalRequest);
            })
            .catch(() => {
              console.log('Unauthorized');
            });
        }
        throw error;
      },
    );
  }
  /**
   * Get Uri
   *
   * @param {import("axios").AxiosRequestConfig} [config]
   * @returns {string}
   * @memberof Api
   */
  public getUri(config?: AxiosRequestConfig): string {
    return this.getUri(config);
  }
  /**
   * Generic request.
   *
   * @access public
   * @template T - `TYPE`: expected object.
   * @template R - `RESPONSE`: expected object inside a axios response format.
   * @param {import("axios").AxiosRequestConfig} [config] - axios request configuration.
   * @returns {Promise<R>} - HTTP axios response payload.
   * @memberof Api
   *
   * @example
   * api.request({
   *   method: "GET|POST|DELETE|PUT|PATCH"
   *   baseUrl: "http://www.domain.com",
   *   url: "/api/v1/users",
   *   headers: {
   *     "Content-Type": "application/json"
   *  }
   * }).then((response: AxiosResponse<User>) => response.data)
   *
   */
  public request<T, R = AxiosResponse<T>>(
    config: AxiosRequestConfig,
  ): Promise<R> {
    return this.request(config);
  }
  /**
   * HTTP GET method, used to fetch data `statusCode`: 200.
   *
   * @access public
   * @template T - `TYPE`: expected object.
   * @template R - `RESPONSE`: expected object inside a axios response format.
   * @param {string} url - endpoint you want to reach.
   * @param {import("axios").AxiosRequestConfig} [config] - axios request configuration.
   * @returns {Promise<R>} HTTP `axios` response payload.
   * @memberof Api
   */
  public get<T, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.get(url, config);
  }
  /**
   * HTTP OPTIONS method.
   *
   * @access public
   * @template T - `TYPE`: expected object.
   * @template R - `RESPONSE`: expected object inside a axios response format.
   * @param {string} url - endpoint you want to reach.
   * @param {import("axios").AxiosRequestConfig} [config] - axios request configuration.
   * @returns {Promise<R>} HTTP `axios` response payload.
   * @memberof Api
   */
  public options<T, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.options(url, config);
  }
  /**
   * HTTP DELETE method, `statusCode`: 204 No Content.
   *
   * @access public
   * @template T - `TYPE`: expected object.
   * @template R - `RESPONSE`: expected object inside a axios response format.
   * @param {string} url - endpoint you want to reach.
   * @param {import("axios").AxiosRequestConfig} [config] - axios request configuration.
   * @returns {Promise<R>} - HTTP [axios] response payload.
   * @memberof Api
   */
  public delete<T, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.delete(url, config);
  }
  /**
   * HTTP HEAD method.
   *
   * @access public
   * @template T - `TYPE`: expected object.
   * @template R - `RESPONSE`: expected object inside a axios response format.
   * @param {string} url - endpoint you want to reach.
   * @param {import("axios").AxiosRequestConfig} [config] - axios request configuration.
   * @returns {Promise<R>} - HTTP [axios] response payload.
   * @memberof Api
   */
  public head<T, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.head(url, config);
  }
  /**
   * HTTP POST method `statusCode`: 201 Created.
   *
   * @access public
   * @template T - `TYPE`: expected object.
   * @template B - `BODY`: body request object.
   * @template R - `RESPONSE`: expected object inside a axios response format.
   * @param {string} url - endpoint you want to reach.
   * @param {B} data - payload to be send as the `request body`,
   * @param {import("axios").AxiosRequestConfig} [config] - axios request configuration.
   * @returns {Promise<R>} - HTTP [axios] response payload.
   * @memberof Api
   */
  public post<T, B, R = AxiosResponse<T>>(
    url: string,
    data?: B,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.post(url, data, config);
  }
  /**
   * HTTP PUT method.
   *
   * @access public
   * @template T - `TYPE`: expected object.
   * @template B - `BODY`: body request object.
   * @template R - `RESPONSE`: expected object inside a axios response format.
   * @param {string} url - endpoint you want to reach.
   * @param {B} data - payload to be send as the `request body`,
   * @param {import("axios").AxiosRequestConfig} [config] - axios request configuration.
   * @returns {Promise<R>} - HTTP [axios] response payload.
   * @memberof Api
   */
  public put<T, B, R = AxiosResponse<T>>(
    url: string,
    data?: B,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.put(url, data, config);
  }
  /**
   * HTTP PATCH method.
   *
   * @access public
   * @template T - `TYPE`: expected object.
   * @template B - `BODY`: body request object.
   * @template R - `RESPONSE`: expected object inside a axios response format.
   * @param {string} url - endpoint you want to reach.
   * @param {B} data - payload to be send as the `request body`,
   * @param {import("axios").AxiosRequestConfig} [config] - axios request configuration.
   * @returns {Promise<R>} - HTTP [axios] response payload.
   * @memberof Api
   */
  public patch<T, B, R = AxiosResponse<T>>(
    url: string,
    data?: B,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.patch(url, data, config);
  }
  /**
   *
   * @template T - type.
   * @param {import("axios").AxiosResponse<T>} response - axios response.
   * @returns {T} - expected object.
   * @memberof Api
   */
  public success<T>(response: AxiosResponse<T>): T {
    return response.data;
  }
  /**
   *
   *
   * @template T type.
   * @param {AxiosError<T>} error
   * @memberof Api
   */
  public error<T>(error: AxiosError<T>): void {
    throw error;
  }
}
