import { createApiRequest } from './create-api-request';
import { FetchApiRecord } from './fetch.types';

interface JsonQueryConfig {
  url: string;
  method: 'HEAD' | 'GET';
  headers?: FetchApiRecord;
  query?: FetchApiRecord;
}

export async function createJsonQuery<
  Response,
  Data extends Response,
  MappedData,
>(config: {
  request: JsonQueryConfig;
  response: {
    mapData: (data: Data) => MappedData;
  };
  abort?: AbortSignal;
}): Promise<MappedData>;

export async function createJsonQuery<Response>(config: {
  request: JsonQueryConfig;
  abort?: AbortSignal;
}): Promise<Response>;

export async function createJsonQuery<
  Response,
  Data extends Response,
  MappedData,
>(config: {
  request: JsonQueryConfig;
  response?: {
    mapData?: (data: Data) => MappedData;
  };
  abort?: AbortSignal;
}) {
  const data = await createApiRequest({
    request: config.request,
    abort: config.abort,
  });

  return config?.response?.mapData ? config.response.mapData(data) : data;
}
