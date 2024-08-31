import { createApiRequest } from './create-api-request';
import { FetchApiRecord, RequestBody } from './fetch.types';

interface JsonMutationConfig {
  url: string;
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: FetchApiRecord;
  query?: FetchApiRecord;
  body?: RequestBody;
  withToken?: boolean;
}

export async function createJsonMutation<
  Response,
  Data extends Response,
  MappedData,
>(config: {
  request: JsonMutationConfig;
  response: {
    mapData: (data: Data) => MappedData;
  };
}): Promise<MappedData>;

export async function createJsonMutation<Response>(config: {
  request: JsonMutationConfig;
}): Promise<Response>;

export async function createJsonMutation<
  Response,
  Data extends Response,
  MappedData,
>(config: {
  request: JsonMutationConfig;
  response?: {
    mapData?: (data: Data) => MappedData;
  };
}) {
  const data = await createApiRequest({ request: config.request });

  return config?.response?.mapData ? config.response.mapData(data) : data;
}
