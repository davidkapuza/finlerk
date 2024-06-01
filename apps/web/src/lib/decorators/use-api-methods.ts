import { ApiConfig, RequestConfig } from '../api';
import { HttpResponseError } from '../errors';
import { getParamNames } from '../utils';
import _ from 'lodash';

function getRequestUrl(url: string, config: ApiConfig & RequestConfig): string {
  let requestUrl =
    url.startsWith('/') && config.baseUrl ? `${config.baseUrl}${url}` : url;

  if (config.params) {
    const searchParams = new URLSearchParams(config.params);
    requestUrl = `${requestUrl}?${searchParams}`;
  }
  return requestUrl;
}

const apiMethods = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch'];

export function UseApiMethods<T>(apiConfig?: ApiConfig) {
  return (target: { new (): T }) => {
    const descriptors = Object.getOwnPropertyDescriptors(target.prototype);
    for (const [propertyKey, descriptor] of Object.entries(descriptors)) {
      const isApiMethod =
        typeof descriptor.value == 'function' &&
        apiMethods.includes(propertyKey);

      if (!isApiMethod) continue;

      const original = descriptor.value;
      const paramNames = getParamNames(original);
      descriptor.value = async function (
        ...args: [url: string, data?: unknown, config?: RequestConfig]
      ) {
        const params: {
          url?: string;
          data?: unknown;
          config?: RequestConfig;
        } = paramNames.reduce((obj, pn, i) => {
          obj[pn] = args[i];
          return obj;
        }, {});

        const requestConfig = _.merge(apiConfig, params?.config);
        const url = getRequestUrl(params.url, requestConfig);

        const response = (await original.apply(
          this,
          [url, params?.data, requestConfig].filter(
            (value) => value !== undefined,
          ),
        )) as Response;

        if (!response.ok) {
          throw new HttpResponseError(response);
        }

        const data = await response.json().catch(() => null);

        return {
          ...response,
          data,
        };
      };

      Object.defineProperty(target.prototype, propertyKey, descriptor);
    }
  };
}
